import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const T = [1, 2, 2, 3, 4, 4, 3];

function video() {
  const v = new Video('symmetric-tree', 'Symmetric Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root' });
  v.say('Is the tree a mirror image of itself around its centre?');

  v.chapter('brute', 'Mirror a copy, then compare', { cx: 'O(n)', code: ['copy = invert(clone(root))', 'return sameTree(root, copy)'] });
  v.eq('reuses Invert Binary Tree + Same Tree').say('A first idea reuses two problems we solved: make a mirrored copy and check whether it is the same tree. It works, but builds a whole copy.');

  v.chapter('optimal', 'Compare the two halves as mirrors', { cx: 'O(n)', code: ['mirror(a, b):', '  if both null: return true', '  if one null or a.val != b.val: return false', '  return mirror(a.left, b.right) and mirror(a.right, b.left)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'outer pairs and inner pairs' });
  const pairs: [string, string, string][] = [['t1', 't2', 'the two children of the root'], ['t3', 't6', 'outer pair: left.left with right.right'], ['t4', 't5', 'inner pair: left.right with right.left']];
  pairs.forEach(([a, b, what], i) => {
    t.tone([a, b], t.val(a) === t.val(b) ? 'ok' : 'bad');
    v.line(3).eq(`${what}: ${t.val(a)} = ${t.val(b)}`, 'ok');
    if (i === 0) v.say('Compare the left subtree with the right subtree, but as mirrors. Their roots must match: two and two.');
    else if (i === 1) v.say('Then the outer children must match: the left’s left with the right’s right.');
    else v.say('And the inner children: the left’s right with the right’s left. Everything matches, so the tree is symmetric.');
  });
  v.answer(true);
  recap(v, [{ name: 'Mirror a copy + same tree', time: 'O(n)', space: 'O(n)' }, { name: 'Mirror recursion on two halves', time: 'O(n)', space: 'O(h)' }], 'Same Tree with the children crossed.', ['Mirror check = compare outer with outer, inner with inner'], 'Symmetric Tree is Same Tree with crossed arguments. Spotting such small twists is how you reuse solutions.');
  return v.build();
}

const problem: Problem = {
  slug: 'symmetric-tree',
  statement: 'Given the `root` of a binary tree, check whether it is a **mirror of itself** (symmetric around its centre).',
  examples: [{ input: 'root = [1,2,2,3,4,4,3]', output: 'true' }, { input: 'root = [1,2,2,null,3,null,3]', output: 'false' }],
  constraints: ['1 ≤ nodes ≤ 1000'],
  hints: ['When are two trees mirror images of each other?', 'Compare left.left with right.right and left.right with right.left.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Mirror a copy and compare', idea: 'Clone and invert the tree, then run Same Tree against the original.', time: 'O(n)', space: 'O(n)', bottleneck: 'Builds a full copy.' },
    { id: 'optimal', kind: 'optimal', name: 'Mirror recursion', idea: '`mirror(a, b)`: both null → true; one null or different values → false; else `mirror(a.left, b.right) && mirror(a.right, b.left)`.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'Symmetric = **Same Tree with crossed children**.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'isSymmetric', params: ['TreeNode'], ret: 'boolean',
    tests: [{ args: [[1, 2, 2, 3, 4, 4, 3]], out: true }, { args: [[1, 2, 2, null, 3, null, 3]], out: false }, { args: [[1]], out: true }, { args: [[1, 2, 2, 2, null, 2]], out: false }],
  },
};

export default problem;
