import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const P = [5, 4, 9];
const K = 2;

function video() {
  const v = new Video('remove-stones', 'Remove Stones to Minimize the Total');
  v.chapter('intro', 'The problem');
  v.array('p', P, { label: `piles · k = ${K} operations`, bars: true });
  v.say('You may do k operations. Each operation picks a pile and removes half of it, rounded down. Minimise the total stones left.');

  v.chapter('brute', 'Brute force: scan for the biggest each time', { cx: 'O(k · n)', code: ['repeat k times:', '  i = index of the largest pile (scan)', '  piles[i] −= piles[i] / 2'] });
  v.eq('greedy choice is right, but each scan is O(n)').say('Removing half of the biggest pile always removes the most stones, so that is the greedy choice. Finding the biggest pile by scanning costs O of n each time.');

  v.chapter('optimal', 'Optimal: a max-heap', { cx: 'O(n + k log n)', code: ['heap = max-heap of piles', 'repeat k times: x = pop(); push(x − x / 2)', 'return sum(heap)'] });
  v.clear();
  const h = v.heap('h', { label: 'max-heap of piles', min: false });
  P.forEach((x) => h.push(x));
  for (let i = 0; i < K; i++) {
    const x = h.pop() as number;
    const y = x - Math.floor(x / 2);
    h.push(y);
    h.clearTones().tone(h.values.indexOf(y), 'warn');
    v.line(1).eq(`take ${x}, remove ${Math.floor(x / 2)} → ${y}`);
    if (i === 0) v.say('Pop the biggest pile, nine. Remove four, and push back five.');
    else v.hold(900);
  }
  const total = (h.values as number[]).reduce((a, b) => a + b, 0);
  h.clearTones();
  v.line(2).eq(`total = ${total}`, 'ok').say(`After k operations the total is ${total}. Each operation is O of log n.`);
  v.answer(total);
  recap(v, [{ name: 'Scan for the max each time', time: 'O(k · n)', space: 'O(1)' }, { name: 'Max-heap', time: 'O(n + k log n)', space: 'O(n)' }], 'The greedy rule needs the current maximum repeatedly: a max-heap.', ['Greedy on the current largest → max-heap'], 'Greedy plus a heap is a very common pairing: the greedy rule says what to pick, the heap finds it fast.');
  return v.build();
}

const problem: Problem = {
  slug: 'remove-stones-to-minimize-the-total',
  statement: 'Given `piles[i]` stones and an integer `k`, apply exactly `k` operations: choose any pile and remove `floor(piles[i] / 2)` stones from it (the same pile may be chosen again). Return the minimum possible total number of stones left.',
  examples: [{ input: 'piles = [5,4,9], k = 2', output: '12' }, { input: 'piles = [4,3,6,7], k = 3', output: '12' }],
  constraints: ['1 ≤ piles.length ≤ 10⁵', '1 ≤ piles[i] ≤ 10⁴', '1 ≤ k ≤ 10⁵'],
  hints: ['Which pile gives the biggest reduction?', 'How do you find it quickly every time?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan for the largest', idea: 'k times: find the largest pile by scanning, halve it.', time: 'O(k · n)', space: 'O(1)', bottleneck: 'Linear scan per operation.' },
    { id: 'optimal', kind: 'optimal', name: 'Max-heap', idea: 'k times: pop the largest x, push `x − x / 2`. Sum what is left.', time: 'O(n + k log n)', space: 'O(n)' },
  ],
  takeaway: '**Greedy** says pick the largest; a **max-heap** finds it in O(log n).',
  video,
  videoArgs: [P, K],
  judge: {
    type: 'fn', fn: 'minStoneSum', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[5, 4, 9], 2], out: 12 }, { args: [[4, 3, 6, 7], 3], out: 12 }],
    gen: (r) => [r.ints(r.int(1, 10), 1, 50), r.int(1, 12)],
    ref: (p: number[], k: number) => { const a = [...p]; for (let i = 0; i < k; i++) { let m = 0; for (let j = 1; j < a.length; j++) if (a[j] > a[m]) m = j; a[m] -= Math.floor(a[m] / 2); } return a.reduce((x, y) => x + y, 0); },
  },
};

export default problem;
