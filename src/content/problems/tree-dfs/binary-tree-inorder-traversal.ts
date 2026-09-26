import type { Problem, Rng } from '../../types';
import { traversalVideo, orderIds } from '../../treevid';
import { build, randomTree, type Level, type TNode } from '../../treeutil';

const T: Level = [1, 2, 3, 4, 5, null, 6];
function ref(lv: Level) { const out: number[] = []; const go = (n: TNode | null) => { if (!n) return; go(n.l); out.push(n.v); go(n.r); }; go(build(lv)); return out; }
void orderIds;

const problem: Problem = {
  slug: 'binary-tree-inorder-traversal',
  statement: 'Given the `root` of a binary tree, return the inorder traversal of its nodes’ values (left, node, right).',
  examples: [{ input: 'root = [1,null,2,3]', output: '[1,3,2]' }, { input: 'root = []', output: '[]' }, { input: 'root = [1]', output: '[1]' }],
  constraints: ['0 ≤ number of nodes ≤ 100', '−100 ≤ Node.val ≤ 100'],
  hints: ['Recursion is trivial; can you do it iteratively?', 'Morris traversal uses O(1) extra space.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursive', idea: 'Three-line recursive DFS.', time: 'O(n)', space: 'O(h)', bottleneck: 'Deep trees can overflow the call stack.' },
    { id: 'better', kind: 'better', name: 'Iterative stack', idea: 'Simulate the recursion with an explicit stack.', time: 'O(n)', space: 'O(h)', bottleneck: 'Still O(h) memory.' },
    { id: 'optimal', kind: 'optimal', name: 'Morris traversal', idea: 'Temporary threads from in-order predecessors replace the stack.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Inorder: **left, node, right**.',
  video: () => traversalVideo('in', T),
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'inorderTraversal', params: ['TreeNode'], ret: 'List<Integer>',
    tests: [{ args: [[1, null, 2, 3]], out: ref([1, null, 2, 3]) }, { args: [[]], out: [] }, { args: [[1]], out: [1] }, { args: [T], out: ref(T) }],
    gen: (r: Rng) => [randomTree(r)],
    ref: (lv: Level) => ref(lv),
  },
};

export default problem;
