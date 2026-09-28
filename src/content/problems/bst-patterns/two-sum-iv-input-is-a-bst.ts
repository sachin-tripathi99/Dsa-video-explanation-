import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, inorder, randomBst, type Level } from '../../treeutil';
import { orderIds } from '../../treevid';

const T: Level = [5, 3, 6, 2, 4, null, 7];
const K = 9;
function ts(lv: Level, k: number) { const s = inorder(build(lv)); let i = 0, j = s.length - 1; while (i < j) { const x = s[i] + s[j]; if (x === k) return true; if (x < k) i++; else j--; } return false; }

function video() {
  const v = new Video('two-sum-bst', 'Two Sum IV - Input is a BST');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: `k = ${K}` });
  v.say(`Do two different nodes in the BST have values that add up to ${words(K)}?`);
  v.eq(`answer: ${ts(T, K)} (2 + 7, 3 + 6, 4 + 5)`);

  v.chapter('brute', 'For each node, search the BST for k − val', { cx: 'O(n · h)', code: ['for each node x:', '  search the BST for k − x.val (and make sure it is another node)'] });
  v.eq('n searches of cost h', 'warn').say('For every node, search the tree for its partner. Each search costs the height: n times h.');

  v.chapter('better', 'Hash set during any traversal', { cx: 'O(n) time · O(n) space', code: ['for each node x (any order):', '  if k − x.val in seen: true', '  seen.add(x.val)'] });
  v.eq('ignores the BST ordering; needs O(n) memory', 'warn').say('Exactly like the classic Two Sum: remember the values seen so far in a hash set. Linear time, but linear extra space, and it ignores the BST property.');

  v.chapter('optimal', 'Two pointers from both ends of the in-order sequence', { cx: 'O(n) time · O(h) space', code: ['lo = iterator of ascending values, hi = iterator of descending values', 'while lo < hi:', '  s = lo + hi', '  s == k → true; s < k → advance lo; s > k → advance hi'] });
  v.clear().layout('row');
  const t = v.binaryTree('t', T, { label: 'lo = next smallest · hi = next largest' });
  const ids = orderIds(t, 'in');
  const arr = v.array('a', ids.map((x) => t.val(x) as number), { label: 'in-order (never actually stored)' });
  v.weight('t', 1.4);
  let i = 0, j = ids.length - 1, told = 0;
  v.say('A BST is a sorted sequence, so use two pointers: one from the smallest value, one from the largest. We do not need to store the sequence: two BST iterators, each with a stack of height h, produce the values on demand, one forwards and one backwards.');
  while (i < j) {
    const a = t.val(ids[i]) as number, b = t.val(ids[j]) as number;
    t.clearTones().tone(ids[i], 'active').tone(ids[j], 'cmp');
    arr.clearTones().ptrs({ lo: i, hi: j });
    const s = a + b;
    if (s === K) { t.tone([ids[i], ids[j]], 'ok'); arr.tone([i, j], 'ok'); v.line(3).eq(`${a} + ${b} = ${s} = k → true`, 'ok').say(`Two plus seven is nine: found.`); break; }
    v.line(3).eq(`${a} + ${b} = ${s} ${s < K ? '< k → lo moves up' : '> k → hi moves down'}`);
    if (told === 0) { v.say(`${words(a)} plus ${words(b)} is ${words(s)}. ${s < K ? 'Too small: move the low iterator to the next bigger value.' : 'Too big: move the high iterator to the next smaller value.'}`); told++; } else v.hold(700);
    if (s < K) i++; else j--;
  }
  arr.noPtr();
  v.answer(ts(T, K));

  recap(v, [{ name: 'Search for each partner', time: 'O(n · h)', space: 'O(h)' }, { name: 'Hash set', time: 'O(n)', space: 'O(n)' }, { name: 'Two BST iterators', time: 'O(n)', space: 'O(h)' }], 'Forward and backward in-order iterators act as two pointers.', ['Pair sum on a BST → two pointers with iterators'], 'A BST can be walked from both ends at once.');
  return v.build();
}

const problem: Problem = {
  slug: 'two-sum-iv-input-is-a-bst',
  statement: 'Given the `root` of a binary search tree and an integer `k`, return `true` if there exist two different elements in the BST whose sum equals `k`.',
  examples: [{ input: 'root = [5,3,6,2,4,null,7], k = 9', output: 'true' }, { input: 'root = [5,3,6,2,4,null,7], k = 28', output: 'false' }],
  constraints: ['1 ≤ nodes ≤ 10⁴', 'valid BST'],
  hints: ['In-order is sorted: two pointers.', 'Two stack-based iterators avoid storing the array.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Search partner', idea: 'For each node, BST-search for k − val.', time: 'O(n · h)', space: 'O(h)', bottleneck: 'n searches.' },
    { id: 'better', kind: 'better', name: 'Hash set', idea: 'Classic Two Sum over any traversal.', time: 'O(n)', space: 'O(n)', bottleneck: 'Linear memory.' },
    { id: 'optimal', kind: 'optimal', name: 'Two iterators', idea: 'Ascending and descending in-order iterators as two pointers.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: '**Two iterators** = two pointers on a BST.',
  video,
  videoArgs: [T, K],
  judge: {
    type: 'fn', fn: 'findTarget', params: ['TreeNode', 'int'], ret: 'boolean',
    tests: [{ args: [T, 9], out: true }, { args: [T, 28], out: false }, { args: [[1], 2], out: false }, { args: [[2, 1, 3], 4], out: true }],
    gen: (r: Rng) => [randomBst(r, 12, -20, 20), r.int(-30, 30)],
    ref: (lv: Level, k: number) => ts(lv, k),
  },
};

export default problem;
