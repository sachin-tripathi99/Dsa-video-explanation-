/** Ring-by-ring BFS animation on a grid panel (multi-source BFS videos). */
import type { GridH, Video } from '../engine/builder';

export function ringBfs(
  v: Video,
  g: GridH,
  R: number,
  C: number,
  sources: [number, number][],
  open: (r: number, c: number) => boolean,
  per: (ring: number, cells: [number, number][]) => { eq: string; say?: string; ok?: boolean; stop?: boolean },
  opts: { lines?: number[]; show?: (d: number) => string | number } = {},
) {
  const dist = Array.from({ length: R }, () => Array(C).fill(-1) as number[]);
  const show = opts.show ?? ((d: number) => d);
  let frontier: [number, number][] = [];
  sources.forEach(([r, c]) => { dist[r][c] = 0; frontier.push([r, c]); g.set(r, c, show(0)).tone(r, c, 'active'); });
  let ring = 0;
  for (;;) {
    const next: [number, number][] = [];
    for (const [r, c] of frontier) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= R || nc >= C || dist[nr][nc] >= 0 || !open(nr, nc)) continue;
      dist[nr][nc] = ring + 1;
      next.push([nr, nc]);
    }
    if (!next.length) break;
    ring++;
    frontier.forEach(([r, c]) => g.tone(r, c, 'done'));
    next.forEach(([r, c]) => g.set(r, c, show(ring)).tone(r, c, 'cmp'));
    const res = per(ring, next);
    if (opts.lines) v.line(...opts.lines);
    v.counter(`ring ${ring}`).eq(res.eq, res.ok ? 'ok' : undefined);
    if (res.say) v.say(res.say);
    else v.hold(700);
    if (res.stop) break;
    frontier = next;
  }
  return dist;
}
