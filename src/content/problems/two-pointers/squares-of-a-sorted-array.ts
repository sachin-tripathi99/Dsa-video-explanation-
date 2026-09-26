import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [-4, -1, 0, 3, 10];

function video() {
  const v = new Video('squares-sorted', 'Squares of a Sorted Array');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'sorted, may contain negatives' });
  v.say('Given a sorted array, which may contain negative numbers, return the squares of every number, also in sorted order.');
  v.eq('squares: 16, 1, 0, 9, 100 → not sorted!', 'warn').say('Squaring breaks the order: minus four squared is sixteen, bigger than one and zero. Negative numbers flip around.');

  v.chapter('brute', 'Brute force: square, then sort', { cx: 'O(n log n)', code: ['sq = [x * x for x in a]', 'sort(sq)'] });
  v.clear();
  const sq = v.array('sq', A.map((x) => x * x), { label: 'squared' });
  v.line(0).say('The quick fix is to square everything and sort.');
  sq.setAll(A.map((x) => x * x).sort((x, y) => x - y)).tone([0, 1, 2, 3, 4], 'sorted');
  v.line(1).eq('sort costs O(n log n) and ignores that the input was sorted', 'warn').say('That is n log n, and it throws away the fact that the input was already sorted.');

  v.chapter('optimal', 'Optimal: the biggest square is at an end', { cx: 'O(n)', code: ['l, r, k = 0, n − 1, n − 1', 'while l <= r:', '  if |a[l]| > |a[r]|: out[k] = a[l]²; l += 1', '  else: out[k] = a[r]²; r −= 1', '  k −= 1'] });
  v.clear();
  const a = v.array('a', A, { label: 'a' });
  const out = v.array('out', A.map(() => null), { label: 'out (filled from the back)' });
  v.say('Here is the key observation. The largest square comes from either the most negative number or the most positive one, and those sit at the two ends of the array. So compare the ends, and fill the answer from the back.');
  let l = 0;
  let r = A.length - 1;
  const res: number[] = Array(A.length).fill(0);
  for (let k = A.length - 1; k >= 0; k--) {
    a.clearTones().ptrs({ l, r });
    for (let x = 0; x < A.length; x++) if (x < l || x > r) a.tone(x, 'done');
    out.clearTones().ptr('k', k);
    const takeL = Math.abs(A[l]) > Math.abs(A[r]);
    const x = takeL ? A[l] : A[r];
    res[k] = x * x;
    a.tone(takeL ? l : r, 'ok').tone(takeL ? r : l, 'cmp');
    out.set(k, x * x).tone(k, 'ok');
    v.line(takeL ? 2 : 3).eq(`|${A[l]}| vs |${A[r]}| → out[${k}] = ${x < 0 ? `(${x})` : x}² = ${x * x}`);
    if (k === A.length - 1) v.say(`Ten beats minus four in absolute value, so one hundred goes into the last slot. Move r left.`);
    else if (k === A.length - 2) v.say('Now minus four beats three, so sixteen goes next, and l moves right.');
    else v.hold(700);
    if (takeL) l++;
    else r--;
  }
  a.clearTones().noPtr();
  out.noPtr().clearTones();
  v.eq(`[${res.join(', ')}] in one pass`, 'ok').say('Each step places one square, so the whole thing is linear.');
  v.answer(res);

  recap(v, [{ name: 'Square and sort', time: 'O(n log n)', space: 'O(n)' }, { name: 'Two pointers from the ends', time: 'O(n)', space: 'O(n) for the output' }], 'The extremes live at the ends of a sorted array.', ['Sorted input + transformation that breaks order → merge from the ends', 'Fill the output from the back'], 'When the biggest values sit at both ends, merge inward and fill the answer from the back.');
  return v.build();
}

const problem: Problem = {
  slug: 'squares-of-a-sorted-array',
  statement: 'Given an integer array `nums` sorted in non-decreasing order, return an array of **the squares of each number** sorted in non-decreasing order.',
  examples: [{ input: 'nums = [-4,-1,0,3,10]', output: '[0,1,9,16,100]' }, { input: 'nums = [-7,-3,2,3,11]', output: '[4,9,9,49,121]' }],
  constraints: ['1 ≤ nums.length ≤ 10⁴', '−10⁴ ≤ nums[i] ≤ 10⁴', 'nums is sorted'],
  hints: ['Where are the largest squares?', 'Compare |nums[l]| and |nums[r]| and write into the answer from the back.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Square and sort', idea: 'Square every element, then sort.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Sorting ignores the existing order.' },
    { id: 'optimal', kind: 'optimal', name: 'Two pointers from the ends', idea: 'The largest square is at one of the ends; place it at the back of the output and move that pointer.', time: 'O(n)', space: 'O(n) output' },
  ],
  takeaway: 'Largest absolute values sit at the **ends** of a sorted array: merge inward, fill from the back.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'sortedSquares', params: ['int[]'], ret: 'int[]',
    tests: [{ args: [[-4, -1, 0, 3, 10]], out: [0, 1, 9, 16, 100] }, { args: [[-7, -3, 2, 3, 11]], out: [4, 9, 9, 49, 121] }, { args: [[-5]], out: [25] }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -20, 20).sort((a, b) => a - b)],
    ref: (a: number[]) => a.map((x) => x * x).sort((x, y) => x - y),
  },
};

export default problem;
