import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const T = ['A', 'A', 'A', 'B', 'B', 'B', 'C', 'D'];
const N = 2;
function ls(tasks: string[], n: number) { const c = new Map<string, number>(); for (const t of tasks) c.set(t, (c.get(t) ?? 0) + 1); const mx = Math.max(...c.values()); const cm = [...c.values()].filter((x) => x === mx).length; return Math.max(tasks.length, (mx - 1) * (n + 1) + cm); }

function video() {
  const v = new Video('task-scheduler', 'Task Scheduler');
  v.chapter('intro', 'The problem');
  v.array('t', T, { label: `tasks, cooldown n = ${N}` });
  v.say(`Each task takes one time unit. Between two runs of the same task there must be at least ${words(N)} other units, which can be other tasks or idle time. What is the least total time to finish everything?`);
  v.eq(`answer: ${ls(T, N)}`);

  v.chapter('better', 'Simulation: always run the most frequent available task', { cx: 'O(time · log 26)', code: ['heap = remaining counts (max first)', 'each cycle of n + 1 slots:', '  run up to n + 1 different tasks with the largest counts', '  idle for the rest, unless all tasks are done'] });
  v.clear();
  const cnt = new Map<string, number>();
  for (const t of T) cnt.set(t, (cnt.get(t) ?? 0) + 1);
  const sched = v.array('s', [], { label: 'timeline' });
  const m = v.map('m', { label: 'remaining' });
  [...cnt.entries()].forEach(([k, c]) => m.put(k, c));
  v.say(`Greedy simulation: work in cycles of n plus one, that is ${words(N + 1)}, slots. In each cycle, run the tasks with the most remaining copies, each at most once. That keeps the big piles shrinking, and they are the ones that force idling. Fill leftover slots with idle, unless nothing is left.`);
  let time = 0;
  let cycle = 0;
  while ([...cnt.values()].some((c) => c > 0)) {
    const pick = [...cnt.entries()].filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, N + 1).map(([k]) => k);
    pick.forEach((k) => { cnt.set(k, cnt.get(k)! - 1); m.put(k, cnt.get(k)!).tone(k, 'active'); sched.push(k); time++; });
    const left = [...cnt.values()].some((c) => c > 0);
    let idle = 0;
    if (left) for (let s = pick.length; s < N + 1; s++) { sched.push('idle'); sched.tone(time, 'dim'); time++; idle++; }
    v.line(2, 3).counter(`time: ${time}`).eq(`cycle ${cycle + 1}: ${pick.join(' ')}${idle ? ` + ${idle} idle` : ''}`, idle ? 'warn' : undefined);
    if (cycle === 0) v.say(`First cycle: run ${pick.join(', ')}.`);
    else if (idle && cycle < 3) v.say(`Only ${words(pick.length)} kinds of task are left, so ${words(idle)} slot${idle > 1 ? 's go' : ' goes'} idle.`);
    else if (!left) v.say('In the last cycle, once everything is done, we stop: no trailing idle time.');
    else v.hold(900);
    m.clearTones();
    cycle++;
  }
  v.eq(`total = ${time}`, 'ok').say(`The simulation finishes at ${words(time)}. It is correct but it walks through every time unit.`);

  v.chapter('optimal', 'Optimal: count the frames of the most frequent task', { cx: 'O(n)', code: ['maxF = highest count; cntMax = tasks with that count', 'frames = (maxF − 1) × (n + 1) + cntMax', 'answer = max(len(tasks), frames)'] });
  v.clear();
  const c2 = new Map<string, number>();
  for (const t of T) c2.set(t, (c2.get(t) ?? 0) + 1);
  const maxF = Math.max(...c2.values());
  const cm = [...c2.values()].filter((x) => x === maxF).length;
  const rows = Array.from({ length: maxF }, (_, r) => Array.from({ length: N + 1 }, (_, c) => (r === maxF - 1 && c >= cm ? '' : '·')));
  const g = v.grid('g', rows, { label: `${maxF} rows (one per copy of A) × ${N + 1} columns` });
  v.say(`Only the most frequent task really matters. A appears ${words(maxF)} times. Put each copy at the start of a row of width n plus one. Between copies, the cooldown forces the rest of each row to exist, filled with other tasks or idle.`);
  let taskList = [...c2.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  let col = 0;
  for (const [k, c] of taskList) {
    if (c === maxF) { for (let r = 0; r < maxF; r++) g.set(r, col, k).tone(r, col, 'active'); col++; v.eq(`${k} fills column ${col}`).hold(700); }
  }
  const others: string[] = [];
  taskList.filter(([, c]) => c < maxF).forEach(([k, c]) => { for (let t = 0; t < c; t++) others.push(k); });
  let idx = 0;
  for (let cc = col; cc < N + 1 && idx < others.length; cc++) for (let r = 0; r < maxF - 1 && idx < others.length; r++) { g.set(r, cc, others[idx++]).tone(r, cc, 'ok'); }
  v.eq(`frames = (${maxF} − 1) × ${N + 1} + ${cm} = ${(maxF - 1) * (N + 1) + cm}`, 'ok').say(`Tasks with the maximum count, A and B, fill whole columns, including the last row. Everything else drops into the gaps. The length is ${words(maxF - 1)} full rows of ${words(N + 1)}, plus ${words(cm)} tasks in the last row: ${words((maxF - 1) * (N + 1) + cm)}.`);
  v.eq(`answer = max(${T.length}, ${(maxF - 1) * (N + 1) + cm}) = ${ls(T, N)}`, 'ok').say('If there are so many other tasks that the gaps overflow, there is no idle time at all and the answer is simply the number of tasks. So take the maximum of the two.');
  taskList = [];
  v.answer(ls(T, N));

  recap(v, [{ name: 'Greedy simulation with a heap', time: 'O(time · log 26)', space: 'O(26)' }, { name: 'Frame formula', time: 'O(n)', space: 'O(26)' }], 'max(tasks, (maxF − 1)(n + 1) + #tasks with maxF).', ['Cooldown scheduling → the most frequent item defines the frame'], 'Find the bottleneck item and count around it.');
  return v.build();
}

