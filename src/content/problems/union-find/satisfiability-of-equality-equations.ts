import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { dsuViz } from '../../dsuviz';

const EQ = ['a==b', 'b==c', 'a!=d', 'c==e', 'e!=a'];
const LET = ['a', 'b', 'c', 'd', 'e'];
const POS: [number, number][] = [[15, 25], [50, 10], [85, 25], [30, 90], [72, 88]];

function solve(eqs: string[]) {
  const p = Array.from({ length: 26 }, (_, i) => i);
  const f = (x: number): number => (p[x] === x ? x : (p[x] = f(p[x])));
  const id = (c: string) => c.charCodeAt(0) - 97;
  for (const e of eqs) if (e[1] === '=') p[f(id(e[0]))] = f(id(e[3]));
  return eqs.every((e) => e[1] === '=' || f(id(e[0])) !== f(id(e[3])));
}

function video() {
  const v = new Video('equality-equations', 'Satisfiability of Equality Equations');
  const ix = (c: string) => LET.indexOf(c);
  const eqs = EQ.filter((e) => e[1] === '=');
  const neqs = EQ.filter((e) => e[1] === '!');
  const nodes = LET.map((c, i) => ({ id: c, label: c, x: POS[i][0], y: POS[i][1] }));
  const es = eqs.map((e) => ({ a: e[0], b: e[3] }));

  v.chapter('intro', 'The problem');
  const tb = v.table('eq', ['equation', 'kind'], EQ.map((e) => [e, e[1] === '=' ? 'equal' : 'not equal']));
  v.say('Each variable is one lowercase letter. Equations say two variables are equal, or not equal. Can we assign numbers to the letters so that every equation holds?');
  tb.tone(EQ.length - 1, 'bad');
  v.eq('a = b = c = e, but e ≠ a → impossible', 'bad').say('Here a equals b, b equals c, and c equals e, so a, b, c and e must all be the same number. Then e not equal to a is impossible. The answer is false.');

  v.chapter('insight', 'The key idea');
  v.clear();
  v.text('k', { title: 'Equality is contagious', lines: ['a == b and b == c force a == c: equalities form groups', 'Step 1: merge the groups using every “==”', 'Step 2: every “x != y” must have x and y in different groups'], shown: 3 });
  v.say('Equality chains together. If a equals b and b equals c, then a equals c. So the equations split the letters into groups that must share a value. The problem is satisfiable exactly when no “not equal” connects two letters inside the same group.');

  v.chapter('brute', 'Brute force: graph search for each “!=”', { cx: 'O(n · 26)', code: ['graph: an edge for every x == y', 'for every x != y:', '  if BFS from x reaches y: return false', 'return true'] });
  v.clear();
  const g = v.graph('g', nodes, es, { label: 'an edge for every ==' });
  v.say('Draw an edge for every equality. Then for each “not equal”, search the graph to see whether the two letters are connected.');
  const adj: Record<string, string[]> = {};
  for (const e of eqs) { (adj[e[0]] ??= []).push(e[3]); (adj[e[3]] ??= []).push(e[0]); }
  let ok = true;
  for (const e of neqs) {
    const [x, y] = [e[0], e[3]];
    const seen = new Set([x]);
    const q = [x];
    while (q.length) { const u = q.shift()!; for (const w of adj[u] ?? []) if (!seen.has(w)) { seen.add(w); q.push(w); } }
    g.clearTones();
    [...seen].forEach((c) => g.tone(c, 'visit'));
    g.tone(x, 'active').tone(y, seen.has(y) ? 'bad' : 'cmp');
    const hit = seen.has(y);
    v.line(2).eq(`${e}: BFS from ${x} reaches {${[...seen].sort().join(', ')}} → ${hit ? `${y} reached ✗` : `${y} not reached ✓`}`, hit ? 'bad' : 'ok');
    v.say(hit ? `For ${x[0]} not equal ${y}: BFS from ${x} reaches ${y}. They are forced equal, so return false.` : `For ${x} not equal ${y}: BFS from ${x} reaches ${[...seen].sort().join(', ')}, but not ${y}. Fine.`);
    if (hit) { ok = false; break; }
  }
  v.eq('one BFS per “!=” over up to 26 letters', 'warn').say('That works, but repeats a whole search for every inequality. Union find builds the groups once, then each check is one find.');

  v.chapter('optimal', 'Optimal: Union-Find in two passes', { cx: 'O(n · α(26))', code: ['pass 1: for x == y: union(x, y)', 'pass 2: for x != y:', '  if find(x) == find(y): return false', 'return true'] });
  v.clear().layout('row');
  const D = dsuViz(v, LET.length, { labels: LET, arrLabel: 'parent (letters a–e)' });
  const tb2 = v.table('eq', ['equation', 'result'], EQ.map((e) => [e, '']));
  v.say('Pass one: union the two sides of every equality.');
  EQ.forEach((e, k) => {
    if (e[1] !== '=') return;
    tb2.clearTones().tone(k, 'active');
    D.union(ix(e[0]), ix(e[3]));
    D.t.clearTones();
    D.arr!.clearTones();
    tb2.p.rows[k][1] = 'union';
    v.line(0).eq(`union(${e[0]}, ${e[3]})`).hold(700);
  });
  D.t.clearTones();
  v.say(`After pass one, ${LET.filter((c) => D.find(ix(c)) === D.find(0)).join(', ')} share one root, and ${LET.filter((c) => D.find(ix(c)) !== D.find(0)).join(', ')} is on its own.`);
  let res = true;
  EQ.forEach((e, k) => {
    if (e[1] !== '!' || !res) return;
    const a = ix(e[0]);
    const b = ix(e[3]);
    D.showPath(a);
    D.showPath(b, true);
    const same = D.find(a) === D.find(b);
    tb2.clearTones().tone(k, same ? 'bad' : 'ok');
    tb2.p.rows[k][1] = same ? 'same root ✗' : 'different ✓';
    v.line(1, 2).eq(`${e}: find(${e[0]}) = ${LET[D.find(a)]}, find(${e[3]}) = ${LET[D.find(b)]} → ${same ? 'contradiction' : 'ok'}`, same ? 'bad' : 'ok');
    v.say(same ? `Pass two: ${e[0]} not equal ${e[3]}. Both have root ${LET[D.find(a)]}, so they must be equal. Contradiction: return false.` : `Pass two: ${e[0]} not equal ${e[3]}. Different roots, so this one is fine.`);
    if (same) res = false;
  });
  v.answer(res && ok);
  v.eq('rule: check every “!=” only after all “==” are merged', 'warn').say('Why two passes? An inequality checked too early might look fine, and a later equality could still merge its two letters. So collect every equality first.');

  recap(v, [
    { name: 'BFS per inequality', time: 'O(n · 26)', space: 'O(26 + n)' },
    { name: 'Union-Find, two passes', time: 'O(n · α(26))', space: 'O(26)' },
  ], 'Merge all equalities first, then test every inequality.', ['Equivalence relations (==, same, friends-of) → union-find', 'Constraints that forbid being grouped → check after merging'], 'Equalities build groups; inequalities are checks you run only after all groups are built.');
  return v.build();
}

