/**
 * DryRun verifier.
 *
 *   npm run verify                      # everything
 *   npm run verify -- --only two-sum    # some problems (comma separated slugs)
 *   npm run verify -- --module two-pointers
 *   npm run verify -- --lang python     # one language
 *   npm run verify -- --videos-only
 *
 * 1. Checks the curriculum and every lesson/problem module.
 * 2. Builds every video, checks frames for broken values and over-long narration.
 * 3. Generates Java, Python and C++ drivers from each problem's judge spec, compiles
 *    and runs every approach against every test (plus the video's own example).
 */
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { MODULES, PROBLEMS } from '../src/content/curriculum';
import type { Cmp, DesignJudge, FnJudge, Lesson, Problem, Rng } from '../src/content/types';
import type { VideoScript } from '../src/engine/types';
import { CHECKERS } from './checkers';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TMP = path.join(ROOT, '.verify-tmp');
const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const ONLY = opt('only')?.split(',');
const MODULE = opt('module')?.split(',');
const LANG = opt('lang');
const VIDEOS_ONLY = args.includes('--videos-only');
const QUIET = args.includes('--quiet');

type Lang = 'java' | 'python' | 'cpp';
const LANGS: Lang[] = LANG ? [LANG as Lang] : ['java', 'python', 'cpp'];
const EXT: Record<Lang, string> = { java: 'java', python: 'py', cpp: 'cpp' };

const errors: string[] = [];
const warnings: string[] = [];
const err = (s: string) => errors.push(s);
const warn = (s: string) => warnings.push(s);

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
}

/* ------------------------------------------------------------------ */
/* Video checks                                                         */
/* ------------------------------------------------------------------ */

function checkVideo(label: string, s: VideoScript) {
  if (!s.frames.length) err(`${label}: video has no frames`);
  s.frames.forEach((f, i) => {
    if (f.ch < 0 || f.ch >= s.chapters.length) err(`${label}: frame ${i} has bad chapter`);
    const blob = JSON.stringify(f);
    if (/\bNaN\b|undefined|\[object Object\]|Infinity/.test(blob)) err(`${label}: frame ${i} contains NaN/undefined/Infinity: ${blob.slice(0, 200)}`);
    if (f.say.length > 480) warn(`${label}: frame ${i} narration is long (${f.say.length} chars)`);
    const ids = f.panels.map((p) => p.id);
    if (new Set(ids).size !== ids.length) err(`${label}: frame ${i} has duplicate panel ids`);
    for (const p of f.panels) {
      if (p.kind === 'array') for (const pt of p.ptrs) if (pt.at < -1 || pt.at > p.items.length) err(`${label}: frame ${i} pointer ${pt.name} out of range (${pt.at})`);
      if (p.kind === 'tree') for (const pt of p.ptrs) if (!p.nodes[pt.node]) err(`${label}: frame ${i} tree pointer ${pt.name} on missing node`);
    }
    const ch = s.chapters[f.ch];
    if (ch?.code) for (const l of f.line) if (l >= ch.code.length) err(`${label}: frame ${i} highlights code line ${l} but chapter has ${ch.code.length}`);
  });
  const said = s.frames.filter((f) => f.say).length;
  if (said < 2) warn(`${label}: only ${said} narrated frames`);
  const words = s.frames.reduce((a, f) => a + (f.say ? f.say.split(/\s+/).length : 0), 0);
  return { frames: s.frames.length, words };
}

/* ------------------------------------------------------------------ */
/* Seeded random tests                                                  */
/* ------------------------------------------------------------------ */

function makeRng(seedText: string): Rng {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353), (h = (h << 13) | (h >>> 19));
  let a = h >>> 0;
  const next = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r: Rng = {
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    ints: (n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi)),
    distinct: (n, lo, hi) => {
      const s = new Set<number>();
      while (s.size < Math.min(n, hi - lo + 1)) s.add(r.int(lo, hi));
      return [...s];
    },
    shuffle: (arr) => {
      const x = [...arr];
      for (let i = x.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [x[i], x[j]] = [x[j], x[i]];
      }
      return x;
    },
    chance: (p) => next() < p,
    str: (n, alphabet) => Array.from({ length: n }, () => alphabet[Math.floor(next() * alphabet.length)]).join(''),
  };
  return r;
}
const deepClone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

