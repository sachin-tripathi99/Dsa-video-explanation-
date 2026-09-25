import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const T = [4, 2, 7, 1, 3, 6, 9];

function video() {
  const v = new Video('invert-tree', 'Invert Binary Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root' });
  v.say('Invert the tree: mirror it left to right, so every left child becomes a right child and vice versa. Return the root.');

  v.chapter('better', 'Level by level with a queue', { cx: 'O(n)', code: ['queue = [root]', 'while queue: node = pop; swap node.left, node.right; enqueue children'] });
  v.eq('swap children of every node, in BFS order').say('We can visit nodes in any order, as long as every node gets its two children swapped. A queue works.');

  v.chapter('optimal', 'Recursion: swap, then recurse', { cx: 'O(n)', code: ['invert(node):', '  if node is null: return null', '  swap node.left and node.right', '  invert(node.left); invert(node.right)', '  return node'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'mirroring' });
  const pre: string[] = [];
  const walk = (id: string | null) => { if (!id) return; pre.push(id); walk(t.left(id)); walk(t.right(id)); };
  walk('t0');
  v.say('Recursively: swap this node’s children, then invert each subtree.');
  pre.forEach((id, i) => {
    const l = t.left(id);
    const r = t.right(id);
    if (!l && !r) return;
    t.setKid(id, 0, r).setKid(id, 1, l);
    t.clearTones().tone(id, 'active');
    v.line(2).eq(`swap children of ${t.val(id)}`);
    if (i === 0) v.say('At the root, four: swap its subtrees. Now seven is on the left and two on the right.');
    else v.hold(900);
  });
  t.clearTones();
  const out: (number | string)[] = [];
  const bfs = t.bfs();
  bfs.forEach((id) => out.push(t.val(id) as number));
  v.eq(`[${out.join(', ')}]`, 'ok').say('Every node was visited once and its children swapped: O of n time, O of h stack.');
  v.answer(out);
  recap(v, [{ name: 'BFS, swap at each node', time: 'O(n)', space: 'O(width)', kind: 'better' }, { name: 'Recursive swap', time: 'O(n)', space: 'O(h)', kind: 'optimal' }], 'Any traversal works, as long as each node swaps its children once.', ['Transform every node → any traversal + local change', 'Pre-order: change the node, then recurse'], 'When every node needs the same local change, pick any traversal and apply it.');
  return v.build();
}

const problem: Problem = {
  slug: 'invert-binary-tree',
  statement: 'Given the `root` of a binary tree, **invert** it (mirror it left to right) and return its root.',
  examples: [{ input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' }, { input: 'root = [2,1,3]', output: '[2,3,1]' }, { input: 'root = []', output: '[]' }],
  constraints: ['0 ≤ nodes ≤ 100'],
  hints: ['What happens at a single node?', 'Swap the children, then do the same for each subtree.'],
  approaches: [
    { id: 'better', kind: 'better', name: 'BFS with a queue', idea: 'Visit nodes level by level and swap each node’s children.', time: 'O(n)', space: 'O(width)' },
    { id: 'optimal', kind: 'optimal', name: 'Recursive swap', idea: 'Swap `left` and `right`, then invert both subtrees.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'A **local change at every node** + any traversal = a whole-tree transformation.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'invertTree', params: ['TreeNode'], ret: 'TreeNode',
    tests: [{ args: [[4, 2, 7, 1, 3, 6, 9]], out: [4, 7, 2, 9, 6, 3, 1] }, { args: [[2, 1, 3]], out: [2, 3, 1] }, { args: [[]], out: [] }, { args: [[1, 2]], out: [1, null, 2] }],
  },
};

export default problem;
