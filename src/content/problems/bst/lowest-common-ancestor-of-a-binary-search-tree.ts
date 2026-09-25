import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomBst, type TNode } from '../../treeutil';

const T = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5];
const P = 3;
const Q = 5;

function lca(root: TNode | null, p: number, q: number): number | null {
  let n = root;
  while (n) {
    if (p < n.v && q < n.v) n = n.l;
    else if (p > n.v && q > n.v) n = n.r;
    else return n.v;
  }
  return null;
}

function video() {
  const v = new Video('lca-bst', 'Lowest Common Ancestor of a BST');
  v.chapter('intro', 'The problem');
  const t0 = v.binaryTree('t', T, { label: `p = ${P}, q = ${Q}` });
  const ids = t0.bfs();
  const idOf = (x: number) => ids.find((id) => t0.val(id) === x)!;
  t0.tone([idOf(P), idOf(Q)], 'pivot');
  v.say(`Find the lowest common ancestor of ${words(P)} and ${words(Q)}: the deepest node that has both of them in its subtree. A node counts as its own ancestor.`);

  v.chapter('brute', 'Brute force: compare root paths', { cx: 'O(h)', code: ['pathP = path from root to p', 'pathQ = path from root to q', 'return the last node the two paths share'] });
  v.eq('store both paths, then compare').say('One approach: record the path from the root to each node, then walk both paths together; the last shared node is the answer. It works, and with a BST each path is found in O of h, but it stores both paths.');

  v.chapter('optimal', 'Optimal: find where p and q split', { cx: 'O(h)', code: ['node = root', 'loop:', '  if p and q < node: go left', '  elif p and q > node: go right', '  else: return node      (they split here, or one of them is node)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: `p = ${P}, q = ${Q}` });
  t.tone([idOf(P), idOf(Q)], 'pivot');
  let n: string | null = 't0';
  const path: string[] = [];
  while (n) {
    const val = t.val(n) as number;
    t.clearTones().tone([idOf(P), idOf(Q)], 'pivot').tone(path, 'path').tone(n, 'active').ptr('node', n);
    if (P < val && Q < val) {
      v.line(2).eq(`${P} and ${Q} < ${val} → both on the left`);
      v.say(`Both ${words(P)} and ${words(Q)} are smaller than ${words(val)}, so they both live in the left subtree. The answer must be down there.`);
      path.push(n);
      n = t.left(n);
    } else if (P > val && Q > val) {
      v.line(3).eq(`${P} and ${Q} > ${val} → both on the right`);
      v.say(`Both are bigger than ${words(val)}: go right.`);
      path.push(n);
      n = t.right(n);
    } else {
      t.tone(n, 'ok');
      v.line(4).eq(`${P} < ${val} < ${Q} → they split here → LCA = ${val}`, 'ok');
      v.say(`Now ${words(P)} is ${P < val ? 'smaller' : P > val ? 'bigger' : 'equal'} and ${words(Q)} is ${Q < val ? 'smaller' : Q > val ? 'bigger' : 'equal'} compared with ${words(val)}. They go different ways from here, so ${words(val)} is the lowest node above both. One path down: O of h time, O of one space.`);
      break;
    }
  }
  v.answer(lca(build(T), P, Q));
  recap(v, [{ name: 'Compare root paths', time: 'O(h)', space: 'O(h)' }, { name: 'Walk to the split point', time: 'O(h)', space: 'O(1)' }], 'The LCA is the first node where p and q stop being on the same side.', ['BST + two targets → walk down until they split'], 'In a BST, the lowest common ancestor is simply where the two values go separate ways.');
  return v.build();
}

const problem: Problem = {
  slug: 'lowest-common-ancestor-of-a-binary-search-tree',
  statement: 'Given a BST and two nodes `p` and `q` in it, return their **lowest common ancestor**: the deepest node that has both `p` and `q` as descendants (a node is a descendant of itself).',
  examples: [{ input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', output: '6' }, { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4', output: '2' }],
  constraints: ['2 ≤ nodes ≤ 10⁵', 'unique values', 'p ≠ q, both in the tree'],
  hints: ['If both values are smaller than the node, where is the LCA?', 'Where do p and q go different ways?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Compare root paths', idea: 'Record the root-to-p and root-to-q paths; the last common node is the LCA.', time: 'O(h)', space: 'O(h)', bottleneck: 'Stores both paths.' },
    { id: 'optimal', kind: 'optimal', name: 'Walk to the split point', idea: 'From the root: both smaller → left; both larger → right; otherwise this node is the LCA.', time: 'O(h)', space: 'O(1)' },
  ],
  takeaway: 'In a BST, the LCA is **where p and q split** onto different sides.',
  video,
  videoArgs: [T, P, Q],
  judge: {
    type: 'fn', fn: 'lowestCommonAncestor', params: ['TreeNode', 'TreeNode@ref', 'TreeNode@ref'], ret: 'TreeNode@val',
    tests: [{ args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], out: 6 }, { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], out: 2 }, { args: [[2, 1], 2, 1], out: 2 }],
    gen: (r) => { let lv = randomBst(r); let vals = lv.filter((x): x is number => x !== null); while (vals.length < 2) { lv = randomBst(r); vals = lv.filter((x): x is number => x !== null); } const [a, b] = r.shuffle(vals).slice(0, 2); return [lv, a, b]; },
    ref: (lv: (number | null)[], p: number, q: number) => lca(build(lv), p, q),
  },
};

export default problem;