const problem: Problem = {
  slug: 'satisfiability-of-equality-equations',
  statement: 'You are given an array of strings `equations`, each of length 4, in the form `"x==y"` or `"x!=y"`, where `x` and `y` are lowercase letters (variables). Return `true` if it is possible to assign integers to the variables so that all equations are satisfied.',
  examples: [
    { input: 'equations = ["a==b","b!=a"]', output: 'false' },
    { input: 'equations = ["b==a","a==b"]', output: 'true' },
  ],
  constraints: ['1 ≤ equations.length ≤ 500', 'equations[i][1] is "=" or "!"; equations[i][2] is "="'],
  hints: ['If a == b and b == c, what can you say about a and c?', 'Process all “==” first, then check the “!=”.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'BFS per inequality', idea: 'Build a graph with an edge per equality; for each inequality, BFS to see if the letters are connected.', time: 'O(n · 26)', space: 'O(26 + n)', bottleneck: 'A fresh search for every inequality.' },
    { id: 'optimal', kind: 'optimal', name: 'Union-Find, two passes', idea: 'Union both sides of every equality; then return false if any inequality has both sides with the same root.', time: 'O(n · α(26))', space: 'O(26)' },
  ],
  pitfalls: ['Checking inequalities in the same pass as equalities: a later `==` can merge letters you already approved.', '`"a!=a"` is always false: same letter, same root.'],
  takeaway: 'Equalities are an **equivalence relation**: build groups with union-find, then verify the inequalities.',
  video,
  videoArgs: [EQ],
  judge: {
    type: 'fn', fn: 'equationsPossible', params: ['String[]'], ret: 'boolean',
    tests: [
      { args: [['a==b', 'b!=a']], out: false },
      { args: [['b==a', 'a==b']], out: true },
      { args: [['a!=a']], out: false },
      { args: [['c==c', 'b==d', 'x!=z']], out: true },
      { args: [['a!=c', 'a==b', 'b==c']], out: false },
    ],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 8) }, () => `${r.pick(['a', 'b', 'c', 'd'])}${r.chance(0.6) ? '==' : '!='}${r.pick(['a', 'b', 'c', 'd'])}`)],
    ref: (e: string[]) => solve(e),
  },
};

export default problem;
