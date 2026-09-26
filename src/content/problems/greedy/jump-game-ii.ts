import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [2, 3, 1, 1, 4, 2, 1];
function jumps(a: number[]) { let j = 0, end = 0, far = 0; for (let i = 0; i < a.length - 1; i++) { far = Math.max(far, i + a[i]); if (i === end) { j++; end = far; } } return j; }

function video() {
  const v = new Video('jump-game-ii', 'Jump Game II');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums[i] = maximum jump length' });
  v.say('Same jumps as before, but now the last index is guaranteed reachable. What is the minimum number of jumps to get there?');
  v.eq(`answer: ${jumps(A)}`);

  v.chapter('brute', 'Brute force: DP over indices', { cx: 'O(n²)', code: ['dp[0] = 0', 'for i: for step in 1..nums[i]:', '  dp[i + step] = min(dp[i + step], dp[i] + 1)'] });
  v.eq('each index relaxes up to n others', 'warn').say('Let dp of j be the fewest jumps to reach index j. From every index, relax every index it can jump to. Correct, but quadratic.');

  v.chapter('insight', 'Think in levels, like BFS');
  v.clear();
  v.text('t', { title: 'Jumps as BFS levels', lines: ['Level 0: index 0', 'Level 1: every index reachable with one jump', 'Level 2: every index reachable from level 1 …', 'Each level is a contiguous range of indices'], shown: 4 });
  v.say('Group indices by how many jumps they need. Zero jumps: just index zero. One jump: every index index zero can reach. Two jumps: everything reachable from those. This is breadth-first search, and each level is a contiguous range, so we only need its right end.');

  v.chapter('optimal', 'Optimal: greedy BFS over ranges', { cx: 'O(n)', code: ['jumps = 0, end = 0, far = 0', 'for i in 0..n−2:', '  far = max(far, i + nums[i])', '  if i == end: jumps += 1; end = far'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  let j = 0, end = 0, far = 0, start = 0;
  let told = 0;
  v.say('Scan the current level, from its start to end, and track far: the furthest index reachable from anywhere in this level. When we finish the level, we must jump once more, and the next level ends at far.');
  for (let i = 0; i < A.length - 1; i++) {
    far = Math.max(far, i + A[i]);
    a.clearTones().noWin().win(start, end, 'win', `level ${j}`).tone(i, 'active');
    v.line(2).counter(`jumps: ${j} · far: ${far}`).eq(`i = ${i}: far = max(far, ${i + A[i]}) = ${far}`).hold(600);
    if (i === end) {
      j++;
      start = end + 1;
      end = far;
      a.noWin().win(start, Math.min(end, A.length - 1), 'ok', `level ${j}`);
      v.line(3).counter(`jumps: ${j} · far: ${far}`).eq(`end of level → jumps = ${j}, next level ends at ${end}`, 'ok');
      if (told === 0) { v.say(`Index zero is the whole of level zero. Its furthest reach is ${words(far)}, so one jump covers indices one through ${words(far)}.`); told++; }
      else if (told === 1) { v.say(`Level one is finished. The furthest reach from it is ${words(far)}. A second jump covers up to index ${words(Math.min(end, A.length - 1))}.`); told++; }
      else v.hold(700);
      if (end >= A.length - 1) break;
    }
  }
  a.clearTones().noWin().tone(A.length - 1, 'ok');
  v.eq(`minimum jumps = ${j}`, 'ok').say(`The last index is in level ${words(j)}, so the minimum is ${words(j)} jumps. One pass, constant space.`);
  v.answer(jumps(A));

  recap(v, [{ name: 'DP relax', time: 'O(n²)', space: 'O(n)' }, { name: 'Greedy BFS levels', time: 'O(n)', space: 'O(1)' }], 'Levels are ranges; the next range ends at the furthest reach of the current one.', ['Minimum jumps → BFS by ranges'], 'BFS without a queue: each level is a contiguous range.');
  return v.build();
}

const problem: Problem = {
  slug: 'jump-game-ii',
  statement: 'You are given an array `nums`; from index `i` you can jump to any index `i + j` with `0 < j ≤ nums[i]`. Return the minimum number of jumps to reach the last index. The last index is always reachable.',
  examples: [{ input: 'nums = [2,3,1,1,4]', output: '2' }, { input: 'nums = [2,3,0,1,4]', output: '2' }],
  constraints: ['1 ≤ n ≤ 10⁴', '0 ≤ nums[i] ≤ 1000', 'the last index is reachable'],
  hints: ['Group indices by the number of jumps needed.', 'Each group is a contiguous range.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DP relax', idea: 'dp[i + s] = min(dp[i + s], dp[i] + 1).', time: 'O(n²)', space: 'O(n)', bottleneck: 'Relaxing every jump.' },
    { id: 'optimal', kind: 'optimal', name: 'Greedy BFS levels', idea: 'Track the current level end and the furthest reach; jump when the level ends.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Loop to n − 2: reaching the last index needs no further jump.'],
  takeaway: '**BFS over ranges**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'jump', params: ['int[]'], ret: 'int',
    tests: [{ args: [[2, 3, 1, 1, 4]], out: 2 }, { args: [[2, 3, 0, 1, 4]], out: 2 }, { args: [[0]], out: 0 }, { args: [A], out: jumps(A) }],
    gen: (r: Rng) => { const n = r.int(1, 12); const a = r.ints(n, 1, 4); return [a]; },
    ref: (a: number[]) => jumps(a),
  },
};

export default problem;