function fnTestsFor(slug: string, j: FnJudge): Test[] {
  const tests: Test[] = j.tests.map((t) => ({ args: t.args, out: t.out, big: t.big }));
  if (j.gen && j.ref) {
    const r = makeRng(slug);
    for (let i = 0; i < (j.genCount ?? 30); i++) {
      const a = j.gen(r);
      tests.push({ args: a, out: j.ref(...deepClone(a)) });
    }
  }
  return tests;
}
function designTestsFor(slug: string, j: DesignJudge) {
  const tests = [...j.tests];
  if (j.gen && j.ref) {
    const r = makeRng(slug);
    for (let i = 0; i < (j.genCount ?? 20); i++) {
      const t = j.gen(r);
      tests.push({ ...t, out: j.ref(t.ops, deepClone(t.args)) });
    }
  }
  return tests;
}

/* ------------------------------------------------------------------ */
/* Types → literals                                                     */
/* ------------------------------------------------------------------ */

const baseT = (t: string) => t.split('@')[0];
const elemT = (t: string) => (t.endsWith('[]') ? t.slice(0, -2) : t.startsWith('List<') ? t.slice(5, -1) : '');
const isList = (t: string) => t.startsWith('List<');
const isArr = (t: string) => t.endsWith('[]');
const BOX: Record<string, string> = { int: 'Integer', long: 'Long', double: 'Double', boolean: 'Boolean', char: 'Character' };

function javaType(t: string): string {
  t = baseT(t);
  return t;
}
function javaLit(t: string, v: any, ctx: { treeVar?: string }): string {
  const tag = t.split('@')[1];
  t = baseT(t);
  if (tag === 'cycle') return `H.cycle(new int[]{${v[0].join(',')}}, ${v[1]})`;
  if (tag === 'ref' && t === 'TreeNode') return v === null ? 'null' : `H.find(${ctx.treeVar}, ${v})`;
  switch (t) {
    case 'int': return v === -2147483648 ? 'Integer.MIN_VALUE' : String(v);
    case 'long': return `${v}L`;
    case 'double': return Number.isInteger(v) ? `${v}.0` : String(v);
    case 'boolean': return String(v);
    case 'String': return JSON.stringify(v);
    case 'char': return `'${v === "'" ? "\\'" : v === '\\' ? '\\\\' : v}'`;
    case 'ListNode': return `H.list(new int[]{${(v as number[]).join(',')}})`;
    case 'TreeNode': return `H.tree(new Integer[]{${(v as (number | null)[]).map((x) => (x === null ? 'null' : x)).join(',')}})`;
  }
  if (isArr(t)) {
    const e = elemT(t);
    return `new ${t}{${(v as any[]).map((x) => javaLit(e, x, ctx)).join(', ')}}`;
  }
  if (isList(t)) {
    const e = elemT(t);
    const eb = BOX[e] ?? e;
    return `H.<${eb}>L(${(v as any[]).map((x) => javaLit(e, x, ctx)).join(', ')})`;
  }
  throw new Error(`java: unsupported type ${t}`);
}