const problem: Problem = {
  slug: 'task-scheduler',
  statement: 'You are given an array of CPU `tasks` (letters A–Z) and a cooldown `n`. Each task takes one unit of time. Two runs of the same task must be separated by at least `n` units (other tasks or idle). Return the minimum number of units to finish all tasks.',
  examples: [{ input: 'tasks = ["A","A","A","B","B","B"], n = 2', output: '8', why: 'A B idle A B idle A B' }, { input: 'tasks = ["A","C","A","B","D","B"], n = 1', output: '6' }, { input: 'tasks = ["A","A","A","B","B","B"], n = 3', output: '10' }],
  constraints: ['1 ≤ tasks.length ≤ 10⁴', '0 ≤ n ≤ 100'],
  hints: ['The most frequent task decides the idle time.', 'Picture rows of width n + 1.'],
  approaches: [
    { id: 'better', kind: 'better', name: 'Greedy simulation', idea: 'In each cycle of n + 1 slots, run the tasks with the most remaining copies; idle if needed.', time: 'O(time · log 26)', space: 'O(26)', bottleneck: 'Walks every time unit.' },
    { id: 'optimal', kind: 'optimal', name: 'Frame formula', idea: 'max(len, (maxF − 1)(n + 1) + countMax).', time: 'O(n)', space: 'O(26)' },
  ],
  takeaway: 'The **most frequent task** defines the schedule.',
  video,
  videoArgs: [T, N],
  judge: {
    type: 'fn', fn: 'leastInterval', params: ['char[]', 'int'], ret: 'int',
    tests: [{ args: [['A', 'A', 'A', 'B', 'B', 'B'], 2], out: 8 }, { args: [['A', 'C', 'A', 'B', 'D', 'B'], 1], out: 6 }, { args: [['A', 'A', 'A', 'B', 'B', 'B'], 3], out: 10 }, { args: [T, N], out: 8 }],
    gen: (r: Rng) => [r.str(r.int(1, 14), 'AAABBCDE').split(''), r.int(0, 4)],
    ref: (t: string[], n: number) => ls(t, n),
  },
};

export default problem;
