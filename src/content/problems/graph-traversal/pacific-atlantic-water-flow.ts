import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const H = [
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4],
];
function pa(h: number[][]) { const m = h.length, n = h[0].length; const reach = (starts: [number, number][]) => { const s = h.map((r) => r.map(() => false)); const st = [...starts]; starts.forEach(([r, c]) => (s[r][c] = true)); while (st.length) { const [r, c] = st.pop()!; for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= m || nc >= n || s[nr][nc] || h[nr][nc] < h[r][c]) continue; s[nr][nc] = true; st.push([nr, nc]); } } return s; }; const P: [number, number][] = [], A: [number, number][] = []; for (let r = 0; r < m; r++) { P.push([r, 0]); A.push([r, n - 1]); } for (let c = 0; c < n; c++) { P.push([0, c]); A.push([m - 1, c]); } const p = reach(P), a = reach(A); const out: number[][] = []; for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (p[r][c] && a[r][c]) out.push([r, c]); return out; }

function video() {
  const v = new Video('pacific-atlantic', 'Pacific Atlantic Water Flow');
  v.chapter('intro', 'The problem');
  v.grid('g', H, { label: 'heights · Pacific: top & left edges · Atlantic: bottom & right edges' });
  v.say('Rain on a cell flows to a neighbouring cell with equal or lower height. The Pacific touches the top and left edges, the Atlantic the bottom and right edges. Return every cell from which water can reach both oceans.');
  v.eq(`${pa(H).length} cells`);

  v.chapter('brute', 'Brute force: let water flow from every cell', { cx: 'O((m·n)²)', code: ['for each cell: DFS downhill (to neighbours ≤ current)', '  record whether it reaches the Pacific edge and the Atlantic edge'] });
  v.eq('one full search per cell', 'warn').say('Simulating the water from every cell separately means a whole search per cell: m times n, squared.');

  v.chapter('optimal', 'Reverse the flow: climb up from each ocean', { cx: 'O(m·n)', code: ['pac = climb (≥) from top / left edges', 'atl = climb (≥) from bottom / right edges', 'answer = pac ∩ atl'] });
  v.clear();
  const g = v.grid('g', H, { label: 'purple = Pacific · blue = Atlantic · green = both' });
  const m = H.length, n = H[0].length;
  const climb = (starts: [number, number][], tone: 'path' | 'cmp', name: string, seenOther?: boolean[][]) => {
    const s = H.map((r) => r.map(() => false));
    const st: [number, number][] = [];
    starts.forEach(([r, c]) => { if (!s[r][c]) { s[r][c] = true; st.push([r, c]); } });
    const paint = () => { for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (s[r][c]) g.tone(r, c, seenOther && seenOther[r][c] ? 'ok' : tone); };
    paint();
    v.line(name === 'Pacific' ? 0 : 1).eq(`${name}: start from its edges`);
    v.say(name === 'Pacific' ? 'Turn the question around. Water flows downhill from a cell to the ocean, so walking uphill from the ocean finds every cell that can drain into it. Start from all Pacific edge cells and climb to neighbours that are equal or higher.' : 'Do the same from the Atlantic edges. Cells reached by both climbs are shown in green.');
    let steps = 0;
    while (st.length) {
      const [r, c] = st.pop()!;
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= m || nc >= n || s[nr][nc] || H[nr][nc] < H[r][c]) continue;
        s[nr][nc] = true; st.push([nr, nc]);
        paint();
        if (steps++ < 8) v.eq(`${name}: ${H[r][c]} → ${H[nr][nc]} at (${nr},${nc}) is uphill or level`).hold(450);
      }
    }
    paint();
    v.eq(`${name} can drain ${s.flat().filter(Boolean).length} cells`).hold(700);
    return s;
  };
  const P: [number, number][] = [], A: [number, number][] = [];
  for (let r = 0; r < m; r++) { P.push([r, 0]); A.push([r, n - 1]); }
  for (let c = 0; c < n; c++) { P.push([0, c]); A.push([m - 1, c]); }
  const p = climb(P, 'path', 'Pacific');
  g.clearTones();
  climb(A, 'cmp', 'Atlantic', p);
  const res = pa(H);
  g.clearTones(); res.forEach(([r, c]) => g.tone(r, c, 'ok'));
  v.line(2).eq(`both oceans: ${res.map(([r, c]) => `(${r},${c})`).join(' ')}`, 'ok').say(`The answer is the intersection: ${words(res.length)} cells. Two searches, each visiting every cell at most once: linear.`);
  v.answer(pa(H));

  recap(v, [{ name: 'Flow from every cell', time: 'O((m·n)²)', space: 'O(m·n)' }, { name: 'Climb from both oceans', time: 'O(m·n)', space: 'O(m·n)' }], 'Reverse the edges: search from the targets, then intersect.', ['Can each cell reach X? → search backwards from X'], 'Many sources, few targets: start at the targets.');
  return v.build();
}

const problem: Problem = {
  slug: 'pacific-atlantic-water-flow',
  statement: 'Given an `m × n` matrix of heights, the Pacific ocean touches the top and left edges and the Atlantic the bottom and right edges. Water flows from a cell to an adjacent cell with height less than or equal to it. Return the list of coordinates from which water can flow to both oceans (any order).',
  examples: [{ input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' }, { input: 'heights = [[1]]', output: '[[0,0]]' }],
  constraints: ['1 ≤ m, n ≤ 200', '0 ≤ height ≤ 10⁵'],
  hints: ['Search backwards from each ocean, climbing uphill.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Flow from every cell', idea: 'DFS downhill from each cell, tracking which oceans it reaches.', time: 'O((m·n)²)', space: 'O(m·n)', bottleneck: 'A search per cell.' },
    { id: 'optimal', kind: 'optimal', name: 'Climb from the oceans', idea: 'Two uphill searches from the ocean edges; intersect.', time: 'O(m·n)', space: 'O(m·n)' },
  ],
  takeaway: 'Search **backwards from the targets**.',
  video,
  videoArgs: [H],
  judge: {
    type: 'fn', fn: 'pacificAtlantic', params: ['int[][]'], ret: 'List<List<Integer>>', cmp: 'sorted',
    tests: [{ args: [H], out: pa(H) }, { args: [[[1]]], out: [[0, 0]] }, { args: [[[2, 1], [1, 2]]], out: pa([[2, 1], [1, 2]]) }],
    gen: (r: Rng) => { const m = r.int(1, 5), n = r.int(1, 5); return [Array.from({ length: m }, () => r.ints(n, 0, 5))]; },
    ref: (h: number[][]) => pa(h),
  },
};

export default problem;
