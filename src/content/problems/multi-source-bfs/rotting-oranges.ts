import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { ringBfs } from '../../gridbfs';

const G = [[2, 1, 1, 0], [1, 1, 0, 0], [0, 1, 1, 2], [1, 0, 1, 1]];
function rot(g: number[][]) { const m = g.length, n = g[0].length; let q: [number, number][] = []; let fresh = 0; const w = g.map((r) => [...r]); w.forEach((row, r) => row.forEach((x, c) => { if (x === 2) q.push([r, c]); if (x === 1) fresh++; })); let t = 0; while (q.length && fresh) { const nq: [number, number][] = []; for (const [r, c] of q) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= m || nc >= n || w[nr][nc] !== 1) continue; w[nr][nc] = 2; fresh--; nq.push([nr, nc]); } q = nq; t++; } return fresh ? -1 : t; }

function video() {
  const v = new Video('rotting-oranges', 'Rotting Oranges');
  const m = G.length, n = G[0].length;
  const show = (x: number) => (x === 0 ? '' : x === 1 ? '🟠' : '🟤');
  v.chapter('intro', 'The problem');
  v.grid('g', G.map((r) => r.map(show)), { label: 'orange = fresh · brown = rotten · blank = empty' });
  v.say('Every minute, each rotten orange rots the fresh oranges directly above, below, left and right of it. How many minutes until no fresh orange is left? If some orange can never rot, return minus one.');
  v.eq(`answer: ${rot(G)}`);

  v.chapter('brute', 'Simulate minute by minute with full scans', { cx: 'O((m·n)²)', code: ['repeat each minute:', '  scan the whole grid; rot fresh oranges next to rotten ones', '  stop when nothing changes'] });
  v.eq('each minute rescans the whole grid', 'warn').say('Simulating directly means scanning the entire grid every minute, even though only the oranges at the edge of the rot can change. With up to m times n minutes, that is quadratic.');

  v.chapter('optimal', 'Multi-source BFS from all rotten oranges', { cx: 'O(m·n)', code: ['queue = every rotten orange; fresh = count of fresh', 'each BFS ring = one minute: rot fresh neighbours', 'answer = rings if fresh reaches 0, else −1'] });
  v.clear();
  const g = v.grid('g', G.map((r) => r.map(show)), { label: 'badge = minute the orange rots' });
  const src: [number, number][] = [];
  let fresh = 0;
  G.forEach((row, r) => row.forEach((x, c) => { if (x === 2) src.push([r, c]); if (x === 1) fresh++; }));
  v.line(0).counter(`fresh: ${fresh}`).say(`All rotten oranges start spreading at the same time, so they all go into the queue at minute zero. There are ${words(fresh)} fresh oranges.`);
  ringBfs(v, g, m, n, src, (r, c) => G[r][c] === 1, (ring, cells) => {
    fresh -= cells.length;
    v.counter(`fresh: ${fresh}`);
    return { eq: `minute ${ring}: ${cells.length} orange${cells.length === 1 ? '' : 's'} rot · ${fresh} fresh left`, say: ring === 1 ? 'Minute one: every fresh orange next to a rotten one rots. The ring structure of BFS is exactly the passing of minutes.' : undefined };
  }, { lines: [1], show: (d) => (d === 0 ? '🟤' : `🟤${d}`) });
  const stuck: [number, number][] = [];
  const reached = rot(G) >= 0;
  if (!reached) G.forEach((row, r) => row.forEach((x, c) => { if (x === 1 && g.get(r, c) === '🟠') { stuck.push([r, c]); g.tone(r, c, 'bad'); } }));
  v.line(2).eq(reached ? `all rotten after ${rot(G)} minutes` : `${stuck.length} orange${stuck.length === 1 ? '' : 's'} never rot${stuck.length === 1 ? 's' : ''} → −1`, reached ? 'ok' : 'bad').say(reached ? `All oranges rot after ${words(rot(G))} minutes.` : `The queue is empty, but ${words(stuck.length)} fresh orange${stuck.length === 1 ? ' is' : 's are'} left: ${stuck.length === 1 ? 'it is' : 'they are'} cut off by empty cells, so the answer is minus one. Keeping a count of fresh oranges makes this check instant.`);
  v.answer(rot(G));

  recap(v, [{ name: 'Minute-by-minute scans', time: 'O((m·n)²)', space: 'O(1)' }, { name: 'Multi-source BFS', time: 'O(m·n)', space: 'O(m·n)' }], 'Seed the queue with all rotten oranges; rings = minutes; count the fresh ones left.', ['Spreads from many places at once → multi-source BFS'], 'Rings of BFS are units of time.');
  return v.build();
}

const problem: Problem = {
  slug: 'rotting-oranges',
  statement: 'In an `m × n` grid, 0 is empty, 1 is a fresh orange and 2 is a rotten orange. Every minute, any fresh orange 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes until no cell has a fresh orange, or -1 if impossible.',
  examples: [{ input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4' }, { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1' }, { input: 'grid = [[0,2]]', output: '0' }],
  constraints: ['1 ≤ m, n ≤ 10'],
  hints: ['All rotten oranges spread simultaneously.', 'Count fresh oranges to detect −1.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Simulate with scans', idea: 'Each minute scan the grid and rot neighbours of rotten oranges.', time: 'O((m·n)²)', space: 'O(m·n)', bottleneck: 'Full scans per minute.' },
    { id: 'optimal', kind: 'optimal', name: 'Multi-source BFS', idea: 'Queue all rotten oranges; each ring is a minute.', time: 'O(m·n)', space: 'O(m·n)' },
  ],
  pitfalls: ['No fresh oranges at the start → 0.'],
  takeaway: 'Rings = **minutes**.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'orangesRotting', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], out: 4 }, { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], out: -1 }, { args: [[[0, 2]]], out: 0 }, { args: [G], out: rot(G) }],
    gen: (r: Rng) => { const m = r.int(1, 5), n = r.int(1, 5); return [Array.from({ length: m }, () => Array.from({ length: n }, () => r.pick([0, 1, 1, 1, 2])))]; },
    ref: (g: number[][]) => rot(g),
  },
};

export default problem;
