import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

function video() {
  const v = new Video('circular-queue', 'Design Circular Queue');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'A fixed-size ring buffer', lines: ['MyCircularQueue(k): capacity k', 'enQueue(x), deQueue() → true/false', 'Front(), Rear() → value or −1', 'isEmpty(), isFull()'] });
  v.say('Design a queue with a fixed capacity k, where the last position connects back to the first, like a ring. Operations report success or failure instead of throwing.');

  v.chapter('brute', 'Brute force: shift on every dequeue', { cx: 'deQueue O(k)', code: ['data = list', 'enQueue: append if size < k', 'deQueue: remove data[0] (shifts everything)'] });
  v.eq('removing from the front shifts all elements', 'bad').say('A plain list with removal at the front works, but each dequeue shifts every element: O of k.');

  v.chapter('optimal', 'Optimal: head index + size', { cx: 'O(1) all ops', code: ['enQueue: if full → false; a[(head + size) % k] = x; size++', 'deQueue: if empty → false; head = (head + 1) % k; size−−', 'Front: a[head] · Rear: a[(head + size − 1) % k]'] });
  v.clear();
  const k = 3;
  const ring = v.array('ring', Array(k).fill(null), { label: 'capacity k = 3' });
  const vv = v.vars('v', { head: 0, size: 0 });
  let head = 0;
  let size = 0;
  const ops: [string, number?][] = [['enQueue', 1], ['enQueue', 2], ['enQueue', 3], ['enQueue', 4], ['deQueue'], ['enQueue', 4], ['Rear']];
  ops.forEach(([op, x], i) => {
    if (op === 'enQueue') {
      if (size === k) {
        ring.clearTones().toneRange(0, k - 1, 'bad');
        v.line(0).eq(`enQueue(${x}) → full → false`, 'bad');
      } else {
        const pos = (head + size) % k;
        ring.set(pos, x!).clearTones().tone(pos, 'active');
        size++;
        v.line(0).eq(`enQueue(${x}) at index ${pos} → true`, 'ok');
      }
    } else if (op === 'deQueue') {
      ring.clearTones().tone(head, 'bad');
      ring.set(head, null);
      head = (head + 1) % k;
      size--;
      v.line(1).eq('deQueue() → true · head moves forward', 'ok');
    } else {
      const pos = (head + size - 1) % k;
      ring.clearTones().tone(pos, 'ok');
      v.line(2).eq(`Rear() → a[(head + size − 1) % k] = ${ring.get(pos)}`, 'ok');
    }
    ring.ptr('head', size ? head : null);
    vv.set({ head, size });
    if (i === 0) v.say('Keep a head index and a size. The next free slot is head plus size, modulo k.');
    else if (i === 3) v.say('The ring is full: enQueue returns false.');
    else if (i === 5) v.say('After a dequeue, head moves to index one, and the next enQueue wraps around into index zero.');
    else if (i === 6) v.say('Rear is the slot just before head plus size, again modulo k. Every operation is O of one.');
    else v.hold(600);
  });
  recap(v, [{ name: 'List with front removal', time: 'deQueue O(k)', space: 'O(k)' }, { name: 'Ring buffer (head + size)', time: 'O(1) all', space: 'O(k)' }], 'Modulo arithmetic lets a fixed array behave like a ring.', ['Fixed capacity queue → ring buffer', 'Track head and size (or head and tail)'], 'Head plus size modulo capacity is the whole ring buffer. Tracking size avoids the full-versus-empty ambiguity.');
  return v.build();
}

const problem: Problem = {
  slug: 'design-circular-queue',
  statement: 'Design `MyCircularQueue(k)`, a FIFO queue with fixed capacity `k` whose last position connects back to the first. Support `enQueue(value)` and `deQueue()` (return `true` on success), `Front()` and `Rear()` (return `-1` if empty), `isEmpty()` and `isFull()`.',
  examples: [{ input: 'k = 3: enQueue(1), enQueue(2), enQueue(3), enQueue(4), Rear(), isFull(), deQueue(), enQueue(4), Rear()', output: 'true, true, true, false, 3, true, true, true, 4' }],
  constraints: ['1 ≤ k ≤ 1000', '0 ≤ value ≤ 1000', 'at most 3000 calls'],
  hints: ['Use a fixed array and indices instead of shifting.', 'Store head and size; compute the tail with modulo.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'List with front removal', idea: 'Append on enQueue; remove index 0 on deQueue.', time: 'deQueue O(k), others O(1)', space: 'O(k)', bottleneck: 'Removing from the front shifts every element.' },
    { id: 'optimal', kind: 'optimal', name: 'Ring buffer', idea: 'Fixed array; `head` and `size`. Tail index = `(head + size) % k`.', time: 'O(1) per operation', space: 'O(k)' },
  ],
  pitfalls: ['Tracking only head and tail makes "full" and "empty" look the same; track size too.'],
  takeaway: 'A **ring buffer** = fixed array + head + size, with indices taken modulo the capacity.',
  video,
  judge: {
    type: 'design', cls: 'MyCircularQueue', ctor: ['int'],
    methods: { enQueue: { params: ['int'], ret: 'boolean' }, deQueue: { params: [], ret: 'boolean' }, Front: { params: [], ret: 'int' }, Rear: { params: [], ret: 'int' }, isEmpty: { params: [], ret: 'boolean' }, isFull: { params: [], ret: 'boolean' } },
    tests: [{ ops: ['MyCircularQueue', 'enQueue', 'enQueue', 'enQueue', 'enQueue', 'Rear', 'isFull', 'deQueue', 'enQueue', 'Rear'], args: [[3], [1], [2], [3], [4], [], [], [], [4], []], out: [null, true, true, true, false, 3, true, true, true, 4] }],
    gen: (r) => { const k = r.int(1, 4); const ops = ['MyCircularQueue']; const args: unknown[][] = [[k]]; for (let i = 0; i < 25; i++) { const op = r.pick(['enQueue', 'enQueue', 'deQueue', 'Front', 'Rear', 'isEmpty', 'isFull']); ops.push(op); args.push(op === 'enQueue' ? [r.int(0, 9)] : []); } return { ops, args }; },
    ref: (ops, args) => { const k = args[0][0] as number; const q: number[] = []; return ops.map((op, i) => { switch (op) { case 'MyCircularQueue': return null; case 'enQueue': if (q.length === k) return false; q.push(args[i][0] as number); return true; case 'deQueue': if (!q.length) return false; q.shift(); return true; case 'Front': return q.length ? q[0] : -1; case 'Rear': return q.length ? q[q.length - 1] : -1; case 'isEmpty': return q.length === 0; default: return q.length === k; } }); },
  },
};

export default problem;
