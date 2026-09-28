import type { Video, GridH } from '../engine/builder';
import { fill2D } from './dpviz';

/**
 * dp[i][j] over boundary points 0..m−1, split at every k strictly between i and j:
 * dp[i][j] = best over k of dp[i][k] + dp[k][j] + cost(i, k, j); ranges with j − i < 2 are 0.
 */
export function intervalTable(m: number, cost: (i: number, k: number, j: number) => number, mode: 'min' | 'max') {
  const d = Array.from({ length: m }, () => Array(m).fill(0));
  const split = Array.from({ length: m }, () => Array(m).fill(-1));
  for (let len = 2; len < m; len++) for (let i = 0; i + len < m; i++) {
    const j = i + len;
    let best = mode === 'min' ? Infinity : -Infinity;
    for (let k = i + 1; k < j; k++) { const c = d[i][k] + d[k][j] + cost(i, k, j); if (mode === 'min' ? c < best : c > best) { best = c; split[i][j] = k; } }
    d[i][j] = best;
  }
  return { d, split };
}

/** Animate the table by increasing range length; arrows from both halves of the best split. */
export function intervalViz(
  v: Video,
  g: GridH,
  m: number,
  cost: (i: number, k: number, j: number) => number,
  mode: 'min' | 'max',
  o: { eq: (i: number, j: number, k: number, val: number) => string; say?: (i: number, j: number, k: number) => string | undefined; line?: number[]; hold?: number },
) {
  const { d, split } = intervalTable(m, cost, mode);
  const cells: [number, number][] = [];
  for (let len = 2; len < m; len++) for (let i = 0; i + len < m; i++) cells.push([i, i + len]);
  fill2D(v, g, cells, {
    deps: (i, j) => [[i, split[i][j]], [split[i][j], j]],
    val: (i, j) => d[i][j],
    line: o.line,
    eq: (i, j) => o.eq(i, j, split[i][j], d[i][j]),
    say: (i, j) => o.say?.(i, j, split[i][j]),
    hold: o.hold ?? 450,
  });
  return { d, split };
}
