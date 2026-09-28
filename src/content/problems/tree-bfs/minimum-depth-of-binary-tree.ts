import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { levelScene } from '../../treevid';

const T: Level = [3, 9, 20, null, null, 15, 7, 1, 2, 4, 5];
function mind(lv: Level) { const r = build(lv); if (!r) return 0; let q = [r], d = 1; for (;;) { for (const n of q) if (!n.l && !n.r) return d; q = q.flatMap((n) => [n.l, n.r].filter((x): x is TNode => !!x)); d++; } }

function video() {
  const v = new Video('minimum-depth', 'Minimum Depth of Binary Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root' });
  v.say('The minimum depth is the number of nodes on the shortest path from the root down to a leaf. Careful: a node with one child is not a leaf.');
  v.eq(`answer: ${mind(T)} (3 → 9)`);

  v.chapter('brute', 'DFS over the whole tree', { cx: 'O(n) always', code: ['minDepth(node):', '  if leaf: return 1', '  if one child is missing: return 1 + minDepth(the other)', '  return 1 + min(minDepth(left), minDepth(right))'] });
  v.eq('explores every node, even deep ones far below the answer', 'warn').say('Recursion works, with one trap: if a node has only one child, the missing side is not a leaf, so ignore it instead of returning zero. But DFS explores the whole tree, even if the shallowest leaf is right at the top.');

  v.chapter('optimal', 'BFS: stop at the first leaf', { cx: 'O(nodes above the answer)', code: ['for each level d = 1, 2, …:', '  for each node on the level:', '    if it is a leaf: return d'] });
  let told = 0;
  levelScene(v, T, 'first leaf wins', (vals, d, ids, t) => {
    const leaf = ids.find((id) => !t.left(id) && !t.right(id));
    if (leaf) { t.tone(leaf, 'ok'); return { eq: `level ${d + 1}: ${t.val(leaf)} is a leaf → return ${d + 1}`, ok: true, stop: true, say: `On level two, nine has no children: it is a leaf. BFS finds the shallowest leaf first, so we can stop immediately and never look at the ${words(Object.keys(t.p.nodes).length - 3)} deeper nodes.` }; }
    told++;
    return { eq: `level ${d + 1}: no leaf yet`, say: told === 1 ? 'Level one is the root, which has children: not a leaf.' : undefined };
  }, [0, 1, 2]);
  v.answer(mind(T));

  recap(v, [{ name: 'DFS', time: 'O(n)', space: 'O(h)' }, { name: 'BFS with early exit', time: 'O(nodes up to the shallowest leaf)', space: 'O(width)' }], 'The first leaf BFS meets is the shallowest.', ['Nearest / shallowest → BFS, stop early'], 'BFS answers “closest” questions without exploring everything.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-depth-of-binary-tree',
  statement: 'Given a binary tree, find its minimum depth: the number of nodes along the shortest path from the root down to the nearest leaf (a node with no children).',
  examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '2' }, { input: 'root = [2,null,3,null,4,null,5,null,6]', output: '5' }],
  constraints: ['0 ≤ nodes ≤ 10⁵'],
  hints: ['A node with one child is not a leaf.', 'BFS can stop at the first leaf.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS', idea: 'Recursive min, ignoring missing children.', time: 'O(n)', space: 'O(h)', bottleneck: 'Always explores everything.' },
    { id: 'optimal', kind: 'optimal', name: 'BFS', idea: 'Level by level; return at the first leaf.', time: 'O(n) worst, often far less', space: 'O(width)' },
  ],
  pitfalls: ['min(left, right) with a null child returns 1 incorrectly: a missing child is not a leaf.'],
  takeaway: 'BFS **stops at the first leaf**.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'minDepth', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [[3, 9, 20, null, null, 15, 7]], out: 2 }, { args: [[2, null, 3, null, 4, null, 5, null, 6]], out: 5 }, { args: [[]], out: 0 }, { args: [T], out: 2 }],
    gen: (r: Rng) => [randomTree(r)],
    ref: (lv: Level) => mind(lv),
  },
};

export default problem;
