import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [1, 3, 4, 6, 9, 11, 15];
const T = 13;

function video() {
  const v = new Video('two-sum-ii', 'Two Sum II');
  v.chapter('intro', 'The problem');
  const a = v.array('nums', A, { label: 'numbers (sorted) · target = 13' });
  v.eq('find a[x] + a[y] = 13').note('sorted: smallest → largest');
  v.say('Two Sum two. The array is sorted from smallest to largest, and we need two different positions whose values add up to the target, thirteen.');
  v.eq('brute → better → optimal').note('think out loud');
  v.say("In an interview, don't jump to the clever answer. Start with something simple that works, then improve it one step at a time.");

  // Brute force
  v.chapter('brute', 'Brute force', {
    cx: 'O(n²)',
    code: ['for i in 0..n-1:', '  for j in i+1..n-1:', '    if a[i] + a[j] == t:', '      return [i, j]'],
  });
  a.ptrs({ i: 0, j: 1 });
  v.line(0, 1).counter('checks: 0').note('every pair (i, j)');
  v.say('Brute force means trying every pair. Fix i on the first number, and let j walk through every number after it.');
  let c = 0;
  let k = 0;
  outer: for (let i = 0; i < A.length; i++) {
    for (let j = i + 1; j < A.length; j++) {
      c++;
      const s = A[i] + A[j];
      const hit = s === T;
      a.clearTones().ptrs({ i, j }).tone([i, j], hit ? 'ok' : 'cmp');
      v.counter(`checks: ${c}`).line(hit ? 3 : 2).eq(`${A[i]} + ${A[j]} = ${s} ${hit ? '= 13 ✓' : '≠ 13'}`, hit ? 'ok' : 'bad').note('');
      if (hit) v.say(`${words(A[i])} plus ${words(A[j])} is thirteen. There's our pair.`);
      else if (k === 0) v.say("One plus three is four. That's not thirteen, so j moves on.");
      else if (k === 1) v.say('One plus four is five. Still no.');
      else if (k === 2) v.say("Let's fast-forward through the rest.");
      else v.hold(600);
      k++;
      if (hit) break outer;
    }
  }
  const brute = c;
  v.note('O(n²) time · O(1) space').eq(`${brute} checks for 7 numbers`, 'bad');
  v.say(`It works, but look at the counter: ${words(brute)} checks for just seven numbers. With n numbers that grows like n squared. For a hundred thousand numbers that's about five billion checks.`);
  a.clearTones();
  v.eq('sorted order: never used', 'warn').note('what did we ignore?');
  v.say("Where's the waste? We never used the fact that the array is sorted. That's the clue for the next idea.");

  // Better: binary search
  v.chapter('better', 'Better: binary search', {
    cx: 'O(n log n)',
    code: ['for i in 0..n-1:', '  need = t - a[i]', '  j = binarySearch(a, i+1, n-1, need)', '  if j != -1: return [i, j]'],
  });
  c = 0;
  a.clearTones().noPtr().ptr('i', 0).tone(0, 'active');
  v.counter('checks: 0').line(1).eq('need = 13 − 1 = 12');
  v.say('Better approach. Once we fix one number, we know exactly which partner we need: the target minus that number.');
  const bsearch = (i: number, need: number, foundSay: string, missSay: string) => {
    let lo = i + 1;
    let hi = A.length - 1;
    let first = true;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      c++;
      a.clearTones().tone(i, 'active');
      for (let x = 0; x < A.length; x++) if (x !== i && (x < lo || x > hi)) a.tone(x, 'out');
      a.ptrs({ lo, mid, hi }).tone(mid, A[mid] === need ? 'ok' : 'cmp');
      v.counter(`checks: ${c}`).line(2);
      if (A[mid] === need) {
        a.tone(i, 'ok');
        v.eq(`a[mid] = ${A[mid]} = ${need} ✓`, 'ok').say(foundSay);
        return mid;
      }
      v.eq(`a[mid] = ${A[mid]} ${A[mid] < need ? '<' : '>'} ${need} → search ${A[mid] < need ? 'right' : 'left'}`, 'bad');
      if (first && i === 0) v.say('The array is sorted, so instead of scanning for twelve, we binary search for it. Check the middle of the range.');
      else v.hold(900);
      first = false;
      if (A[mid] < need) lo = mid + 1;
      else hi = mid - 1;
    }
    a.noPtr('lo', 'mid', 'hi').clearTones().tone(i, 'active');
    v.eq(`${need} not found`, 'bad').say(missSay);
    return -1;
  };
  bsearch(0, 12, '', "Twelve isn't in the array. Move i to the next number.");
  a.noPtr('lo', 'mid', 'hi').ptr('i', 1).clearTones().tone(1, 'active');
  v.line(1).eq('need = 13 − 3 = 10').say('For three we need ten. Search again.');
  bsearch(1, 10, '', "Ten isn't there either.");
  a.noPtr('lo', 'mid', 'hi').ptr('i', 2).clearTones().tone(2, 'active');
  v.line(1).eq('need = 13 − 4 = 9').say('Now i is on four, so we need nine.');
  bsearch(2, 9, 'The middle of the range is nine. Found it.', '');
  const better = c;
  v.line(3).note('O(n log n) time · O(1) space').eq(`${better} checks for 7 numbers`, 'warn');
  v.say(`${words(better)} checks instead of ${words(brute)}. Each search costs log n, and we may run one for every number, so n log n in total. Better, but every search starts from scratch.`);

  // Optimal: two pointers
  v.chapter('optimal', 'Optimal: two pointers', {
    cx: 'O(n)',
    code: ['L, R = 0, n-1', 'while L < R:', '  s = a[L] + a[R]', '  if s == t: return [L, R]', '  if s > t:  R -= 1', '  else:      L += 1'],
  });
  c = 0;
  a.clearTones().noPtr().ptrs({ L: 0, R: A.length - 1 });
  v.counter('checks: 0').line(0).eq('').note('smallest + largest');
  v.say('Optimal approach: two pointers. Put L on the smallest number and R on the largest, and look at their sum.');
  let L = 0;
  let R = A.length - 1;
  const dim: number[] = [];
  let step = 0;
  while (L < R) {
    const s = A[L] + A[R];
    c++;
    a.clearTones().tone(dim, 'dim').tone([L, R], s === T ? 'ok' : 'cmp');
    v.counter(`checks: ${c}`).line(2).note('');
    if (s === T) {
      v.line(3).eq(`${A[L]} + ${A[R]} = 13 ✓`, 'ok').say(`${words(A[L])} plus ${words(A[R])} is thirteen. Found it, in just ${words(c)} checks.`);
      break;
    }
    const big = s > T;
    v.eq(`${A[L]} + ${A[R]} = ${s} ${big ? '> 13 → R moves left' : '< 13 → L moves right'}`, 'bad');
    if (step === 0) v.say('One plus fifteen is sixteen. Too big.');
    else v.say(`${words(A[L])} plus ${words(A[R])} is ${words(s)}. Too ${big ? 'big, so R moves left' : 'small, so L moves right'}.`);
    if (big) {
      dim.push(R);
      R--;
    } else {
      dim.push(L);
      L++;
    }
    a.clearTones().tone(dim, 'dim').ptrs({ L, R });
    v.line(big ? 4 : 5).eq(`${big ? A[R + 1] : A[L - 1]} ruled out`);
    if (step === 0) {
      v.note('one check removes one number');
      v.say('Why is that safe? Moving L right would only make the sum bigger. And fifteen can never be part of the answer: even paired with the smallest number it was too much. So we rule it out for good.');
    } else v.hold(700);
    step++;
  }
  a.clearTones().tone(dim, 'dim').tone([L, R], 'ok');
  v.note('O(n) time · O(1) space').eq(`${c} checks for 7 numbers`, 'ok');
  v.say('Each check rules out one number permanently, so the pointers meet after at most n steps. That is O of n time and O of one extra space.');
  v.answer([L + 1, R + 1]);

  recap(
    v,
    [
      { name: 'Brute force: every pair', time: 'O(n²)', space: 'O(1)' },
      { name: 'Better: binary search', time: 'O(n log n)', space: 'O(1)' },
      { name: 'Optimal: two pointers', time: 'O(n)', space: 'O(1)' },
    ],
    'Brute force was n squared. Binary search for the partner brought it to n log n. Two pointers, using the sorted order, got it to n.',
    ['Sorted array + looking for a pair → two pointers', 'Sum too big → move the right pointer left', 'Sum too small → move the left pointer right', 'LeetCode wants 1-based indices: return [L + 1, R + 1]'],
    "The signal to remember: a sorted array and you're looking for a pair. That's your cue for two pointers. And watch the detail: this problem wants one-based indices.",
  );
  return v.build();
}

