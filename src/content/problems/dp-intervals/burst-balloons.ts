import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { intervalViz, intervalTable } from '../../intervalviz';

const A = [3, 1, 5, 8];
function coins(a: number[]) { const p = [1, ...a, 1]; return intervalTable(p.length, (i, k, j) => p[i] * p[k] * p[j], 'max').d[0][p.length - 1]; }

function video() {
  const v = new Video('burst-balloons', 'Burst Balloons');
  const Pd = [1, ...A, 1];
  const m = Pd.length;
  const T = intervalTable(m, (i, k, j) => Pd[i] * Pd[k] * Pd[j], 'max');
  v.chapter('intro', 'The problem');
  v.array('b', A, { label: 'balloons' });
  v.say('Burst every balloon. Bursting balloon i earns its number times the numbers of its current left and right neighbours; past the ends, count a one. After a burst, its neighbours become adjacent. Maximise the total.');
  v.eq(`answer: ${coins(A)}`);
  v.say('The order is everything. And thinking about which balloon bursts first is a trap: once it is gone, its two sides touch and are no longer independent problems.');

  v.chapter('brute', 'Brute force: try every burst order', { cx: 'O(n!)', code: ['for each remaining balloon: burst it, recurse on the rest'] });
  v.eq(`${A.length}! = ${[1, 2, 3, 4].slice(0, A.length).reduce((x, y) => x * y, 1)} orders here`, 'bad').say('Trying every order is n factorial.');

  v.chapter('insight', 'Choose the balloon that bursts LAST');
  v.clear();
  v.array('p', Pd, { label: 'padded with 1 at both ends' });
  v.say('Pad the row with a one on each side. Now consider an open interval between two boundaries i and j, and ask which balloon inside it bursts last. When it finally bursts, everything else in the interval is gone, so its neighbours are exactly i and j: it earns p i times p k times p j. And before that, the left part and the right part were burst independently, because balloon k stood between them the whole time.');

  v.chapter('better', 'Better: memoise best(i, j)', { cx: 'O(n³)', code: ['best(i, j) = max over i < k < j of best(i, k) + best(k, j) + p[i]·p[k]·p[j]'] });
  v.eq('n² intervals × n choices', 'warn').say('That recursion has only n squared intervals. Memoised, n cubed.');

  v.chapter('optimal', 'Optimal: interval table by length', { cx: 'O(n³) time, O(n²) space', code: ['p = [1] + nums + [1]', 'dp[i][j] = max over i < k < j of', '  dp[i][k] + dp[k][j] + p[i]·p[k]·p[j]', 'answer = dp[0][n+1]'] });
  v.clear();
  const g = v.grid('dp', Pd.map((_, i) => Pd.map((__, j) => (j <= i + 1 ? (j < i ? '·' : 0) : ''))), { label: 'dp[i][j] = best coins bursting everything strictly between i and j' });
  g.heads(Pd.map((x, i) => `${i}:${x}`), Pd.map((x, j) => `${j}:${x}`));
  v.line(0).say('Fill intervals from narrow to wide. An interval with nothing inside earns zero.');
  intervalViz(v, g, m, (i, k, j) => Pd[i] * Pd[k] * Pd[j], 'max', {
    line: [1, 2],
    eq: (i, j, k, val) => `last = ${Pd[k]} (idx ${k}): ${Pd[i]}·${Pd[k]}·${Pd[j]} + ${T.d[i][k]} + ${T.d[k][j]} = ${val}`,
    say: (i, j, k) => (i === 0 && j === 2 ? 'One balloon, three, between the padding ones: one times three times one.' : i === 0 && j === m - 1 ? `For the whole row, the best balloon to burst last is the ${words(Pd[k])}: it multiplies by the two padding ones, after the rest earn ${words(T.d[i][k] + T.d[k][j])}.` : undefined),
    hold: 380,
  });
  g.tone(0, m - 1, 'ok');
  v.line(3).eq(`dp[0][${m - 1}] = ${T.d[0][m - 1]}`, 'ok').say(`The maximum is ${words(T.d[0][m - 1])}.`);
  v.answer(coins(A));

  recap(v, [{ name: 'All orders', time: 'O(n!)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n³)', space: 'O(n²)' }, { name: 'Interval table', time: 'O(n³)', space: 'O(n²)' }], 'Pick the LAST balloon in each interval.', ['Operations whose cost depends on neighbours → interval DP on the last operation'], 'Pad with 1s so the ends behave like neighbours.');
  return v.build();
}

const problem: Problem = {
  slug: 'burst-balloons',
  statement: 'You are given `n` balloons with numbers `nums`. Bursting balloon i earns nums[i − 1] · nums[i] · nums[i + 1] coins (out-of-range neighbours count as 1); then its neighbours become adjacent. Return the maximum coins from bursting all balloons.',
  examples: [{ input: 'nums = [3,1,5,8]', output: '167' }, { input: 'nums = [1,5]', output: '10' }],
  constraints: ['1 ≤ n ≤ 300', '0 ≤ nums[i] ≤ 100'],
  hints: ['Think about which balloon bursts last.', 'Pad with 1 on both sides.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion (last burst)', idea: 'Try every last balloon of each interval, uncached.', time: 'exponential', space: 'O(n)', bottleneck: 'Recomputes intervals.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache best(i, j).', time: 'O(n³)', space: 'O(n²)', bottleneck: 'Recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Interval table', idea: 'Fill dp[i][j] by width.', time: 'O(n³)', space: 'O(n²)' },
  ],
  takeaway: 'Choose the **last** balloon.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'maxCoins', params: ['int[]'], ret: 'int',
    tests: [{ args: [A], out: 167 }, { args: [[1, 5]], out: 10 }, { args: [[7]], out: 7 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 8) }, () => r.int(0, 9))],
    ref: (a: number[]) => coins(a),
  },
};

export default problem;
