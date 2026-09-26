import type { Problem, Rng } from '../../types';
import { traversalVideo, orderIds } from '../../treevid';
import { build, randomTree, type Level, type TNode } from '../../treeutil';

const T: Level = [1, 2, 3, 4, 5, null, 6];
function ref(lv: Level) { const out: number[] = []; const go = (n: TNode | null) => { if (!n) return; go(n.l); go(n.r); out.push(n.v); }; go(build(lv)); return out; }
void orderIds;

const problem: Problem = {
  slug: 'binary-tree-postorder-traversal',
  statement: 'Given the `root` of a binary tree, return the postorder traversal of its nodes’ values (left, right, node).',
  examples: [{ input: 'root = [1,null,2,3]', output: '[3,2,1]' }, { input: 'root = []', output: '[]' }, { input: 'root = [1]', output: '[1]' }],
  constraints: ['0 ≤ number of nodes ≤ 100', '−100 ≤ Node.val ≤ 100'],
  hints: ['Recursion is trivial; can you do it iteratively?', 'Post-order is the reverse of a node-right-left pre-order.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursive', idea: 'Three-line recursive DFS.', time: 'O(n)', space: 'O(h)', bottleneck: 'Deep trees can overflow the call stack.' },
    { id: 'optimal', kind: 'optimal', name: 'Iterative (reversed node-right-left)', idea: 'Pre-order with children swapped, then reverse the output.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'Postorder: **left, right, node**.',
  video: () => traversalVideo('post', T),
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'postorderTraversal', params: ['TreeNode'], ret: 'List<Integer>',
    tests: [{ args: [[1, null, 2, 3]], out: ref([1, null, 2, 3]) }, { args: [[]], out: [] }, { args: [[1]], out: [1] }, { args: [T], out: ref(T) }],
    gen: (r: Rng) => [randomTree(r)],
    ref: (lv: Level) => ref(lv),
  },
};

export default problem;
