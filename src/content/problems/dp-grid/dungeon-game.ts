import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const D = [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]];
function tbl(d: number[][]) { const R = d.length, C = d[0].length; const need = d.map((r) => r.map(() => 0)); for (let r = R - 1; r >= 0; r--) for (let c = C - 1; c >= 0; c--) { const nxt = r === R - 1 && c === C - 1 ? 1 : Math.min(r < R - 1 ? need[r + 1][c] : Infinity, c < C - 1 ? need[r][c + 1] : Infinity); need[r][c] = Math.max(1, nxt - d[r][c]); } return need; }
function minHp(d: number[][]) { return tbl(d)[0][0]; }

function video() {
  const v = new Video('dungeon-game', 'Dungeon Game');
  const R = D.length, C = D[0].length;
  const need = tbl(D);
  v.chapter('intro', 'The problem');
  v.grid('g', D, { label: 'rooms: negative = demon (lose HP), positive = potion' });
  v.say('A knight starts in the top-left room and must reach the princess in the bottom-right, moving only right or down. Each room changes his health, and if it ever drops to zero he dies. What is the minimum starting health that lets him make it?');
  v.eq(`answer: ${minHp(D)}`);

  v.chapter('brute', 'Brute force: try every path', { cx: 'O(2^(m+n))', code: ['need(r, c) = min start health at (r, c) to survive the rest', '  = max(1, min(need(down), need(right)) − room[r][c])'] });
  v.eq('exponentially many paths', 'bad').say('Trying every path and, for each, the health it requires, is exponential.');

  v.chapter('why', 'Why forward DP does not work');
  v.clear();
  v.text('t', { title: 'Two numbers pull in different directions', lines: ['Going forward, a path has a current health AND a lowest point so far', 'A path with more health now may have dipped lower earlier', 'Neither dominates, so one number per cell is not enough', 'Backwards, one number suffices: “health needed from here on”'], shown: 4 });
  v.say('Going forward, each path carries two numbers: current health, and the lowest it has dipped. One path might have more health now but needed more at the start. Neither is simply better. Looking backwards, from the princess, there is just one number per room: the health you need when you enter it.');

  v.chapter('better', 'Better: memoised need(r, c)', { cx: 'O(m·n)', code: ['cache need(r, c)'] });
  v.eq('m·n rooms', 'warn').say('Defining the subproblem as health needed from a room onwards and caching it gives linear time.');

  v.chapter('optimal', 'Optimal: fill from the princess backwards', { cx: 'O(m·n) time, O(n) space', code: ['beyond the princess: need = 1', 'need[r][c] = max(1, min(need[r+1][c], need[r][c+1]) − room[r][c])', 'answer = need[0][0]'] });
  v.clear();
  v.grid('in', D, { label: 'rooms' });
  const g = v.grid('dp', D.map((r) => r.map(() => '')), { label: 'need = min health on entering this room' });
  v.layout('row');
  v.line(0).say('Start at the princess. After her room the knight needs at least one health. Entering a room, he needs enough to cover its change and still have what the next room requires, and never less than one.');
  const cells: [number, number][] = [];
  for (let r = R - 1; r >= 0; r--) for (let c = C - 1; c >= 0; c--) cells.push([r, c]);
  fill2D(v, g, cells, {
    deps: (r, c) => { if (r === R - 1 && c === C - 1) return []; const down = r < R - 1 ? need[r + 1][c] : Infinity, right = c < C - 1 ? need[r][c + 1] : Infinity; return [down <= right ? [r + 1, c] : [r, c + 1]]; },
    val: (r, c) => need[r][c], line: [1],
    eq: (r, c) => { const nxt = r === R - 1 && c === C - 1 ? 1 : Math.min(r < R - 1 ? need[r + 1][c] : Infinity, c < C - 1 ? need[r][c + 1] : Infinity); return `need = max(1, ${nxt} − ${D[r][c] < 0 ? `(${D[r][c]})` : D[r][c]}) = ${need[r][c]}`; },
    say: (r, c) => (r === R - 1 && c === C - 1 ? 'The princess’s room has a demon costing five, and he must leave it with at least one: he needs six on entering.' : r === R - 1 && c === C - 2 ? 'The room with a thirty-point potion: thirty more than enough to cover the six needed next, but health can never be below one, so one.' : r === 0 && c === 0 ? `The first room costs two, and the best way on needs ${words(Math.min(need[1][0], need[0][1]))}. So he must start with ${words(need[0][0])}.` : undefined),
    hold: 600,
  });
  g.tone(0, 0, 'ok');
  v.line(2).eq(`answer = ${need[0][0]}`, 'ok').say(`The knight needs ${words(need[0][0])} health: right, right, down, down. Filling backwards with one row gives linear space.`);
  v.answer(minHp(D));

  recap(v, [{ name: 'All paths', time: 'O(2^(m+n))', space: 'O(m + n)' }, { name: 'Memoised need(r, c)', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'Backward row DP', time: 'O(m·n)', space: 'O(n)' }], 'need = max(1, min(next) − room), filled backwards.', ['Minimum starting resource to survive a path → backward DP'], 'Clamp at 1: extra health never goes negative.');
  return v.build();
}

const problem: Problem = {
  slug: 'dungeon-game',
  statement: 'A knight starts in the top-left room of an `m × n` dungeon and must reach the princess in the bottom-right, moving only right or down. `dungeon[i][j]` changes his health (negative = damage). If his health drops to 0 or below he dies. Return the minimum initial health needed.',
  examples: [{ input: 'dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]', output: '7' }, { input: 'dungeon = [[0]]', output: '1' }],
  constraints: ['1 ≤ m, n ≤ 200', '−1000 ≤ dungeon[i][j] ≤ 1000'],
  hints: ['Forward DP needs two numbers per cell.', 'Backwards: health needed on entering a room.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'need(r, c) over both moves, uncached.', time: 'O(2^(m+n))', space: 'O(m + n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache need(r, c).', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Memo table.' },
    { id: 'optimal', kind: 'optimal', name: 'Backward row', idea: 'Fill from the princess with one row.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: 'Fill **backwards**; clamp at 1.',
  video,
  videoArgs: [D],
  judge: {
    type: 'fn', fn: 'calculateMinimumHP', params: ['int[][]'], ret: 'int',
    tests: [{ args: [D], out: 7 }, { args: [[[0]]], out: 1 }, { args: [[[100]]], out: 1 }, { args: [[[1, -3, 3], [0, -2, 0], [-3, -3, -3]]], out: 3 }],
    gen: (r: Rng) => { const R = r.int(1, 6), C = r.int(1, 6); return [Array.from({ length: R }, () => Array.from({ length: C }, () => r.int(-12, 8)))]; },
    ref: (d: number[][]) => minHp(d),
  },
};

export default problem;
