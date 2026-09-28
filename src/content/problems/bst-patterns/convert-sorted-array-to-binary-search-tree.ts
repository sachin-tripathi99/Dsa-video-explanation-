import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { toLevel, type TNode } from '../../treeutil';

const A = [-10, -3, 0, 5, 9, 12, 20];
function mid(a: number[]) { const go = (lo: number, hi: number): TNode | null => { if (lo > hi) return null; const m = (lo + hi) >> 1; return { v: a[m], l: go(lo, m - 1), r: go(m + 1, hi) }; }; return toLevel(go(0, a.length - 1)); }

function video() {
  const v = new Video('sorted-array-to-bst', 'Convert Sorted Array to Binary Search Tree');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'sorted nums' });
  v.say('Turn a sorted array into a height-balanced binary search tree: at every node the two subtrees’ heights differ by at most one. Several answers are valid.');

  v.chapter('insight', 'Why the middle?');
  v.clear();
  v.text('t', { title: 'The root splits the values', lines: ['Everything left of the root in the array → left subtree', 'Everything right of it → right subtree', 'Pick the middle so both sides get the same number of values'], shown: 3 });
  v.say('Whatever value we pick as the root, the smaller values go left and the bigger values go right. To keep the two sides the same size, and the tree balanced, pick the middle. Then do the same inside each half.');

  v.chapter('brute', 'Recursion on sliced copies', { cx: 'O(n log n) time and space', code: ['build(arr): m = len(arr) // 2', '  root = arr[m]', '  root.left = build(arr[:m]); root.right = build(arr[m+1:])   # copies'] });
  v.eq('slicing copies every level of the recursion', 'warn').say('The idea is right, but slicing new arrays at every call copies about n values per level of recursion: n log n extra work.');

  v.chapter('optimal', 'Recursion on index ranges', { cx: 'O(n) time · O(log n) stack', code: ['build(lo, hi):', '  if lo > hi: return null', '  m = (lo + hi) // 2; root = nums[m]', '  root.left = build(lo, m − 1); root.right = build(m + 1, hi)'] });
  v.clear().layout('row');
  const a = v.array('a', A, { label: 'nums' });
  const t = v.tree('t', { binary: true, label: 'balanced BST' });
  v.weight('t', 1.4);
  let told = 0;
  const go = (lo: number, hi: number, parent: string | null, side: 0 | 1) => {
    if (lo > hi) return;
    const m = (lo + hi) >> 1;
    a.clearTones().noWin().win(lo, hi, 'win').tone(m, 'active');
    const id = t.add(parent, A[m], parent === null ? undefined : side);
    t.clearTones().tone(id, 'active');
    v.line(2).eq(`range [${lo}..${hi}] → middle index ${m} → ${A[m]}`);
    if (told === 0) { v.say(`The whole array is indices zero to six. The middle, index three, holds five: the root.`); told++; }
    else if (told === 1) { v.say(`The left half, zero to two, has middle minus three: the left child of five. Pass index ranges instead of copies.`); told++; }
    else v.hold(650);
    go(lo, m - 1, id, 0);
    go(m + 1, hi, id, 1);
  };
  go(0, A.length - 1, null, 0);
  a.clearTones().noWin(); t.clearTones();
  v.eq(`[${mid(A).map((x) => (x === null ? 'null' : x)).join(',')}]`, 'ok').say('Every value is placed once, in linear time, and the tree is perfectly balanced. In-order reading of the tree gives back the array.');
  v.answer(mid(A));

  recap(v, [{ name: 'Sliced copies', time: 'O(n log n)', space: 'O(n log n)' }, { name: 'Index ranges', time: 'O(n)', space: 'O(log n)' }], 'Middle of the range is the root; recurse on both halves.', ['Sorted → balanced BST: middle as root'], 'Balanced means both halves get the same number of values.');
  void words;
  return v.build();
}

const problem: Problem = {
  slug: 'convert-sorted-array-to-binary-search-tree',
  statement: 'Given an integer array `nums` sorted in ascending order, convert it to a height-balanced binary search tree. Any valid answer is accepted.',
  examples: [{ input: 'nums = [-10,-3,0,5,9]', output: '[0,-3,9,-10,null,5]', why: '[0,-10,5,null,-3,null,9] is also accepted.' }, { input: 'nums = [1,3]', output: '[3,1]' }],
  constraints: ['1 ≤ n ≤ 10⁴', 'strictly increasing'],
  hints: ['Which value should be the root to keep both sides equal?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sliced copies', idea: 'Middle as root; recurse on copied halves.', time: 'O(n log n)', space: 'O(n log n)', bottleneck: 'Copies.' },
    { id: 'optimal', kind: 'optimal', name: 'Index ranges', idea: 'build(lo, hi) with the middle index as root.', time: 'O(n)', space: 'O(log n)' },
  ],
  takeaway: '**Middle** of the range is the root.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'sortedArrayToBST', params: ['int[]'], ret: 'TreeNode', cmp: { checker: 'balancedBst' },
    tests: [{ args: [[-10, -3, 0, 5, 9]], out: mid([-10, -3, 0, 5, 9]) }, { args: [[1, 3]], out: mid([1, 3]) }, { args: [A], out: mid(A) }],
    gen: (r: Rng) => [r.distinct(r.int(1, 15), -30, 30).sort((x, y) => x - y)],
    ref: (a: number[]) => mid(a),
  },
};

export default problem;
