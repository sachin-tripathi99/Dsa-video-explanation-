import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const P = [1, 2, 3];
const Q = [1, 2, 4];

function video() {
  const v = new Video('same-tree', 'Same Tree');
  v.chapter('intro', 'The problem');
  v.layout('row');
  v.binaryTree('p', P, { label: 'p', prefix: 'p' });
  v.binaryTree('q', Q, { label: 'q', prefix: 'q' });
  v.say('Are two binary trees identical: the same shape, and the same values in the same places?');

  v.chapter('brute', 'Serialise both and compare', { cx: 'O(n)', code: ['return serialise(p) == serialise(q)   (including nulls)'] });
  v.eq('"1,2,#,#,3,#,#" vs "1,2,#,#,4,#,#" → different').say('One option: write both trees out as strings, including markers for null children, and compare the strings. It works in linear time but builds two strings.');

  v.chapter('optimal', 'Compare node by node', { cx: 'O(n)', code: ['same(a, b):', '  if both null: return true', '  if one null or a.val != b.val: return false', '  return same(a.left, b.left) and same(a.right, b.right)'] });
  v.clear().layout('row');
  const p = v.binaryTree('p', P, { label: 'p', prefix: 'p' });
  const q = v.binaryTree('q', Q, { label: 'q', prefix: 'q' });
  const pairs: [string, string][] = [['p0', 'q0'], ['p1', 'q1'], ['p2', 'q2']];
  let ok = true;
  pairs.forEach(([a, b], i) => {
    const same = p.val(a) === q.val(b);
    p.tone(a, same ? 'ok' : 'bad');
    q.tone(b, same ? 'ok' : 'bad');
    v.line(same ? 3 : 2).eq(`${p.val(a)} vs ${q.val(b)}`, same ? 'ok' : 'bad');
    if (i === 0) v.say('Walk both trees together. Roots: one and one. Equal, so compare the left subtrees, then the right subtrees.');
    else if (!same) {
      v.say('Three versus four: different. Return false, and the false propagates straight up.');
      ok = false;
    } else v.hold(700);
  });
  v.answer(ok);
  recap(v, [{ name: 'Serialise and compare', time: 'O(n)', space: 'O(n)' }, { name: 'Parallel recursion', time: 'O(n)', space: 'O(h)' }], 'Walk both trees in lockstep and stop at the first difference.', ['Compare two trees → recurse on both at once', 'Handle the null cases first'], 'Recursing on two trees at the same time is a pattern: same tree, symmetric tree, subtree, merge trees.');
  return v.build();
}

const problem: Problem = {
  slug: 'same-tree',
  statement: 'Given the roots of two binary trees `p` and `q`, return `true` if they are **structurally identical** with the same node values.',
  examples: [{ input: 'p = [1,2,3], q = [1,2,3]', output: 'true' }, { input: 'p = [1,2], q = [1,null,2]', output: 'false' }, { input: 'p = [1,2,1], q = [1,1,2]', output: 'false' }],
  constraints: ['0 ≤ nodes ≤ 100', '-10⁴ ≤ Node.val ≤ 10⁴'],
  hints: ['Two empty trees are the same.', 'Compare roots, then recurse on left with left and right with right.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Serialise and compare', idea: 'Pre-order serialise both trees with null markers; compare the strings.', time: 'O(n)', space: 'O(n)', bottleneck: 'Builds full strings even if the roots already differ.' },
    { id: 'optimal', kind: 'optimal', name: 'Parallel recursion', idea: 'Both null → true; one null or values differ → false; otherwise recurse on both children pairs.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'To compare trees, **recurse on both in lockstep**.',
  video,
  videoArgs: [P, Q],
  judge: {
    type: 'fn', fn: 'isSameTree', params: ['TreeNode', 'TreeNode'], ret: 'boolean',
    tests: [{ args: [[1, 2, 3], [1, 2, 3]], out: true }, { args: [[1, 2], [1, null, 2]], out: false }, { args: [[1, 2, 1], [1, 1, 2]], out: false }, { args: [[], []], out: true }],
    gen: (r) => { const a = Array.from({ length: r.int(0, 7) }, () => (r.chance(0.2) ? null : r.int(1, 3))); if (a[0] === null) a[0] = 1; const b = r.chance(0.5) ? [...a] : a.map((x) => (x !== null && r.chance(0.2) ? x + 1 : x)); return [a, b]; },
    ref: (a: (number | null)[], b: (number | null)[]) => JSON.stringify(canon(a)) === JSON.stringify(canon(b)),
  },
};

function canon(lv: (number | null)[]) {
  // Rebuild and re-serialise so equivalent level-order arrays compare equal.
  if (!lv.length || lv[0] === null) return [];
  type N = { v: number; l: N | null; r: N | null };
  const root: N = { v: lv[0] as number, l: null, r: null };
  const q: N[] = [root];
  let i = 1;
  while (q.length && i < lv.length) {
    const c = q.shift()!;
    if (i < lv.length && lv[i] !== null) { c.l = { v: lv[i] as number, l: null, r: null }; q.push(c.l); }
    i++;
    if (i < lv.length && lv[i] !== null) { c.r = { v: lv[i] as number, l: null, r: null }; q.push(c.r); }
    i++;
  }
  const out: string[] = [];
  const pre = (n: N | null) => { if (!n) { out.push('#'); return; } out.push(String(n.v)); pre(n.l); pre(n.r); };
  pre(root);
  return out;
}

export default problem;
