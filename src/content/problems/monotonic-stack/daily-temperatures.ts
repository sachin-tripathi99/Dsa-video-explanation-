import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const T = [73, 74, 75, 71, 69, 72, 76, 73];
function wait(t: number[]) { const ans = t.map(() => 0); const st: number[] = []; t.forEach((x, i) => { while (st.length && t[st[st.length - 1]] < x) { const j = st.pop()!; ans[j] = i - j; } st.push(i); }); return ans; }

function video() {
  const v = new Video('daily-temperatures', 'Daily Temperatures');
  v.chapter('intro', 'The problem');
  v.array('t', T, { label: 'daily temperatures', bars: true });
  v.say('For each day, how many days must you wait for a warmer temperature? If no warmer day comes, the answer is zero.');
  v.eq(`answer: [${wait(T).join(', ')}]`);

  v.chapter('brute', 'Brute force: look ahead from each day', { cx: 'O(n²)', code: ['for i: for j > i: if t[j] > t[i]: ans[i] = j − i; break'] });
  v.eq('a long cold spell makes every day scan far ahead', 'warn').say('Scanning ahead from every day is quadratic when warm days are rare.');

  v.chapter('optimal', 'Optimal: stack of days still waiting', { cx: 'O(n)', code: ['for i, x in temps:', '  while stack and t[stack.top] < x:', '    j = stack.pop(); ans[j] = i − j', '  stack.push(i)'] });
  v.clear();
  const a = v.array('t', T, { label: 'temperatures', bars: true });
  const out = v.array('ans', T.map(() => 0), { label: 'days to wait' });
  const st = v.stack('st', [], { label: 'waiting days (index:temp)' });
  const stack: number[] = [];
  let told = 0;
  v.say('Keep a stack of days that have not yet seen a warmer day, as indices. A warmer day resolves every cooler day on top of the stack, and the wait is the difference of indices.');
  T.forEach((x, i) => {
    a.clearTones().tone(i, 'active');
    let popped = 0;
    while (stack.length && T[stack[stack.length - 1]] < x) {
      const j = stack.pop()!;
      st.pop();
      out.set(j, i - j).tone(j, 'ok');
      a.tone(j, 'ok');
      popped++;
      v.line(2).eq(`day ${i} (${x}°) is warmer than day ${j} (${T[j]}°) → wait ${i - j}`, 'ok');
      if (told === 0) { v.say(`Day one is warmer than day zero, so day zero waits one day.`); told++; }
      else if (told === 1 && popped === 2) { v.say(`Day ${words(i)}, ${words(x)} degrees, resolves several waiting days at once: each gets its own distance.`); told++; }
      else v.hold(550);
    }
    stack.push(i);
    st.push(`${i}:${x}`);
    v.line(3).hold(400);
  });
  a.clearTones();
  v.eq('days left on the stack keep 0', 'ok').say('Days still waiting at the end never see a warmer day, so they keep zero. Each index is pushed and popped once.');
  v.answer(wait(T));

  recap(v, [{ name: 'Look ahead from each day', time: 'O(n²)', space: 'O(1)' }, { name: 'Monotonic stack of indices', time: 'O(n)', space: 'O(n)' }], 'Store indices: the answer is a distance.', ['“How long until a bigger value?” → next greater with indices'], 'Storing indices instead of values turns “next greater” into “how far to the next greater”.');
  return v.build();
}

const problem: Problem = {
  slug: 'daily-temperatures',
  statement: 'Given an array of integers `temperatures`, return an array `answer` such that `answer[i]` is the number of days you have to wait after the i-th day to get a warmer temperature. If there is no future warmer day, `answer[i] = 0`.',
  examples: [{ input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' }, { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]' }],
  constraints: ['1 ≤ n ≤ 10⁵', '30 ≤ temperatures[i] ≤ 100'],
  hints: ['Next greater element, but you need a distance.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Look ahead from each day', idea: 'For each i, scan j > i for the first warmer day.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Long scans.' },
    { id: 'optimal', kind: 'optimal', name: 'Monotonic stack of indices', idea: 'Pop cooler days when a warmer day arrives; answer = i − j.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Next greater **with indices** gives distances.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'dailyTemperatures', params: ['int[]'], ret: 'int[]',
    tests: [{ args: [[73, 74, 75, 71, 69, 72, 76, 73]], out: [1, 1, 4, 2, 1, 1, 0, 0] }, { args: [[30, 40, 50, 60]], out: [1, 1, 1, 0] }, { args: [[30, 60, 90]], out: [1, 1, 0] }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), 30, 40)],
    ref: (t: number[]) => wait(t),
  },
};

export default problem;
