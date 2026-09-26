import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const P = '/home//user/./docs/../pics/';
function simplify(p: string) { const st: string[] = []; for (const part of p.split('/')) { if (part === '' || part === '.') continue; if (part === '..') st.pop(); else st.push(part); } return '/' + st.join('/'); }

function video() {
  const v = new Video('simplify-path', 'Simplify Path');
  v.chapter('intro', 'The problem');
  v.text('p', { title: P, lines: ['"//" is the same as "/"', '"." means the current folder', '".." means go up one folder', 'result: starts with "/", no trailing "/"'], shown: 4, mono: true });
  v.say('Convert a Unix-style absolute path into its simplest form. Repeated slashes collapse, a single dot stays in place, and two dots go up one directory.');
  v.eq(`→ "${simplify(P)}"`);

  v.chapter('brute', 'Brute force: rewrite the string until stable', { cx: 'O(n²)', code: ['repeat: replace "//" → "/", "/./" → "/", "/name/../" → "/"', 'until nothing changes'] });
  v.eq('many passes over the string, easy to get edge cases wrong', 'warn').say('Rewriting patterns in the string until nothing changes can work, but it needs many passes and is full of edge cases.');

  v.chapter('optimal', 'Optimal: split on "/" and use a stack of folders', { cx: 'O(n)', code: ['for part in path.split("/"):', '  "" or "." → skip', '  ".." → pop if possible', '  name → push', 'return "/" + "/".join(stack)'] });
  v.clear();
  const parts = P.split('/');
  const a = v.array('parts', parts.map((x) => (x === '' ? '∅' : x)), { label: 'path split on "/" (∅ = empty)' });
  const st = v.stack('st', [], { label: 'folders so far' });
  const stack: string[] = [];
  let toldUp = false;
  v.say('Split on slashes. Empty pieces and single dots do nothing. A name goes deeper, so push it. Two dots go up, so pop.');
  parts.forEach((part, i) => {
    a.clearTones().tone(i, 'active');
    if (part === '' || part === '.') { a.tone(i, 'dim'); v.line(1).eq(`"${part}" → skip`).hold(350); }
    else if (part === '..') {
      const top = stack.pop();
      st.pop();
      v.line(2).eq(`".." → pop "${top}"`, 'warn');
      if (!toldUp) { v.say(`Two dots: leave the folder ${top}. Pop it.`); toldUp = true; } else v.hold(500);
    } else { stack.push(part); st.push(part); v.line(3).eq(`push "${part}"`).hold(450); }
  });
  a.clearTones();
  v.line(4).eq(`"${simplify(P)}"`, 'ok').say('Join the remaining folders with slashes and put a slash in front. At the root, two dots simply do nothing, because there is nothing to pop.');
  v.answer(simplify(P));

  recap(v, [{ name: 'Rewrite until stable', time: 'O(n²)', space: 'O(n)' }, { name: 'Split + stack', time: 'O(n)', space: 'O(n)' }], 'Folders are a stack: names push, “..” pops.', ['Paths, undo, nested navigation → stack'], 'A path is a stack of directories.');
  return v.build();
}

const problem: Problem = {
  slug: 'simplify-path',
  statement: 'Given an absolute Unix-style `path`, return the simplified canonical path. `.` is the current directory, `..` the parent directory, and multiple slashes are treated as one. Any other sequence of periods (like `...`) is a normal name. The result starts with a single `/`, has single slashes between names, and no trailing slash.',
  examples: [{ input: 'path = "/home/"', output: '"/home"' }, { input: 'path = "/home//foo/"', output: '"/home/foo"' }, { input: 'path = "/../"', output: '"/"' }, { input: 'path = "/.../a/../b/c/../d/./"', output: '"/.../b/d"' }],
  constraints: ['1 ≤ path.length ≤ 3000'],
  hints: ['Split the path on "/".', 'Keep the folders you are in on a stack.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Rewrite until stable', idea: 'Repeatedly collapse "//", "/./" and "/x/../" patterns.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Many passes; tricky edge cases.' },
    { id: 'optimal', kind: 'optimal', name: 'Split + stack', idea: 'Skip "" and "."; ".." pops; names push; join with "/".', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Directories = **stack**: push names, pop on "..".',
  video,
  videoArgs: [P],
  judge: {
    type: 'fn', fn: 'simplifyPath', params: ['String'], ret: 'String',
    tests: [{ args: ['/home/'], out: '/home' }, { args: ['/home//foo/'], out: '/home/foo' }, { args: ['/../'], out: '/' }, { args: ['/.../a/../b/c/../d/./'], out: '/.../b/d' }, { args: ['/a/./b/../../c/'], out: '/c' }],
    gen: (r: Rng) => ['/' + Array.from({ length: r.int(1, 6) }, () => r.pick(['a', 'b', '.', '..', '', '...'])).join('/') + (r.chance(0.5) ? '/' : '')],
    ref: (p: string) => simplify(p),
  },
};

export default problem;
