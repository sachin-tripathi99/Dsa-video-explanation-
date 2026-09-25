import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

function video() {
  const v = new Video('queue-with-stacks', 'Implement Queue using Stacks');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'A FIFO queue built from LIFO stacks', lines: ['push(x) to the back · pop() from the front · peek() · empty()', 'Only stack operations allowed: push to top, pop from top, peek, size, empty', 'Goal: amortised O(1) per operation'] });
  v.say('Build a first-in first-out queue using only stacks, which are last-in first-out. The trick is that reversing a stack by pouring it into another one turns the oldest element into the top.');

  v.chapter('brute', 'Brute force: pour on every push', { cx: 'push O(n)', code: ['push(x): move all of s1 into s2; push x onto s1; move everything back', 'pop(): s1.pop()'] });
  v.eq('each push moves every element twice → O(n) per push', 'bad').say('One way keeps the oldest element on top at all times, by pouring everything out and back on each push. That makes every push O of n.');

  v.chapter('optimal', 'Optimal: an in-stack and an out-stack', { cx: 'amortised O(1)', code: ['push(x): inbox.push(x)', 'pop()/peek(): if outbox is empty:', '    pour all of inbox into outbox', '  return outbox.pop() / outbox.top()'] });
  v.clear().layout('row');
  const inb = v.stack('in', [], { label: 'inbox (new items)', ends: ['top', ''] });
  const outb = v.stack('out', [], { label: 'outbox (oldest on top)', ends: ['top', ''] });
  const ops: [string, number?][] = [['push', 1], ['push', 2], ['push', 3], ['pop'], ['push', 4], ['pop'], ['pop'], ['pop']];
  ops.forEach(([op, x], i) => {
    if (op === 'push') {
      inb.push(x!).clearTones().toneTop('active');
      outb.clearTones();
      v.line(0).eq(`push(${x}) → inbox`);
      if (i === 0) v.say('Two stacks: an inbox for new items and an outbox for items ready to leave. Push always goes on the inbox.');
      else v.hold(550);
    } else {
      if (!outb.size) {
        v.line(1).eq('outbox empty → pour the inbox over', 'warn');
        const moved: unknown[] = [];
        while (inb.size) moved.push(inb.pop());
        moved.forEach((m) => outb.push(m as number));
        outb.clearTones().toneTop('warn');
        if (i === 3) v.say('To pop, we need the oldest item, one, which is at the bottom of the inbox. Pour the whole inbox into the outbox. Now the order is reversed and one is on top.');
        else v.hold(800);
      }
      const val = outb.pop();
      outb.clearTones();
      v.line(3).eq(`pop() → ${val}`, 'ok');
      if (i === 3) v.say('Pop one from the outbox.');
      else if (i === 5) v.say('The next pop does not pour, because the outbox still has two ready. Four stays in the inbox until the outbox runs dry.');
      else v.hold(700);
    }
  });
  v.note('each item is moved at most once').say('Each item is pushed onto the inbox once, poured once, and popped once. So even though a single pour can be long, the total work is O of one per operation on average: amortised constant time.');
  recap(v, [{ name: 'Pour on every push', time: 'push O(n)', space: 'O(n)' }, { name: 'Inbox + outbox, pour when empty', time: 'amortised O(1)', space: 'O(n)' }], 'Pouring only when the outbox is empty moves each element once.', ['Reverse a stack by pouring it into another', 'Lazy work + "each item moved once" = amortised O(1)'], 'Doing expensive work lazily, only when needed, is a classic way to get amortised constant time.');
  return v.build();
}

const problem: Problem = {
  slug: 'implement-queue-using-stacks',
  statement: 'Implement a first-in first-out queue `MyQueue` using only two stacks, supporting `push(x)`, `pop()`, `peek()` and `empty()`. You may only use standard stack operations. `pop` and `peek` are only called on non-empty queues.',
  examples: [{ input: 'push(1), push(2), peek(), pop(), empty()', output: '1, 1, false' }],
  constraints: ['1 ≤ x ≤ 9', 'at most 100 calls'],
  hints: ['Pouring one stack into another reverses the order.', 'Do you need to pour every time?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Keep the oldest on top (pour on push)', idea: 'On push, move everything to the second stack, push x, move everything back. pop/peek are O(1).', time: 'push O(n), others O(1)', space: 'O(n)', bottleneck: 'Every push moves every element twice.' },
    { id: 'optimal', kind: 'optimal', name: 'Inbox / outbox', idea: 'Push onto `in`. For pop/peek, if `out` is empty, pour all of `in` into `out`; then use `out`’s top.', time: 'amortised O(1)', space: 'O(n)' },
  ],
  takeaway: '**Lazy transfer**: each element moves at most once, so operations are amortised O(1).',
  video,
  judge: {
    type: 'design', cls: 'MyQueue', ctor: [],
    methods: { push: { params: ['int'], ret: 'void' }, pop: { params: [], ret: 'int' }, peek: { params: [], ret: 'int' }, empty: { params: [], ret: 'boolean' } },
    tests: [{ ops: ['MyQueue', 'push', 'push', 'peek', 'pop', 'empty'], args: [[], [1], [2], [], [], []], out: [null, null, null, 1, 1, false] }],
    gen: (r) => {
      const ops = ['MyQueue'];
      const args: unknown[][] = [[]];
      let size = 0;
      for (let k = 0; k < 25; k++) {
        const op = size === 0 ? r.pick(['push', 'empty']) : r.pick(['push', 'push', 'pop', 'peek', 'empty']);
        ops.push(op);
        args.push(op === 'push' ? [r.int(1, 9)] : []);
        size += op === 'push' ? 1 : op === 'pop' ? -1 : 0;
      }
      return { ops, args };
    },
    ref: (ops, args) => { const q: number[] = []; return ops.map((op, i) => { if (op === 'MyQueue') return null; if (op === 'push') { q.push(args[i][0] as number); return null; } if (op === 'pop') return q.shift()!; if (op === 'peek') return q[0]; return q.length === 0; }); },
  },
};

export default problem;
