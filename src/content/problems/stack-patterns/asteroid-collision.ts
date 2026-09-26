import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [5, 10, -5, 8, -12, 3];
function collide(a: number[]) {
  const st: number[] = [];
  for (const x of a) {
    let alive = true;
    while (alive && x < 0 && st.length && st[st.length - 1] > 0) {
      const top = st[st.length - 1];
      if (top < -x) st.pop();
      else { if (top === -x) st.pop(); alive = false; }
    }
    if (alive) st.push(x);
  }
  return st;
}

function video() {
  const v = new Video('asteroid-collision', 'Asteroid Collision');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'size = |value|; sign = direction (+ right, − left)' });
  v.say('Asteroids move along a line at the same speed. Positive ones move right, negative ones move left. When two meet, the smaller one explodes; if they are equal, both explode. Asteroids moving in the same direction never meet. What is left at the end?');
  v.eq(`→ [${collide(A).join(', ')}]`);

  v.chapter('brute', 'Brute force: simulate collisions one at a time', { cx: 'O(n²)', code: ['repeat:', '  find adjacent pair (+, −); resolve it', 'until no such pair'] });
  v.eq('each pass resolves one collision', 'warn').say('Scanning for the first right-then-left pair and resolving it, again and again, is quadratic.');

  v.chapter('optimal', 'Optimal: stack of survivors', { cx: 'O(n)', code: ['for x in asteroids:', '  while x < 0 and stack.top > 0:', '    smaller explodes (both if equal); stop if x explodes', '  if x survived: push x'] });
  v.clear();
  const a = v.array('a', A, { label: 'incoming' });
  const st = v.stack('st', [], { label: 'survivors (left to right)' });
  const stack: number[] = [];
  let toldPop = false;
  let toldStop = false;
  const w = (x: number) => (x < 0 ? `minus ${words(-x)}` : words(x));
  v.say('Process asteroids from left to right, keeping the survivors on a stack. A new asteroid moving left can only hit survivors moving right, starting with the nearest one, the top of the stack. And it can destroy several in a row.');
  A.forEach((x, i) => {
    a.clearTones().tone(i, 'active');
    let alive = true;
    while (alive && x < 0 && stack.length && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -x) {
        stack.pop();
        st.pop();
        v.line(2).eq(`${x} hits ${top}: ${top} explodes`, 'bad');
        if (!toldPop) { v.say(`${w(x)} meets ${w(top)}, the nearest asteroid moving right. ${w(top)} is smaller, so it explodes, and ${w(x)} keeps going toward the next one on the stack.`); toldPop = true; }
        else v.hold(700);
      } else {
        if (top === -x) { stack.pop(); st.pop(); }
        alive = false;
        v.line(2).eq(top === -x ? `${x} hits ${top}: both explode` : `${x} hits ${top}: ${x} explodes`, 'bad');
        if (!toldStop) { v.say(top === -x ? `${w(x)} meets ${w(top)}, the same size. Both explode.` : `${w(x)} meets ${w(top)}, the nearest asteroid moving right. ${w(top)} is bigger, so ${w(x)} explodes.`); toldStop = true; }
        else v.hold(700);
      }
    }
    if (alive) { stack.push(x); st.push(x); v.line(3).eq(`${x} survives → push`).hold(500); }
  });
  a.clearTones();
  v.eq(`survivors [${stack.join(', ')}]`, 'ok').say('Each asteroid is pushed once and popped at most once, so the simulation is linear.');
  v.answer(collide(A));

  recap(v, [{ name: 'Resolve one collision per pass', time: 'O(n²)', space: 'O(n)' }, { name: 'Stack of survivors', time: 'O(n)', space: 'O(n)' }], 'Only a left-mover meeting right-movers on top of the stack collides.', ['Collisions that cascade backwards → stack with a while loop'], 'A while loop on the stack top handles chain reactions.');
  return v.build();
}

const problem: Problem = {
  slug: 'asteroid-collision',
  statement: 'We are given an array `asteroids` of integers representing asteroids in a row. The absolute value is its size and the sign its direction (positive = right, negative = left); all move at the same speed. When two asteroids meet, the smaller one explodes; if both are the same size, both explode. Two asteroids moving in the same direction never meet. Return the state after all collisions.',
  examples: [{ input: 'asteroids = [5,10,-5]', output: '[5,10]' }, { input: 'asteroids = [8,-8]', output: '[]' }, { input: 'asteroids = [10,2,-5]', output: '[10]' }],
  constraints: ['2 ≤ n ≤ 10⁴', 'asteroids[i] ≠ 0'],
  hints: ['A negative asteroid only collides with positive ones to its left.', 'It may destroy several in a row.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Resolve one collision per pass', idea: 'Find an adjacent (+, −) pair, resolve, repeat.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Rescans.' },
    { id: 'optimal', kind: 'optimal', name: 'Stack of survivors', idea: 'For each x: while x < 0 and top > 0, resolve; push x if it survives.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['A left-mover with a left-mover on top does not collide: push it.'],
  takeaway: 'Chain reactions → **while loop on the stack top**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'asteroidCollision', params: ['int[]'], ret: 'int[]',
    tests: [{ args: [[5, 10, -5]], out: [5, 10] }, { args: [[8, -8]], out: [] }, { args: [[10, 2, -5]], out: [10] }, { args: [[-2, -1, 1, 2]], out: [-2, -1, 1, 2] }],
    gen: (r: Rng) => [r.ints(r.int(2, 10), -6, 6).map((x) => (x === 0 ? 1 : x))],
    ref: (a: number[]) => collide(a),
  },
};

export default problem;