function pyLit(t: string, v: any, ctx: { treeVar?: string }): string {
  const tag = t.split('@')[1];
  t = baseT(t);
  if (tag === 'cycle') return `H.cycle(${pyVal(v[0])}, ${v[1]})`;
  if (tag === 'ref' && t === 'TreeNode') return v === null ? 'None' : `H.find(${ctx.treeVar}, ${v})`;
  if (t === 'ListNode') return `H.list(${pyVal(v)})`;
  if (t === 'TreeNode') return `H.tree(${pyVal(v)})`;
  if (t === 'ListNode[]') return `[${(v as any[]).map((x) => `H.list(${pyVal(x)})`).join(', ')}]`;
  if (t === 'double' && Number.isInteger(v)) return `${v}.0`;
  return pyVal(v);
}
function pyVal(v: any): string {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(pyVal).join(', ')}]`;
  throw new Error('py: unsupported value');
}

function cppType(t: string): string {
  t = baseT(t);
  const m: Record<string, string> = { int: 'int', long: 'long long', double: 'double', boolean: 'bool', String: 'string', char: 'char', ListNode: 'ListNode*', TreeNode: 'TreeNode*', Integer: 'int', Double: 'double', Long: 'long long', Boolean: 'bool', Character: 'char' };
  if (m[t]) return m[t];
  if (isArr(t) || isList(t)) return `vector<${cppType(elemT(t))}>`;
  throw new Error(`cpp: unsupported type ${t}`);
}
function cppLit(t: string, v: any, ctx: { treeVar?: string }): string {
  const tag = t.split('@')[1];
  t = baseT(t);
  if (tag === 'cycle') return `H::cycle({${v[0].join(',')}}, ${v[1]})`;
  if (tag === 'ref' && t === 'TreeNode') return v === null ? 'nullptr' : `H::find(${ctx.treeVar}, ${v})`;
  switch (t) {
    case 'int': case 'Integer': return v === -2147483648 ? '(-2147483647-1)' : String(v);
    case 'long': case 'Long': return `${v}LL`;
    case 'double': case 'Double': return Number.isInteger(v) ? `${v}.0` : String(v);
    case 'boolean': case 'Boolean': return String(v);
    case 'String': return `string(${JSON.stringify(v)})`;
    case 'char': case 'Character': return `'${v === "'" ? "\\'" : v === '\\' ? '\\\\' : v}'`;
    case 'ListNode': return `H::list({${(v as number[]).join(',')}})`;
    case 'TreeNode': return `H::tree({${(v as (number | null)[]).map((x) => (x === null ? 'H::NUL' : x)).join(',')}})`;
  }
  if (isArr(t) || isList(t)) {
    const e = elemT(t);
    return `${cppType(t)}{${(v as any[]).map((x) => cppLit(e, x, ctx)).join(', ')}}`;
  }
  throw new Error(`cpp: unsupported type ${t}`);
}

/* ------------------------------------------------------------------ */
/* Driver generation                                                    */
/* ------------------------------------------------------------------ */

interface Test {
  args: unknown[];
  out: unknown;
  video?: boolean;
  big?: boolean;
}
interface Job {
  id: string; // unique solution id
  slug: string;
  approach: string;
  lang: Lang;
  code: string;
  judge: FnJudge | DesignJudge;
  tests: Test[];
}

function treeVarFor(params: string[], idx: number) {
  for (let i = idx - 1; i >= 0; i--) if (baseT(params[i]) === 'TreeNode') return `a${i}`;
  return 'a0';
}

function javaFnTest(j: FnJudge, t: Test, ti: number, id: string) {
  const decls = j.params.map((p, i) => `${javaType(p)} a${i} = ${javaLit(p, t.args[i], { treeVar: treeVarFor(j.params, i) })};`).join(' ');
  const call = `new Solution().${j.fn}(${j.params.map((_, i) => `a${i}`).join(', ')})`;
  let body: string;
  if (j.ret === 'void') body = `${call}; H.emit("${id}", ${ti}, H.ser(a${j.inplace ?? 0}));`;
  else if (j.returnK !== undefined) body = `int k = ${call}; H.emit("${id}", ${ti}, H.ser(java.util.Arrays.copyOf(a${j.returnK}, k)));`;
  else if (j.ret === 'ListNode@ref') body = `ListNode r = ${call}; H.emit("${id}", ${ti}, H.ser(H.indexOf(r)));`;
  else if (j.inplace !== undefined) body = `${call}; H.emit("${id}", ${ti}, H.ser(a${j.inplace}));`;
  else body = `${javaType(j.ret)} r = ${call}; H.emit("${id}", ${ti}, H.ser(r));`;
  return `try { ${decls} ${body} } catch (Throwable e) { H.fail("${id}", ${ti}, e); }`;
}
function javaDesignTest(j: DesignJudge, t: { ops: string[]; args: unknown[][] }, ti: number, id: string) {
  const parts: string[] = [`StringBuilder sb = new StringBuilder("[");`, `${j.cls} o = null;`];
  t.ops.forEach((op, k) => {
    const sig = k === 0 ? { params: j.ctor, ret: 'void' } : j.methods[op];
    if (!sig) throw new Error(`design ${j.cls}: unknown method ${op}`);
    const decls = sig.params.map((p, i) => `${javaType(p)} a${i} = ${javaLit(p, t.args[k][i], {})};`).join(' ');
    const argl = sig.params.map((_, i) => `a${i}`).join(', ');
    const sep = k === 0 ? '' : 'sb.append(",");';
    if (k === 0) parts.push(`{ ${decls} o = new ${j.cls}(${argl}); sb.append("null"); }`);
    else if (sig.ret === 'void') parts.push(`{ ${decls} ${sep} o.${op}(${argl}); sb.append("null"); }`);
    else parts.push(`{ ${decls} ${sep} sb.append(H.ser(o.${op}(${argl}))); }`);
  });
  parts.push(`sb.append("]"); H.emit("${id}", ${ti}, sb.toString());`);
  return `try { ${parts.join(' ')} } catch (Throwable e) { H.fail("${id}", ${ti}, e); }`;
}

function pyFnTest(j: FnJudge, t: Test) {
  const decls = j.params.map((p, i) => `    a${i} = ${pyLit(p, t.args[i], { treeVar: treeVarFor(j.params, i) })}`).join('\n');
  const call = `ns['Solution']().${j.fn}(${j.params.map((_, i) => `a${i}`).join(', ')})`;
  let ret: string;
  if (j.ret === 'void') ret = `    ${call}\n    return H.ser(a${j.inplace ?? 0})`;
  else if (j.returnK !== undefined) ret = `    k = ${call}\n    return H.ser(a${j.returnK}[:k])`;
  else if (j.ret === 'ListNode@ref') ret = `    return H.ser(H.index_of(${call}))`;
  else if (j.inplace !== undefined) ret = `    ${call}\n    return H.ser(a${j.inplace})`;
  else ret = `    return H.ser(${call})`;
  return `${decls || '    pass'}\n${ret}`;
}
function pyDesignTest(j: DesignJudge, t: { ops: string[]; args: unknown[][] }) {
  const lines = ['    out = []'];
  t.ops.forEach((op, k) => {
    const sig = k === 0 ? { params: j.ctor } : j.methods[op];
    const argl = sig.params.map((p, i) => pyLit(p, t.args[k][i], {})).join(', ');
    if (k === 0) lines.push(`    o = ns['${j.cls}'](${argl})`, '    out.append(None)');
    else lines.push(`    out.append(H.plain(o.${op}(${argl})))`);
  });
  lines.push('    return H.ser(out)');
  return lines.join('\n');
}

function cppFnTest(j: FnJudge, t: Test, ti: number, id: string) {
  const decls = j.params.map((p, i) => `${cppType(p)} a${i} = ${cppLit(p, t.args[i], { treeVar: treeVarFor(j.params, i) })};`).join(' ');
  const call = `sol.${j.fn}(${j.params.map((_, i) => `a${i}`).join(', ')})`;
  let body: string;
  if (j.ret === 'void') body = `${call}; H::emit("${id}", ${ti}, H::ser(a${j.inplace ?? 0}));`;
  else if (j.returnK !== undefined) body = `int k = ${call}; H::emit("${id}", ${ti}, H::ser(decltype(a${j.returnK})(a${j.returnK}.begin(), a${j.returnK}.begin() + k)));`;
  else if (j.ret === 'ListNode@ref') body = `ListNode* r = ${call}; H::emit("${id}", ${ti}, H::ser(H::indexOf(r)));`;
  else if (j.inplace !== undefined) body = `${call}; H::emit("${id}", ${ti}, H::ser(a${j.inplace}));`;
  else body = `auto r = ${call}; H::emit("${id}", ${ti}, H::ser(r));`;
  return `{ Solution sol; ${decls} ${body} }`;
}
function cppDesignTest(j: DesignJudge, t: { ops: string[]; args: unknown[][] }, ti: number, id: string) {
  const parts: string[] = [`string out = "[";`, `${j.cls}* o = nullptr;`];
  t.ops.forEach((op, k) => {
    const sig = k === 0 ? { params: j.ctor, ret: 'void' } : j.methods[op];
    const decls = sig.params.map((p, i) => `${cppType(p)} a${i} = ${cppLit(p, t.args[k][i], {})};`).join(' ');
    const argl = sig.params.map((_, i) => `a${i}`).join(', ');
    if (k === 0) parts.push(`{ ${decls} o = new ${j.cls}(${argl}); out += "null"; }`);
    else if (sig.ret === 'void') parts.push(`{ ${decls} out += ","; o->${op}(${argl}); out += "null"; }`);
    else parts.push(`{ ${decls} out += ","; out += H::ser(o->${op}(${argl})); }`);
  });
  parts.push(`H::emit("${id}", ${ti}, out + "]");`);
  return `{ ${parts.join(' ')} }`;
}

/* ------------------------------------------------------------------ */
/* Runners                                                              */
/* ------------------------------------------------------------------ */

type Result = Map<string, Map<number, string>>; // job id → test → raw output

function parseOutput(text: string, into: Result) {
  for (const line of text.split('\n')) {
    if (!line.startsWith('@@')) continue;
    const [id, t, ...rest] = line.slice(2).split('\t');
    if (!into.has(id)) into.set(id, new Map());
    into.get(id)!.set(Number(t), rest.join('\t'));
  }
}

function run(cmd: string, argv: string[], cwd: string, timeoutMs: number): Promise<{ code: number | null; out: string; errText: string }> {
  return new Promise((resolve) => {
    const p = spawn(cmd, argv, { cwd });
    let out = '';
    let errText = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (errText += d));
    const t = setTimeout(() => p.kill('SIGKILL'), timeoutMs);
    p.on('close', (code) => {
      clearTimeout(t);
      resolve({ code, out, errText });
    });
  });
}

async function pool<T>(items: T[], n: number, f: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) await f(items[i++]);
  }));
}

function stripJavaImports(code: string) {
  return code.replace(/^\s*import\s+[^;]+;\s*$/gm, '');
}

async function runJava(jobs: Job[], res: Result) {
  if (!jobs.length) return;
  const dir = path.join(TMP, 'java');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'scripts/harness/H.java'), path.join(dir, 'H.java'));
  const classes: string[] = [];
  jobs.forEach((j, n) => {
    const cls = `W${n}`;
    classes.push(cls);
    const code = stripJavaImports(j.code).replace(/^(public\s+|final\s+|abstract\s+)*(class|interface|enum|record)\s/gm, 'static $2 ');
    const tests = j.judge.type === 'fn'
      ? j.tests.map((t, ti) => javaFnTest(j.judge as FnJudge, t, ti, j.id))
      : (j.judge as DesignJudge).tests.map((t, ti) => javaDesignTest(j.judge as DesignJudge, t, ti, j.id));
    fs.writeFileSync(
      path.join(dir, `${cls}.java`),
      `import java.util.*;\nimport java.util.function.*;\nimport java.util.stream.*;\n\nclass ${cls} {\n${code}\n\n${tests.map((t, ti) => `  static void t${ti}() {\n    ${t}\n  }`).join('\n')}\n  static void run() {\n${tests.map((_, ti) => `    t${ti}();`).join('\n')}\n  }\n}\n`,
    );
  });
  fs.writeFileSync(
    path.join(dir, 'Main.java'),
    `public class Main {\n  public static void main(String[] args) throws Exception {\n${classes
      .map((c, n) => `    { Thread t = new Thread(null, () -> { try { ${c}.run(); } catch (Throwable e) { H.fail("${jobs[n].id}", -1, e); } }, "${c}", 1L << 28); t.setDaemon(true); t.start(); t.join(15000); if (t.isAlive()) System.out.println("@@${jobs[n].id}\\t-1\\tERR\\tTimeout"); }`)
      .join('\n')}\n    System.out.flush();\n    System.exit(0);\n  }\n}\n`,
  );
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.java'));
  const c = await run('javac', ['-nowarn', '-encoding', 'UTF-8', '-J-Xmx2g', '-d', 'out', ...files], dir, 600000);
  if (c.code !== 0) {
    // Report compile errors per job file.
    const byFile = new Map<string, string[]>();
    for (const line of c.errText.split('\n')) {
      const m = line.match(/^(W\d+)\.java:(\d+): error: (.*)$/);
      if (m) (byFile.get(m[1]) ?? byFile.set(m[1], []).get(m[1])!).push(`line ${m[2]}: ${m[3]}`);
    }
    if (!byFile.size) err(`java compile failed:\n${c.errText.slice(0, 3000)}`);
    for (const [f, msgs] of byFile) {
      const j = jobs[Number(f.slice(1))];
      err(`[java] ${j.slug}/${j.approach}: compile error: ${msgs.slice(0, 3).join(' | ')}`);
    }
    // Retry without the broken files.
    const bad = new Set([...byFile.keys()].map((f) => Number(f.slice(1))));
    if (!bad.size) return;
    return runJava(jobs.filter((_, i) => !bad.has(i)), res);
  }
  const r = await run('java', ['-Xss512m', '-Xmx2g', '-cp', 'out', 'Main'], dir, 900000);
  parseOutput(r.out, res);
  if (r.code !== 0 && !r.out) err(`java run failed: ${r.errText.slice(0, 1500)}`);
}

async function runPython(jobs: Job[], res: Result) {
  if (!jobs.length) return;
  const dir = path.join(TMP, 'python');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const prelude = fs.readFileSync(path.join(ROOT, 'scripts/harness/prelude.py'), 'utf8');
  const chunks: Job[][] = [];
  for (let i = 0; i < jobs.length; i += 40) chunks.push(jobs.slice(i, i + 40));
  await pool(chunks.map((c, i) => ({ c, i })), os.cpus().length, async ({ c, i }) => {
    const body = c
      .map((j, n) => {
        const tests = j.judge.type === 'fn'
          ? j.tests.map((t, ti) => `def t${ti}(ns):\n${pyFnTest(j.judge as FnJudge, t).replace(/^/gm, '    ')}`)
          : (j.judge as DesignJudge).tests.map((t, ti) => `def t${ti}(ns):\n${pyDesignTest(j.judge as DesignJudge, t).replace(/^/gm, '    ')}`);
        const count = j.judge.type === 'fn' ? j.tests.length : (j.judge as DesignJudge).tests.length;
        return `def _tests_${n}():\n${tests.map((t) => t.replace(/^/gm, '    ')).join('\n')}\n    return [${Array.from({ length: count }, (_, k) => `t${k}`).join(', ')}]\n_run(${JSON.stringify(j.id)}, ${JSON.stringify(j.code)}, _tests_${n}())\n`;
      })
      .join('\n');
    const file = path.join(dir, `run${i}.py`);
    fs.writeFileSync(file, `${prelude}\n\n${body}`);
    const r = await run('python3', [file], dir, 600000);
    parseOutput(r.out, res);
    if (r.code !== 0) {
      const tail = r.errText.split('\n').slice(-6).join(' | ');
      err(`[python] chunk ${i} exited with ${r.code}: ${tail}`);
    }
  });
}

async function runCpp(jobs: Job[], res: Result) {
  if (!jobs.length) return;
  const dir = path.join(TMP, 'cpp');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'scripts/harness/common.hpp'), path.join(dir, 'common.hpp'));
  // Precompile the header once.
  await run('g++', ['-std=c++17', '-O1', '-w', '-x', 'c++-header', 'common.hpp', '-o', 'common.hpp.gch'], dir, 300000);
  const chunks: Job[][] = [];
  for (let i = 0; i < jobs.length; i += 25) chunks.push(jobs.slice(i, i + 25));
  await pool(chunks.map((c, i) => ({ c, i })), Math.max(2, os.cpus().length), async ({ c, i }) => {
    const build = async (list: Job[], name: string): Promise<boolean> => {
      const src = [
        '#include "common.hpp"',
        '#include <unistd.h>',
        '#include <sys/wait.h>',
        ...list.map((j, n) => {
          const code = j.code.replace(/^\s*#include.*$/gm, '').replace(/^\s*using namespace std;\s*$/gm, '');
          const tests = j.judge.type === 'fn'
            ? j.tests.map((t, ti) => cppFnTest(j.judge as FnJudge, t, ti, j.id))
            : (j.judge as DesignJudge).tests.map((t, ti) => cppDesignTest(j.judge as DesignJudge, t, ti, j.id));
          return `namespace W${n} {\n${code}\nvoid run() {\n${tests.map((t) => `  ${t}\n  cout.flush();`).join('\n')}\n}\n}`;
        }),
        'int main() {',
        ...list.map((j, n) => `  { cout.flush(); pid_t p = fork(); if (p == 0) { alarm(15); W${n}::run(); cout.flush(); _exit(0); } int st = 0; waitpid(p, &st, 0); if (!WIFEXITED(st) || WEXITSTATUS(st) != 0) cout << "@@${j.id}\\t-1\\tERR\\tcrashed (signal " << (WIFSIGNALED(st) ? WTERMSIG(st) : -1) << ")\\n"; }`),
        '  return 0;',
        '}',
      ].join('\n');
      fs.writeFileSync(path.join(dir, `${name}.cpp`), src);
      const cc = await run('g++', ['-std=c++17', '-O1', '-w', '-include', 'common.hpp', `${name}.cpp`, '-o', name], dir, 600000);
      if (cc.code !== 0) return false;
      const r = await run(path.join(dir, name), [], dir, 600000);
      parseOutput(r.out, res);
      return true;
    };
    if (await build(c, `chunk${i}`)) return;
    // Find the broken solutions one by one.
    for (const [n, j] of c.entries()) {
      const ok = await build([j], `single${i}_${n}`);
      if (!ok) {
        const cc = await run('g++', ['-std=c++17', '-O1', '-w', '-include', 'common.hpp', `single${i}_${n}.cpp`, '-o', `single${i}_${n}`], dir, 300000);
        const first = cc.errText.split('\n').filter((l) => l.includes('error')).slice(0, 3).join(' | ');
        err(`[cpp] ${j.slug}/${j.approach}: compile error: ${first}`);
      }
    }
  });
}

/* ------------------------------------------------------------------ */
/* Comparison                                                           */
/* ------------------------------------------------------------------ */

function near(a: any, b: any, tol: number): boolean {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => near(x, b[i], tol));
  return JSON.stringify(a) === JSON.stringify(b);
}
const key = (x: unknown) => JSON.stringify(x);
function sortDeep(x: any): any {
  if (!Array.isArray(x)) return x;
  return x.map(sortDeep).sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
}
function compare(cmp: Cmp | undefined, args: unknown[], out: any, exp: any): boolean {
  if (!cmp || cmp === 'exact') return near(out, exp, 1e-9);
  if (cmp === 'float') return near(out, exp, 1e-5);
  if (cmp === 'sorted') return Array.isArray(out) && near([...out].sort((a, b) => (key(a) < key(b) ? -1 : 1)), [...exp].sort((a: any, b: any) => (key(a) < key(b) ? -1 : 1)), 1e-9);
  if (cmp === 'deepSorted' || cmp === 'set') return Array.isArray(out) && key(sortDeep(out)) === key(sortDeep(exp));
  if (typeof cmp === 'object') {
    const c = CHECKERS[cmp.checker];
    if (!c) throw new Error(`unknown checker ${cmp.checker}`);
    return c(args as any[], out, exp);
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */

async function main() {
  const t0 = Date.now();
  // Curriculum sanity
  const slugs = PROBLEMS.map((p) => p.slug);
  const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dup.length) err(`curriculum: duplicate problem slugs: ${dup.join(', ')}`);
  const lcs = PROBLEMS.map((p) => p.lc);
  const dupLc = lcs.filter((s, i) => lcs.indexOf(s) !== i);
  if (dupLc.length) err(`curriculum: duplicate LeetCode numbers: ${dupLc.join(', ')}`);
  const lessonSlugs = MODULES.map((m) => m.lesson);
  if (new Set(lessonSlugs).size !== lessonSlugs.length) err('curriculum: duplicate lesson slugs');

  const problemFiles = walk(path.join(ROOT, 'src/content/problems')).filter((f) => f.endsWith('.ts'));
  const lessonFiles = walk(path.join(ROOT, 'src/content/lessons')).filter((f) => f.endsWith('.ts'));
  const bySlug = new Map(PROBLEMS.map((p) => [p.slug, p]));
  const wanted = (slug: string) => (!ONLY || ONLY.includes(slug)) && (!MODULE || MODULE.includes(bySlug.get(slug)?.module ?? ''));

  // Lessons
  let lessonCount = 0;
  let videoFrames = 0;
  let videoWords = 0;
  for (const f of lessonFiles) {
    const slug = path.basename(f, '.ts');
    const mod = MODULES.find((m) => m.lesson === slug);
    if (!mod) {
      err(`lesson file ${slug} is not in the curriculum`);
      continue;
    }
    if (ONLY && !ONLY.includes(slug)) continue;
    if (MODULE && !MODULE.includes(mod.id)) continue;
    try {
      const l: Lesson = (await import(pathToFileURL(f).href)).default;
      if (l.slug !== slug) err(`lesson ${slug}: slug field is "${l.slug}"`);
      if (!l.body || l.body.length < 400) warn(`lesson ${slug}: short article (${l.body?.length ?? 0} chars)`);
      l.quiz?.forEach((q, i) => {
        if (q.answer < 0 || q.answer >= q.options.length) err(`lesson ${slug}: quiz ${i + 1} answer index out of range`);
      });
      const s = checkVideo(`lesson ${slug}`, l.video());
      videoFrames += s.frames;
      videoWords += s.words;
      lessonCount++;
    } catch (e) {
      err(`lesson ${slug}: ${(e as Error).stack?.split('\n').slice(0, 4).join(' | ')}`);
    }
  }

  // Problems
  const jobs: Job[] = [];
  const probs: { p: Problem; ref: (typeof PROBLEMS)[number] }[] = [];
  for (const f of problemFiles) {
    const slug = path.basename(f, '.ts');
    const ref = bySlug.get(slug);
    if (!ref) {
      err(`problem file ${slug} is not in the curriculum`);
      continue;
    }
    if (path.basename(path.dirname(f)) !== ref.module) warn(`problem ${slug} lives in folder ${path.basename(path.dirname(f))} but belongs to module ${ref.module}`);
    if (!wanted(slug)) continue;
    let p: Problem;
    try {
      p = (await import(pathToFileURL(f).href)).default;
    } catch (e) {
      err(`problem ${slug}: failed to load: ${(e as Error).stack?.split('\n').slice(0, 4).join(' | ')}`);
      continue;
    }
    if (p.slug !== slug) err(`problem ${slug}: slug field is "${p.slug}"`);
    probs.push({ p, ref });
    let script: VideoScript | null = null;
    try {
      script = p.video();
      const s = checkVideo(`problem ${slug}`, script);
      videoFrames += s.frames;
      videoWords += s.words;
      const kinds = new Set(script.chapters.map((c) => c.kind));
      if (!kinds.has('optimal') && p.approaches.length > 1) warn(`problem ${slug}: video has no optimal chapter`);
    } catch (e) {
      err(`problem ${slug}: video failed: ${(e as Error).stack?.split('\n').slice(0, 4).join(' | ')}`);
    }
    if (!p.approaches.some((a) => a.kind === 'optimal')) err(`problem ${slug}: no optimal approach`);
    if (!p.judge) {
      warn(`problem ${slug}: no judge spec (solutions not executed)`);
    }
    for (const a of p.approaches) {
      for (const lang of ['java', 'python', 'cpp'] as Lang[]) {
        const file = path.join(ROOT, 'solutions', slug, `${a.id}.${EXT[lang]}`);
        if (!fs.existsSync(file)) {
          err(`problem ${slug}: missing solution ${a.id}.${EXT[lang]}`);
          continue;
        }
        if (VIDEOS_ONLY || !p.judge || !LANGS.includes(lang)) continue;
        let judge = p.judge;
        let tests: Test[] = [];
        if (judge.type === 'fn') {
          tests = fnTestsFor(slug, judge).filter((t) => !(t.big && a.kind === 'brute'));
          if (p.videoArgs && script && script.answer !== undefined) tests.push({ args: p.videoArgs, out: script.answer, video: true });
        } else judge = { ...judge, tests: designTestsFor(slug, judge) };
        jobs.push({ id: `${slug}~${a.id}~${lang}`, slug, approach: a.id, lang, code: fs.readFileSync(file, 'utf8'), judge, tests });
      }
    }
    if (p.videoArgs && script && script.answer === undefined) warn(`problem ${slug}: videoArgs given but the video sets no answer`);
    const solDir = path.join(ROOT, 'solutions', slug);
    if (fs.existsSync(solDir)) {
      const ids = new Set(p.approaches.map((a) => a.id));
      for (const f2 of fs.readdirSync(solDir)) if (!ids.has(f2.replace(/\.(java|py|cpp)$/, ''))) warn(`problem ${slug}: unused solution file ${f2}`);
    }
  }

  // Execute
  const res: Result = new Map();
  if (!VIDEOS_ONLY && jobs.length) {
    fs.mkdirSync(TMP, { recursive: true });
    const by = (l: Lang) => jobs.filter((j) => j.lang === l);
    await Promise.all([runJava(by('java'), res), runPython(by('python'), res), runCpp(by('cpp'), res)]);
  }
  let passed = 0;
  let failed = 0;
  for (const j of jobs) {
    const r = res.get(j.id);
    const setup = r?.get(-1);
    if (setup?.startsWith('ERR')) {
      err(`[${j.lang}] ${j.slug}/${j.approach}: ${setup.slice(4)}`);
      failed++;
      continue;
    }
    const tests = j.judge.type === 'fn' ? j.tests : (j.judge as DesignJudge).tests.map((t) => ({ args: t.args, out: t.out }));
    const cmp = j.judge.type === 'fn' ? j.judge.cmp : 'exact';
    let ok = true;
    tests.forEach((t, ti) => {
      const raw = r?.get(ti);
      const label = `[${j.lang}] ${j.slug}/${j.approach} ${'video' in t && t.video ? 'video example' : `test ${ti + 1}`} ${JSON.stringify(t.args).slice(0, 140)}`;
      if (raw === undefined) {
        err(`${label}: no output`);
        ok = false;
        return;
      }
      if (raw.startsWith('ERR')) {
        err(`${label}: ${raw.slice(4)}`);
        ok = false;
        return;
      }
      let out: unknown;
      try {
        out = JSON.parse(raw);
      } catch {
        err(`${label}: unparsable output ${raw.slice(0, 120)}`);
        ok = false;
        return;
      }
      if (!compare(cmp, t.args as unknown[], out, t.out)) {
        err(`${label}: expected ${JSON.stringify(t.out).slice(0, 160)} got ${JSON.stringify(out).slice(0, 160)}`);
        ok = false;
      }
    });
    if (ok) passed++;
    else failed++;
  }

  // Coverage
  const withContent = new Set(probs.map((x) => x.p.slug));
  const missingProblems = PROBLEMS.filter((p) => !withContent.has(p.slug) && wanted(p.slug));
  const missingLessons = MODULES.filter((m) => !lessonFiles.some((f) => path.basename(f, '.ts') === m.lesson));

  console.log('');
  console.log(`Lessons checked:   ${lessonCount} (${missingLessons.length} of ${MODULES.length} not written yet)`);
  console.log(`Problems checked:  ${probs.length} (${ONLY || MODULE ? 'filtered' : `${missingProblems.length} of ${PROBLEMS.length} not written yet`})`);
  console.log(`Video frames:      ${videoFrames} · narration ≈ ${Math.round(videoWords / 150)} min`);
  if (!VIDEOS_ONLY) console.log(`Solutions run:     ${passed} passed, ${failed} failed (${jobs.length} solution×language pairs)`);
  if (warnings.length && !QUIET) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings.slice(0, 80)) console.log('  ! ' + w);
  }
  if (errors.length) {
    console.log(`\nErrors (${errors.length}):`);
    for (const e of errors.slice(0, 200)) console.log('  ✗ ' + e);
  } else console.log('\nAll checks passed.');
  console.log(`(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  process.exit(errors.length ? 1 : 0);
}

try {
  execFileSync('true');
} catch {
  /* noop */
}
main();
