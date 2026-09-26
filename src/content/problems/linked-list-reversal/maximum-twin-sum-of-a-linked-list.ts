import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { animateReverse } from '../../listviz';

const L = [4, 2, 2, 3, 1, 5];
const twin = (a: number[]) => { let b = 0; for (let i = 0; i < a.length / 2; i++) b = Math.max(b, a[i] + a[a.length - 1 - i]); return b; };

function video() {
  const v = new Video('max-twin-sum', 'Maximum Twin Sum of a Linked List');
  const n = L.length;
  v.chapter('intro', 'The problem');
  v.list('l', L, { label: `even length n = ${n}` });
  v.say('In a list of even length, node i and node n minus one minus i are twins: the first and last, the second and second to last, and so on. Return the largest twin sum.');
  v.eq(L.slice(0, n / 2).map((x, i) => `${x}+${L[n - 1 - i]}=${x + L[n - 1 - i]}`).join('  ·  ') + `  → ${twin(L)}`);

  v.chapter('brute', 'Brute force: values into an array', { cx: 'O(n) · O(n)', code: ['vals = list values', 'max of vals[i] + vals[n − 1 − i]'] });
  v.eq('easy with an array, O(n) memory', 'warn').say('With an array, twins are easy to pair from both ends. It costs a copy of the list.');

  v.chapter('optimal', 'Optimal: reverse the second half, walk both halves', { cx: 'O(n) · O(1)', code: ['slow/fast → second half start', 'reverse the second half', 'walk both halves: best = max(best, a + b)'] });
  v.clear();
  const l = v.list('l', L, { label: 'head' });
  const ids = l.ids();
  l.ptr('slow', ids[n / 2]).tone(ids[n / 2], 'active');
  v.line(0).eq(`second half starts at ${L[n / 2]}`).say('Fast and slow pointers find the start of the second half.');
  l.noPtr('slow');
  l.setNext(ids[n / 2 - 1], null);
  animateReverse(v, l, ids.slice(n / 2), { line: [1], perStep: 500, firstSay: 'Reverse the second half, so its first node is the last node of the list, the twin of the head.' });
  for (let i = n / 2; i < n; i++) l.row(ids[i], 1);
  let best = 0;
  for (let i = 0; i < n / 2; i++) {
    const s = L[i] + L[n - 1 - i];
    best = Math.max(best, s);
    l.clearTones().tone(ids[i], 'ok').tone(ids[n - 1 - i], 'ok');
    v.line(2).counter(`best: ${best}`).eq(`${L[i]} + ${L[n - 1 - i]} = ${s}`).hold(700);
  }
  l.clearTones();
  v.eq(`maximum twin sum = ${best}`, 'ok').say(`Walking the two halves side by side pairs every twin. The largest sum is ${words(best)}.`);
  v.answer(twin(L));

  recap(v, [{ name: 'Array of values', time: 'O(n)', space: 'O(n)' }, { name: 'Reverse second half', time: 'O(n)', space: 'O(1)' }], 'Twins line up once the back half is reversed.', ['Pair i with n − 1 − i in a list → middle + reverse'], 'The same middle-and-reverse trick as the palindrome check.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-twin-sum-of-a-linked-list',
  statement: 'In a linked list of even size `n`, the i-th node (0-indexed) is the twin of the `(n − 1 − i)`-th node for `0 ≤ i ≤ n/2 − 1`. The twin sum is the sum of a node and its twin. Return the maximum twin sum.',
  examples: [{ input: 'head = [5,4,2,1]', output: '6' }, { input: 'head = [4,2,2,3]', output: '7' }, { input: 'head = [1,100000]', output: '100001' }],
  constraints: ['n is even, 2 ≤ n ≤ 10⁵', '1 ≤ val ≤ 10⁵'],
  hints: ['Reverse the second half.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Array of values', idea: 'Copy values; max of a[i] + a[n−1−i].', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra array.' },
    { id: 'optimal', kind: 'optimal', name: 'Reverse the second half', idea: 'Find the middle, reverse the second half, walk both halves together.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Twins line up after **reversing the second half**.',
  video,
  videoArgs: [L],
  judge: {
    type: 'fn', fn: 'pairSum', params: ['ListNode'], ret: 'int',
    tests: [{ args: [[5, 4, 2, 1]], out: 6 }, { args: [[4, 2, 2, 3]], out: 7 }, { args: [[1, 100000]], out: 100001 }],
    gen: (r: Rng) => [r.ints(2 * r.int(1, 5), 1, 20)],
    ref: (a: number[]) => twin(a),
  },
};

export default problem;
