import type { Video } from '../engine/builder';
import { fill2D } from './dpviz';

export interface StateRow {
  name: string;
  /** value on day 0 */
  init: (p: number) => number;
  /** value today from yesterday's column; returns [value, index of the state it came from] */
  step: (prev: number[], p: number) => [number, number];
  /** equation text for today's cell */
  eq: (prev: number[], p: number, val: number) => string;
}

/** Compute the whole state table: table[r][d]. */
export function stateValues(prices: number[], rows: StateRow[]) {
  const t = rows.map((r) => [r.init(prices[0])]);
  const from: number[][] = rows.map(() => [-1]);
  for (let d = 1; d < prices.length; d++) {
    const prev = rows.map((_, r) => t[r][d - 1]);
    rows.forEach((row, r) => { const [val, f] = row.step(prev, prices[d]); t[r].push(val); from[r].push(f); });
  }
  return { t, from };
}

/**
 * Animate a states × days table, one day (column) at a time. Each cell draws an arrow from the
 * state it came from on the previous day.
 */
export function stateTable(
  v: Video,
  prices: number[],
  rows: StateRow[],
  o: { label?: string; say?: (r: number, d: number, val: number) => string | undefined; line?: (r: number) => number[]; hold?: number; initSay?: string },
) {
  const { t, from } = stateValues(prices, rows);
  const n = prices.length;
  const g = v.grid('st', rows.map((_, r) => prices.map((_, d) => (d === 0 ? t[r][0] : ''))), { label: o.label ?? 'best profit in each state at the end of each day' });
  g.heads(rows.map((r) => r.name), prices.map((p, d) => `d${d}: ${p}`));
  rows.forEach((_, r) => g.tone(r, 0, 'done'));
  v.say(o.initSay ?? 'Day zero sets the starting value of every state.');
  const cells: [number, number][] = [];
  for (let d = 1; d < n; d++) for (let r = 0; r < rows.length; r++) cells.push([r, d]);
  fill2D(v, g, cells, {
    deps: (r, d) => [[from[r][d], d - 1]],
    val: (r, d) => t[r][d],
    line: o.line ? (r) => o.line!(r) : undefined,
    eq: (r, d) => rows[r].eq(rows.map((_, k) => t[k][d - 1]), prices[d], t[r][d]),
    say: (r, d) => o.say?.(r, d, t[r][d]),
    hold: o.hold ?? 300,
  });
  return { g, t };
}
