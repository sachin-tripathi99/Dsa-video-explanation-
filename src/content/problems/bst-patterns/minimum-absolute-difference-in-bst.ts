import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, inorder, randomBst, type Level } from '../../treeutil';
import { orderIds } from '../../treevid';

const T: Level = [27, 12, 49, 5, 18, 40, 60];
function mad(lv: Level) { const s = inorder(build(lv)); let b = Infinity; for (let i = 1; i < s.length; i++) b = Math.min(b, s[i] - s[i - 1]); return b; }

function video() {
  const v = new Video('min-abs-diff-bst', 'Minimum Absolute Difference in BST');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'BST' });
  v.say('Return the minimum absolute difference between the values of any two different nodes in the BST.');
  v.eq(`answer: ${mad(T)}`);

  v.chapter('brute', 'Brute force: compare every pair', { cx: 'O(n²)', code: ['collect all values', 'for every pair: best = min(best, |a − b|)'] });
  v.eq('n² pairs', 'bad').say('Comparing every pair of nodes is quadratic. But in sorted order, the closest pair is always adjacent, and a BST gives sorted order for free.');

  v.chapter('optimal', 'In-order traversal with a “previous” value', { cx: 'O(n) · O(h)', code: ['inorder(node):', '  inorder(left)', '  if prev exists: best = min(best, node.val − prev)', '  prev = node.val', '  inorder(right)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'in-order: values arrive sorted' });
  const out = v.array('o', [], { label: 'in-order so far' });
  const ids = orderIds(t, 'in');
  let prev: number | null = null, best = Infinity, told = 0;
  ids.forEach((id, i) => {
    const val = t.val(id) as number;
    t.clearTones(); ids.slice(0, i).forEach((x) => t.tone(x, 'done')); t.tone(id, 'active');
    out.push(val);
    let eq = `first value ${val}`;
    if (prev !== null) { const d = val - prev; const nb = d < best; best = Math.min(best, d); eq = `${val} − ${prev} = ${d}${nb ? ' ← best' : ''}`; out.clearTones().tone([i - 1, i], nb ? 'ok' : 'cmp'); }
    v.line(prev === null ? 3 : 2).counter(`best: ${best === Infinity ? '—' : best}`).eq(eq, eq.includes('best') ? 'ok' : undefined);
    if (told === 0 && prev !== null) { v.say(`In-order hands us the values in sorted order, so only neighbours need comparing. Twelve minus five is seven.`); told++; }
    else if (told === 1 && eq.includes('best') && best < 7) { v.say(`${words(val)} minus ${words(prev!)} is ${words(val - prev!)}, a new smallest gap.`); told++; }
    else v.hold(600);
    prev = val;
  });
  t.clearTones(); out.clearTones();
  v.eq(`minimum difference = ${best}`, 'ok').say('One traversal and one variable: linear time, O of h space.');
  v.answer(mad(T));

  recap(v, [{ name: 'All pairs', time: 'O(n²)', space: 'O(n)' }, { name: 'In-order with prev', time: 'O(n)', space: 'O(h)' }], 'Sorted order → only adjacent values can be closest.', ['BST + “sorted” question → in-order with prev'], 'The BST is a sorted array in disguise.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-absolute-difference-in-bst',
  statement: 'Given the `root` of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two different nodes in the tree.',
  examples: [{ input: 'root = [4,2,6,1,3]', output: '1' }, { input: 'root = [1,0,48,null,null,12,49]', output: '1' }],
  constraints: ['2 ≤ nodes ≤ 10⁴', '0 ≤ Node.val ≤ 10⁵'],
  hints: ['In sorted order, the closest pair is adjacent.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All pairs', idea: 'Compare every pair of values.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'In-order + prev', idea: 'Compare each value with the previous in-order value.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'In-order + **prev**.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'getMinimumDifference', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [[4, 2, 6, 1, 3]], out: 1 }, { args: [[1, 0, 48, null, null, 12, 49]], out: 1 }, { args: [T], out: mad(T) }],
    gen: (r: Rng) => { let lv = randomBst(r, 12, 0, 80); while (lv.filter((x) => x !== null).length < 2) lv = randomBst(r, 12, 0, 80); return [lv]; },
    ref: (lv: Level) => mad(lv),
  },
};

export default problem;
