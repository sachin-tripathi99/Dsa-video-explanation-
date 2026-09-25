import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

function video() {
  const v = new Video('stack-with-queues', 'Implement Stack using Queues');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'A LIFO stack from FIFO queues', lines: ['push(x), pop(), top(), empty()', 'Only queue operations: push to back, pop from front, peek front, size, empty'] });
  v.say('The mirror image of the last design problem: build a stack using only queue operations.');

  v.chapter('brute', 'Two queues: move n − 1 items on pop', { cx: 'pop O(n)', code: ['push(x): q1.push(x)', 'pop(): move all but the last from q1 to q2', '       pop the last; swap q1 and q2'] });
  v.eq('each pop moves n − 1 items').say('With two queues, push is easy: add to the back. To pop the newest, move everything except the last element into the second queue, take the last one, and swap the queues. Pop is O of n.');

  v.chapter('optimal', 'One queue: rotate after each push', { cx: 'push O(n), pop O(1)', code: ['push(x): q.push(x)', '  repeat size − 1 times: q.push(q.pop())', 'pop(): q.pop()   (the front is the newest)'] });
  v.clear();
  const q = v.queue('q', [], { label: 'one queue: front = top of the stack', ends: ['top', 'bottom'] });
  [1, 2, 3].forEach((x, i) => {
    q.push(x).clearTones().tone(q.size - 1, 'active');
    v.line(0).eq(`push(${x}) at the back`).hold(500);
    for (let k = 0; k < q.size - 1; k++) {
      const f = q.shift();
      q.push(f as number).clearTones().tone(q.size - 1, 'warn');
      v.line(1).eq(`rotate: move ${f} from front to back`).hold(450);
    }
    q.clearTones().tone(0, 'ok');
    v.eq(`${x} is now at the front`, 'ok');
    if (i === 0) v.say('With a single queue, rotate after every push: move all the older items behind the new one. Then the newest item is always at the front.');
    else if (i === 1) v.say('Push two, then rotate one past it. Two is at the front.');
    else v.hold(600);
  });
  q.clearTones().tone(0, 'ok');
  v.line(2).eq('pop() → 3 (front)', 'ok').say('Now pop and top just use the front: O of one. Push costs O of n instead. Either way, one side pays, because a queue can not reverse its order for free.');
  recap(v, [{ name: 'Two queues, pay on pop', time: 'push O(1), pop O(n)', space: 'O(n)' }, { name: 'One queue, pay on push', time: 'push O(n), pop O(1)', space: 'O(n)' }], 'Rotating keeps the newest element at the front.', ['Choose which operation pays the O(n) cost', 'Rotation: repeatedly move front to back'], 'When a structure cannot do something for free, decide which operation pays, based on which is called more.');
  return v.build();
}

const problem: Problem = {
  slug: 'implement-stack-using-queues',
  statement: 'Implement a last-in first-out stack `MyStack` using only queue operations (push to back, peek/pop from front, size, is empty), supporting `push(x)`, `pop()`, `top()` and `empty()`.',
  examples: [{ input: 'push(1), push(2), top(), pop(), empty()', output: '2, 2, false' }],
  constraints: ['1 ≤ x ≤ 9', 'at most 100 calls', 'pop/top only on non-empty stacks'],
  hints: ['Which end of a queue can you remove from?', 'Can you rearrange the queue so the newest element is at the front?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Two queues, costly pop', idea: 'Push to q1. To pop, move all but the last element to q2, remove the last, swap the queues.', time: 'push O(1), pop/top O(n)', space: 'O(n)', bottleneck: 'Every pop and top moves n − 1 elements.' },
    { id: 'optimal', kind: 'optimal', name: 'One queue, rotate on push', idea: 'After pushing x, rotate the queue size − 1 times so x is at the front. pop/top use the front.', time: 'push O(n), pop/top O(1)', space: 'O(n)' },
  ],
  takeaway: 'Decide **which operation pays** the O(n) cost; rotation keeps the newest at the front.',
  video,
  judge: {
    type: 'design', cls: 'MyStack', ctor: [],
    methods: { push: { params: ['int'], ret: 'void' }, pop: { params: [], ret: 'int' }, top: { params: [], ret: 'int' }, empty: { params: [], ret: 'boolean' } },
    tests: [{ ops: ['MyStack', 'push', 'push', 'top', 'pop', 'empty'], args: [[], [1], [2], [], [], []], out: [null, null, null, 2, 2, false] }],
    gen: (r) => { const ops = ['MyStack']; const args: unknown[][] = [[]]; let size = 0; for (let k = 0; k < 25; k++) { const op = size === 0 ? r.pick(['push', 'empty']) : r.pick(['push', 'push', 'pop', 'top', 'empty']); ops.push(op); args.push(op === 'push' ? [r.int(1, 9)] : []); size += op === 'push' ? 1 : op === 'pop' ? -1 : 0; } return { ops, args }; },
    ref: (ops, args) => { const s: number[] = []; return ops.map((op, i) => { if (op === 'MyStack') return null; if (op === 'push') { s.push(args[i][0] as number); return null; } if (op === 'pop') return s.pop()!; if (op === 'top') return s[s.length - 1]; return s.length === 0; }); },
  },
};

export default problem;
