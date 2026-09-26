import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { toLevel, bstInsert, type TNode } from '../../treeutil';

const PRE = [3, 9, 20, 15, 7];
const IN = [9, 3, 15, 20, 7];
function buildRef(pre: number[], ino: number[]) { let i = 0; const idx = new Map(ino.map((x, k) => [x, k])); const go = (lo: number, hi: number): TNode | null => { if (lo > hi) return null; const v = pre[i++]; const m = idx.get(v)!; const n: TNode = { v, l: null, r: null }; n.l = go(lo, m - 1); n.r = go(m + 1, hi); return n; }; return toLevel(go(0, ino.length - 1)); }

function video() {
  const v = new Video('construct-tree-pre-in', 'Construct Binary Tree from Preorder and Inorder Traversal');
  v.chapter('intro', 'The problem');
  v.array('p', PRE, { label: 'preorder (node, left, right)' });
  v.array('i', IN, { label: 'inorder (left, node, right)' });
  v.say('Rebuild the tree from its preorder and inorder traversals. All values are distinct.');
  v.eq(`→ [${buildRef(PRE, IN).map((x) => (x === null ? 'null' : x)).join(',')}]`);

  v.chapter('insight', 'What each traversal tells us');
  v.clear();
  const pa = v.array('p', PRE, { label: 'preorder' });
  const ia = v.array('i', IN, { label: 'inorder' });
  pa.tone(0, 'active');
  ia.tone(1, 'active').tone(0, 'cmp').tone([2, 3, 4], 'ok').subs(['left', 'root', 'right', 'right', 'right']);
  v.say('The first preorder value is the root: three. Find three in the inorder list. Everything to its left, just nine, is the left subtree; everything to its right, fifteen, twenty and seven, is the right subtree. The sizes tell us how to split the preorder list too. Then recurse on both halves.');

  v.chapter('brute', 'Recursion with a linear search for the root', { cx: 'O(n²) worst', code: ['build(pre, in):', '  root = pre[0]; m = index of root in in   # linear scan', '  left = build(pre[1 .. m], in[0 .. m−1])', '  right = build(pre[m+1 ..], in[m+1 ..])'] });
  v.eq('scanning for the root costs O(n) per node', 'warn').say('Scanning the inorder list for each root, and slicing new arrays, costs linear time per node: quadratic for a skewed tree.');

  v.chapter('optimal', 'Hash map of inorder positions + a preorder pointer', { cx: 'O(n)', code: ['pos[value] = index in inorder', 'i = 0   # next preorder value is the next root', 'build(lo, hi):', '  if lo > hi: return null', '  root = pre[i++]; m = pos[root]', '  root.left = build(lo, m − 1); root.right = build(m + 1, hi)'] });
  v.clear().layout('row');
  const p2 = v.array('p', PRE, { label: 'preorder' });
  const i2 = v.array('i', IN, { label: 'inorder' });
  const t = v.tree('t', { binary: true, label: 'tree being built' });
  v.weight('t', 1.5);
  const pos = new Map(IN.map((x, k) => [x, k]));
  let i = 0;
  let told = 0;
  const go = (lo: number, hi: number, parent: string | null, side: 0 | 1): void => {
    if (lo > hi) return;
    const val = PRE[i];
    const m = pos.get(val)!;
    p2.clearTones().tone(i, 'active'); for (let k = 0; k < i; k++) p2.tone(k, 'done');
    i2.clearTones().noWin().win(lo, hi, 'win').tone(m, 'active');
    const id = t.add(parent, val, parent === null ? undefined : side);
    t.clearTones().tone(id, 'active');
    i++;
    v.line(4).eq(`root ${val} (pre[${i - 1}]) · inorder range [${lo}..${hi}] splits at ${m}`);
    if (told === 0) { v.say(`Store every inorder position in a hash map, so finding a root is instant. Keep a pointer into preorder: each call takes the next value as its root. The call covers an inorder range; the root splits it into the left and right parts.`); told++; }
    else if (told === 1 && m - lo === 0 && hi - m === 0) { v.say(`${words(val)}’s range holds only itself: it becomes a leaf.`); told++; }
    else v.hold(800);
    go(lo, m - 1, id, 0);
    go(m + 1, hi, id, 1);
  };
  go(0, IN.length - 1, null, 0);
  p2.clearTones(); i2.clearTones().noWin(); t.clearTones();
  v.eq(`[${buildRef(PRE, IN).map((x) => (x === null ? 'null' : x)).join(',')}]`, 'ok').say('Each value is placed once with an O of one lookup: linear time. The preorder pointer works because preorder lists a node, then its entire left subtree, then its right subtree, which is exactly the order our recursion builds them.');
  v.answer(buildRef(PRE, IN));

  recap(v, [{ name: 'Linear search for roots', time: 'O(n²)', space: 'O(n)' }, { name: 'Hash map + preorder pointer', time: 'O(n)', space: 'O(n)' }], 'pre gives the root; in splits left and right.', ['Rebuild a tree from traversals → root from pre/post, split with in-order'], 'Preorder says who; inorder says which side.');
  void bstInsert;
  return v.build();
}

function randomDistinctTree(r: Rng) { const n = r.int(1, 10); const vals = r.shuffle(Array.from({ length: 30 }, (_, k) => k - 10)).slice(0, n); const nodes: TNode[] = vals.map((x) => ({ v: x, l: null, r: null })); for (let k = 1; k < n; k++) { for (;;) { const p = nodes[r.int(0, k - 1)]; if (r.chance(0.5)) { if (!p.l) { p.l = nodes[k]; break; } } else if (!p.r) { p.r = nodes[k]; break; } } } const pre: number[] = [], ino: number[] = []; const a = (x: TNode | null) => { if (!x) return; pre.push(x.v); a(x.l); a(x.r); }; const b = (x: TNode | null) => { if (!x) return; b(x.l); ino.push(x.v); b(x.r); }; a(nodes[0]); b(nodes[0]); return [pre, ino]; }

const problem: Problem = {
  slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
  statement: 'Given two integer arrays `preorder` and `inorder` of the same binary tree (all values unique), construct and return the binary tree.',
  examples: [{ input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', output: '[3,9,20,null,null,15,7]' }, { input: 'preorder = [-1], inorder = [-1]', output: '[-1]' }],
  constraints: ['1 ≤ n ≤ 3000', 'values are unique'],
  hints: ['preorder[0] is the root.', 'Its position in inorder splits left and right subtrees.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Linear search', idea: 'Recurse on sliced arrays, scanning inorder for each root.', time: 'O(n²)', space: 'O(n²) with slices', bottleneck: 'Scans and copies.' },
    { id: 'optimal', kind: 'optimal', name: 'Map + pointer', idea: 'pos map for inorder; global preorder index; recurse on inorder ranges.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Pre gives the **root**, in gives the **split**.',
  video,
  videoArgs: [PRE, IN],
  judge: {
    type: 'fn', fn: 'buildTree', params: ['int[]', 'int[]'], ret: 'TreeNode',
    tests: [{ args: [PRE, IN], out: buildRef(PRE, IN) }, { args: [[-1], [-1]], out: [-1] }, { args: [[1, 2, 3], [3, 2, 1]], out: buildRef([1, 2, 3], [3, 2, 1]) }],
    gen: (r: Rng) => randomDistinctTree(r),
    ref: (pre: number[], ino: number[]) => buildRef(pre, ino),
  },
};

export default problem;
