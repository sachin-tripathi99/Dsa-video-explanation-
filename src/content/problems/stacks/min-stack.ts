import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

function video() {
  const v = new Video('min-stack', 'Min Stack');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'A stack with getMin() in O(1)', lines: ['push(x), pop(), top(): normal stack operations', 'getMin(): the smallest value currently in the stack', 'Every operation must be O(1)'] });
  v.say('Design a stack that supports push, pop and top, plus getMin, which returns the smallest element currently in the stack. All four operations must run in constant time.');

  v.chapter('brute', 'Brute force: scan for the minimum', { cx: 'getMin O(n)', code: ['getMin(): return min(all values in the stack)'] });
  v.clear();
  const s0 = v.stack('s', [5, 3, 7], { label: 'stack', ends: ['top', ''] });
  s0.tone(1, 'ok');
  v.line(0).eq('getMin scans every element → O(n)', 'bad').say('A plain stack plus a scan for the minimum is correct, but getMin becomes O of n. And a single "current minimum" variable breaks as soon as you pop the minimum.');

  v.chapter('optimal', 'Optimal: remember the minimum at every level', { cx: 'O(1) all ops', code: ['push(x): push (x, min(x, current min))', 'pop(): pop', 'top(): top.value', 'getMin(): top.min'] });
  v.clear().layout('row');
  const st = v.stack('s', [], { label: 'stack of (value, min so far)', ends: ['top', ''] });
  const vv = v.vars('v', { getMin: '—' });
  const ops: [string, number?][] = [['push', 5], ['push', 3], ['push', 7], ['push', 2], ['getMin'], ['pop'], ['getMin']];
  const data: [number, number][] = [];
  ops.forEach(([op, x], i) => {
    if (op === 'push') {
      const m = data.length ? Math.min(x!, data[data.length - 1][1]) : x!;
      data.push([x!, m]);
      st.push(`${x}  (min ${m})`).clearTones().toneTop('active');
      v.line(0).eq(`push(${x}) → store min ${m}`);
      if (i === 0) v.say('The trick: with every value, also store the minimum of the stack at that moment. Push five: the minimum is five.');
      else if (i === 1) v.say('Push three: the new minimum is three, so store three alongside it.');
      else if (i === 2) v.say('Push seven: the minimum is still three.');
      else v.hold(700);
    } else if (op === 'pop') {
      data.pop();
      st.pop();
      st.clearTones();
      v.line(1).eq('pop() → the entry below still knows its own minimum', 'warn').say('Now pop. The entry underneath still remembers what the minimum was before the popped value arrived. Nothing needs recomputing.');
    } else {
      const m = data[data.length - 1][1];
      st.clearTones().toneTop('ok');
      vv.set({ getMin: m });
      v.line(3).eq(`getMin() → ${m}`, 'ok');
      if (i === 4) v.say('getMin just reads the top entry’s stored minimum: two.');
      else v.say('getMin is now three again, instantly.');
    }
  });
  v.note('O(1) per operation · O(n) space');
  recap(v, [{ name: 'Scan on getMin', time: 'getMin O(n)', space: 'O(n)' }, { name: 'Store min with each entry', time: 'all O(1)', space: 'O(n)' }], 'Storing a little extra state per entry makes every query instant.', ['Need an aggregate (min/max) of a stack → store it per level', 'Popping restores the previous aggregate automatically'], 'When a structure changes by push and pop, store the answer at every level; popping then restores the previous answer for free.');
  return v.build();
}

type Op = { ops: string[]; args: unknown[][] };
const ref = (ops: string[], args: unknown[][]) => {
  const st: number[] = [];
  return ops.map((op, i) => {
    if (op === 'MinStack') return null;
    if (op === 'push') { st.push(args[i][0] as number); return null; }
    if (op === 'pop') { st.pop(); return null; }
    if (op === 'top') return st[st.length - 1];
    return Math.min(...st);
  });
};

const problem: Problem = {
  slug: 'min-stack',
  statement: 'Design a stack that supports `push(val)`, `pop()`, `top()` and `getMin()` (the minimum element in the stack), each in **O(1)** time. `pop`, `top` and `getMin` are only called on non-empty stacks.',
  examples: [{ input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', output: '-3, 0, -2' }],
  constraints: ['-2³¹ ≤ val ≤ 2³¹ − 1', 'up to 3 · 10⁴ calls'],
  hints: ['A single min variable breaks when you pop the minimum.', 'What if every entry remembered the minimum at the time it was pushed?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan for the minimum', idea: 'A normal stack; `getMin` scans all elements.', time: 'push/pop/top O(1), getMin O(n)', space: 'O(n)', bottleneck: 'getMin is linear.' },
    { id: 'optimal', kind: 'optimal', name: 'Store (value, current min) pairs', idea: 'Each push stores `min(val, previous min)` with the value. `getMin` reads the top pair; `pop` restores the previous minimum automatically.', time: 'O(1) per operation', space: 'O(n)' },
  ],
  pitfalls: ['Tracking only one global minimum: popping it loses the next minimum.'],
  takeaway: 'Store the **aggregate at every level** of a stack so pops restore it for free.',
  video,
  judge: {
    type: 'design', cls: 'MinStack', ctor: [],
    methods: { push: { params: ['int'], ret: 'void' }, pop: { params: [], ret: 'void' }, top: { params: [], ret: 'int' }, getMin: { params: [], ret: 'int' } },
    tests: [{ ops: ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], args: [[], [-2], [0], [-3], [], [], [], []], out: [null, null, null, null, -3, null, 0, -2] }],
    gen: (r): Op => {
      const ops = ['MinStack'];
      const args: unknown[][] = [[]];
      let size = 0;
      for (let k = 0; k < 25; k++) {
        const op = size === 0 ? 'push' : r.pick(['push', 'push', 'pop', 'top', 'getMin']);
        ops.push(op);
        args.push(op === 'push' ? [r.int(-20, 20)] : []);
        size += op === 'push' ? 1 : op === 'pop' ? -1 : 0;
      }
      return { ops, args };
    },
    ref,
  },
};

export default problem;