const problem: Problem = {
  slug: 'two-sum-ii-input-array-is-sorted',
  statement:
    'You get an array `numbers` sorted in **non-decreasing** order and an integer `target`. Find two numbers at **different positions** that add up to `target` and return their positions as `[index1, index2]`, using **1-based** indexing with `index1 < index2`.\n\nThere is exactly one answer, and you must use only constant extra space.',
  examples: [
    { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]', why: '2 + 7 = 9, at positions 1 and 2.' },
    { input: 'numbers = [2,3,4], target = 6', output: '[1,3]', why: '2 + 4 = 6.' },
    { input: 'numbers = [-1,0], target = -1', output: '[1,2]' },
  ],
  constraints: ['2 ≤ numbers.length ≤ 3·10⁴', '-1000 ≤ numbers[i] ≤ 1000', 'numbers is sorted in non-decreasing order', 'Exactly one solution exists'],
  hints: [
    'Start with the obvious: check every pair. What does that cost?',
    'If you fix one number x, you know the partner you need: target − x. How do you look for a value in a sorted array quickly?',
    'Look at the smallest and the largest number together. If their sum is too big, can the largest number ever be part of the answer?',
  ],
  approaches: [
    {
      id: 'brute', kind: 'brute', name: 'Brute force: check every pair',
      idea: 'The most direct idea: try every pair `(i, j)` with `i < j` and return the first one whose sum equals the target.',
      steps: ['For every `i` from 0 to n−1', 'For every `j` from i+1 to n−1', 'If `numbers[i] + numbers[j] == target`, return `[i+1, j+1]`'],
      time: 'O(n²)', space: 'O(1)',
      bottleneck: 'For every `i` we scan all of the rest, and we completely ignore that the array is sorted.',
    },
    {
      id: 'better', kind: 'better', name: 'Better: binary search for the partner',
      idea: 'Fixing `numbers[i]` tells us exactly what we need: `target − numbers[i]`. The rest of the array is sorted, so we can **binary search** for that value instead of scanning.',
      steps: ['For every `i`, compute `need = target − numbers[i]`', 'Binary search for `need` in `numbers[i+1 .. n−1]`', 'If found at `j`, return `[i+1, j+1]`'],
      time: 'O(n log n)', space: 'O(1)',
      bottleneck: 'We still run a separate search for every `i`, and each search starts from scratch.',
    },
    {
      id: 'optimal', kind: 'optimal', name: 'Optimal: two pointers from both ends',
      idea: 'Put `L` at the smallest number and `R` at the largest. If the sum is too big, the largest number can’t be in the answer (even the smallest partner is too much), so move `R` left. If it’s too small, the smallest number can’t be in the answer, so move `L` right. Each step rules out one number.',
      steps: ['`L = 0`, `R = n − 1`', 'While `L < R`: compute `sum = numbers[L] + numbers[R]`', 'If `sum == target` return `[L+1, R+1]`', 'If `sum > target` move `R` left, otherwise move `L` right'],
      time: 'O(n)', space: 'O(1)',
    },
  ],
  pitfalls: [
    'Returning 0-based indices. This problem wants 1-based: `[L + 1, R + 1]`.',
    'Using a hash map like the original Two Sum. It works, but uses O(n) space, and the problem asks for constant space.',
    'Writing `while (L <= R)`: the two indices must be different, so stop when they meet.',
  ],
  takeaway: 'When the input is **sorted** and you need a **pair** with some sum, start two pointers at both ends. A bad sum tells you exactly which end to throw away.',
  video,
  videoArgs: [A, T],
  judge: {
    type: 'fn', fn: 'twoSum', params: ['int[]', 'int'], ret: 'int[]',
    tests: [
      { args: [[2, 7, 11, 15], 9], out: [1, 2] },
      { args: [[2, 3, 4], 6], out: [1, 3] },
      { args: [[-1, 0], -1], out: [1, 2] },
      { args: [[1, 3, 4, 6, 9, 11, 15], 13], out: [3, 5] },
      { args: [[0, 0, 3, 4], 0], out: [1, 2] },
      { args: [[-5, -3, 0, 2, 8, 9], 6], out: [2, 6] },
    ],
    gen: (r) => {
      for (;;) {
        const a = r.ints(r.int(2, 14), -30, 30).sort((x, y) => x - y);
        const i = r.int(0, a.length - 2);
        const j = r.int(i + 1, a.length - 1);
        const t = a[i] + a[j];
        let pairs = 0;
        for (let x = 0; x < a.length; x++) for (let y = x + 1; y < a.length; y++) if (a[x] + a[y] === t) pairs++;
        if (pairs === 1) return [a, t];
      }
    },
    ref: (a: number[], t: number) => {
      for (let x = 0; x < a.length; x++) for (let y = x + 1; y < a.length; y++) if (a[x] + a[y] === t) return [x + 1, y + 1];
      return [-1, -1];
    },
  },
};

export default problem;
