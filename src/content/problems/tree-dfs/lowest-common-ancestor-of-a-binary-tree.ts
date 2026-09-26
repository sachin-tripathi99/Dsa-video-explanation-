import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, toLevel, type Level, type TNode } from '../../treeutil';
import { pathTo } from '../../treevid';

const T: Level = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4];
const P = 6, Q = 4;
function lca(lv: Level, p: number, q: number) { const go = (n: TNode | null): TNode | null => { if (!n || n.v === p || n.v === q) return n; const a = go(n.l), b = go(n.r); return a && b ? n : a ?? b; }; return go(build(lv))?.v ?? null; }

function video() {
  const v = new Video('lca-binary-tree', 'Lowest Common Ancestor of a Binary Tree');
  const idOf = (t: { p: { nodes: Record<string, { v: unknown }> } }, x: number) => Object.entries(t.p.nodes).find(([, n]) => n.v === x)![0];
  v.chapter('intro', 'The problem');
  const t0 = v.binaryTree('t', T, { label: `p = ${P}, q = ${Q}` });
  t0.tone([idOf(t0, P), idOf(t0, Q)], 'cmp');
  v.say(`The lowest common ancestor of two nodes is the deepest node that has both of them in its subtree. A node counts as its own ancestor. This is a plain binary tree, not a search tree, so values give no hints about direction.`);
  v.eq(`LCA(${P}, ${Q}) = ${lca(T, P, Q)}`);

  v.chapter('brute', 'Brute force: record both root paths, compare', { cx: 'O(n) time · O(n) space', code: ['pathP = root → p; pathQ = root → q', 'walk both paths together while they agree', 'the last shared node is the LCA'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'root paths' });
  const pp = pathTo(t, idOf(t, P)), pq = pathTo(t, idOf(t, Q));
  pp.forEach((x) => t.tone(x, 'path'));
  v.eq(`path to ${P}: ${pp.map((x) => t.val(x)).join(' → ')}`).say(`Find the path from the root to ${words(P)}: three, five, six.`);
  pq.forEach((x) => t.tone(x, pp.includes(x) ? 'ok' : 'cmp'));
  let k = 0; while (k < pp.length && k < pq.length && pp[k] === pq[k]) k++;
  v.eq(`path to ${Q}: ${pq.map((x) => t.val(x)).join(' → ')} · shared: ${pp.slice(0, k).map((x) => t.val(x)).join(', ')}`, 'ok').say(`And to ${words(Q)}: three, five, two, four. The paths agree on three and five, then split. The last shared node, five, is the answer. Correct, but it needs two searches and stores two paths.`);

  v.chapter('optimal', 'One recursion: report what you found', { cx: 'O(n) time · O(h) space', code: ['lca(node):', '  if not node or node is p or node is q: return node', '  a = lca(left); b = lca(right)', '  if a and b: return node        # p and q on different sides', '  return a or b                  # pass up whatever was found'] });
  v.clear();
  const u = v.binaryTree('t', T, { label: 'badge = what the call returns' });
  u.tone([idOf(u, P), idOf(u, Q)], 'cmp');
  let told = 0;
  const go = (id: string | null): string | null => {
    if (!id) return null;
    const val = u.val(id) as number;
    if (val === P || val === Q) {
      u.badge(id, val); u.tone(id, 'ok');
      v.line(1).eq(`node ${val} is ${val === P ? 'p' : 'q'} → return it`);
      if (told === 0) { v.say(`Every call returns p or q if it finds one in its subtree, and null otherwise. Reaching ${words(val)} itself, return it immediately: there is no need to look below it.`); told++; } else v.hold(600);
      return id;
    }
    u.tone(id, 'active');
    v.line(2).eq(`visit ${val}`).hold(300);
    const a = go(u.left(id)), b = go(u.right(id));
    if (a && b) {
      u.badge(id, val); u.tone(id, 'ok');
      v.line(3).eq(`${val}: left returned ${u.val(a)}, right returned ${u.val(b)} → ${val} is the LCA`, 'ok');
      v.say(`Node ${words(val)} gets a non-null answer from both sides: p is on one side and q on the other. So ${words(val)} is the lowest common ancestor. Return it.`);
      return id;
    }
    const r = a ?? b;
    u.badge(id, r ? (u.val(r) as number) : '∅'); u.tone(id, r ? 'path' : 'dim');
    v.line(4).eq(`${val}: returns ${r ? u.val(r) : 'null'}`);
    if (r && told === 1 && val !== (T[0] as number)) { v.say(`Node ${words(val)} found only one of them, so it passes that up.`); told++; }
    else if (!r && told < 3) { v.say(`Node ${words(val)}’s subtree contains neither, so it returns null.`); told = Math.max(told, 3); }
    else if (val === (T[0] as number)) v.say(`The root gets ${words(u.val(r!) as number)} from the left and null from the right, so it passes five up: that is the final answer.`);
    else v.hold(500);
    return r;
  };
  const ans = go(u.root());
  v.eq(`LCA = ${ans ? u.val(ans) : 'null'}`, 'ok').say('One traversal, no stored paths.');
  void toLevel;
  v.answer(lca(T, P, Q));

  recap(v, [{ name: 'Two root paths', time: 'O(n)', space: 'O(n)' }, { name: 'Single recursion', time: 'O(n)', space: 'O(h)' }], 'Return p/q/null; both sides non-null → this node is the LCA.', ['Common ancestor in a general tree → post-order “report what you found”'], 'Let each subtree report what it contains; the split point is the answer.');
  return v.build();
}

function randomPair(r: Rng) { let lv = randomTree(r, 14); let vals: number[] = []; for (;;) { const seen = new Set<number>(); const uniq = lv.map((x) => { if (x === null) return null; let y = x; while (seen.has(y)) y++; seen.add(y); return y; }); lv = uniq; vals = uniq.filter((x): x is number => x !== null); if (vals.length >= 2) break; lv = randomTree(r, 14); } const [a, b] = r.shuffle(vals).slice(0, 2); return [lv, a, b]; }

const problem: Problem = {
  slug: 'lowest-common-ancestor-of-a-binary-tree',
  statement: 'Given a binary tree and two of its nodes `p` and `q`, find their lowest common ancestor: the lowest node that has both `p` and `q` as descendants (a node may be a descendant of itself). All values are unique.',
  examples: [{ input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3' }, { input: 'same tree, p = 5, q = 4', output: '5' }, { input: 'root = [1,2], p = 1, q = 2', output: '1' }],
  constraints: ['2 ≤ nodes ≤ 10⁵', 'values are unique', 'p ≠ q, both exist'],
  hints: ['What should a subtree report to its parent?', 'If both children report something, you found the split.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Two root paths', idea: 'Store root→p and root→q; the last common node is the LCA.', time: 'O(n)', space: 'O(n)', bottleneck: 'Two searches and stored paths.' },
    { id: 'optimal', kind: 'optimal', name: 'Single recursion', idea: 'Return p/q when found; a node with non-null answers on both sides is the LCA.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'Each subtree **reports** p, q or null.',
  video,
  videoArgs: [T, P, Q],
  judge: {
    type: 'fn', fn: 'lowestCommonAncestor', params: ['TreeNode', 'TreeNode@ref', 'TreeNode@ref'], ret: 'TreeNode@val',
    tests: [{ args: [T, 5, 1], out: 3 }, { args: [T, 5, 4], out: 5 }, { args: [[1, 2], 1, 2], out: 1 }, { args: [T, 6, 4], out: 5 }],
    gen: (r: Rng) => randomPair(r),
    ref: (lv: Level, p: number, q: number) => lca(lv, p, q),
  },
};

export default problem;
