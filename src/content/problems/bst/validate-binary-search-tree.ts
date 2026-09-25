import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';
import { build, inorder, randomBst, randomTree } from '../../treeutil';

const T = [5, 1, 6, null, null, 3, 7];

function video() {
  const v = new Video('validate-bst', 'Validate Binary Search Tree');
  v.chapter('intro', 'The problem');
  const t0 = v.binaryTree('t', T, { label: 'is this a valid BST?' });
  v.say('Decide whether a binary tree is a valid BST: every left subtree holds strictly smaller values, every right subtree strictly bigger, all the way down.');
  t0.tone(['t0', 't5'], 'bad');
  v.eq('3 is in 5’s right subtree but 3 < 5 → invalid', 'bad').say('This one is a trap. Each parent-child pair looks fine: six is bigger than five, three is smaller than six. But three sits in five’s right subtree and is smaller than five.');
  t0.clearTones();

  v.chapter('brute', 'In-order into a list, check sorted', { cx: 'O(n)', code: ['vals = inorder(root)', 'return every vals[i] < vals[i+1]'] });
  v.clear();
  const io = inorder(build(T));
  const a = v.array('io', io, { label: 'in-order values' });
  for (let i = 1; i < io.length; i++) if (io[i] <= io[i - 1]) a.tone([i - 1, i], 'bad');
  v.eq(`[${io.join(', ')}] is not strictly increasing → invalid`, 'bad').say('In-order traversal of a valid BST is strictly increasing. Here five is followed by three, so it is invalid. Correct, but it stores all n values.');

  v.chapter('optimal', 'Pass allowed ranges down', { cx: 'O(n)', code: ['valid(node, low, high):', '  if node is null: return true', '  if not (low < node.val < high): return false', '  return valid(left, low, node.val) and valid(right, node.val, high)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'each node must lie inside (low, high)' });
  const steps: [string, string, boolean][] = [['t0', '(−∞, +∞)', true], ['t1', '(−∞, 5)', true], ['t2', '(5, +∞)', true], ['t5', '(5, 6)', false]];
  steps.forEach(([id, range, ok], i) => {
    t.badge(id, range).tone(id, ok ? 'ok' : 'bad');
    v.line(ok ? 3 : 2).eq(`${t.val(id)} in ${range}? ${ok ? 'yes' : 'no → false'}`, ok ? 'ok' : 'bad');
    if (i === 0) v.say('Instead, pass down the range each node must fall in. The root can be anything.');
    else if (i === 1) v.say('Going left, the upper bound becomes the parent’s value: one must be below five. It is.');
    else if (i === 2) v.say('Going right, the lower bound becomes the parent: six must be above five.');
    else v.say('Three inherits both bounds: above five, from the root, and below six, from its parent. Three is not above five. Invalid, and we stop right there.');
  });
  v.answer(false);
  recap(v, [{ name: 'In-order list, check sorted', time: 'O(n)', space: 'O(n)' }, { name: 'Recursive bounds', time: 'O(n)', space: 'O(h)' }], 'Bounds carry the constraints of every ancestor down to each node.', ['Checking only children is wrong; ancestors matter', 'Use 64-bit or null bounds so values like 2³¹ − 1 work'], 'Pass constraints down the tree; check them locally at each node.');
  return v.build();
}

const problem: Problem = {
  slug: 'validate-binary-search-tree',
  statement: 'Given the `root` of a binary tree, determine whether it is a valid **binary search tree**: every node’s left subtree contains only smaller values, every right subtree only larger values, and both subtrees are BSTs.',
  examples: [{ input: 'root = [2,1,3]', output: 'true' }, { input: 'root = [5,1,4,null,null,3,6]', output: 'false' }],
  constraints: ['1 ≤ nodes ≤ 10⁴', '-2³¹ ≤ Node.val ≤ 2³¹ − 1'],
  hints: ['Comparing a node only with its children is not enough.', 'What range must every node lie in?', 'In-order traversal of a BST is strictly increasing.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'In-order list, check sorted', idea: 'Collect the in-order values and verify they are strictly increasing.', time: 'O(n)', space: 'O(n)', bottleneck: 'Stores every value.' },
    { id: 'optimal', kind: 'optimal', name: 'Recursive bounds', idea: 'Each node must lie in `(low, high)`. Left child gets `(low, node.val)`, right child gets `(node.val, high)`.', time: 'O(n)', space: 'O(h)' },
  ],
  pitfalls: ['Only comparing with direct children.', 'Using `int` sentinels: a node can equal `Integer.MAX_VALUE`; use `long` or `null` bounds.', 'Duplicates are not allowed: use strict comparisons.'],
  takeaway: 'Pass **allowed ranges down** the tree; each node checks itself against all ancestors at once.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'isValidBST', params: ['TreeNode'], ret: 'boolean',
    tests: [{ args: [[2, 1, 3]], out: true }, { args: [[5, 1, 4, null, null, 3, 6]], out: false }, { args: [[5, 1, 6, null, null, 3, 7]], out: false }, { args: [[2147483647]], out: true }, { args: [[2, 2, 2]], out: false }, { args: [[-2147483648, null, 2147483647]], out: true }],
    gen: (r) => [r.chance(0.5) ? randomBst(r) : randomTree(r, 10, 1, 9)],
    ref: (lv: (number | null)[]) => { const io = inorder(build(lv)); return io.every((x, i) => i === 0 || io[i - 1] < x); },
  },
};

export default problem;
