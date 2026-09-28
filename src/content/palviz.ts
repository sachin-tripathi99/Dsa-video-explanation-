import type { Video, ArrayH } from '../engine/builder';

export interface ExpandInfo { centre: number; l: number; r: number; odd: boolean; step: 'start' | 'grow' | 'stop'; count: number; best: [number, number] }

/**
 * Expand around every centre (2n − 1 of them) and animate the growing window. `say` may narrate
 * any step; the rest hold briefly. Returns every palindrome found as [l, r].
 */
export function expandViz(
  v: Video,
  a: ArrayH,
  s: string,
  o: { lines: { centre: number[]; grow: number[]; stop: number[] }; say?: (x: ExpandInfo) => string | undefined; hold?: number; eqSuffix?: (x: ExpandInfo) => string },
) {
  const n = s.length;
  const found: [number, number][] = [];
  let best: [number, number] = [0, 0];
  for (let c = 0; c < 2 * n - 1; c++) {
    let l = Math.floor(c / 2), r = l + (c % 2);
    const odd = c % 2 === 0;
    const info = (step: ExpandInfo['step']): ExpandInfo => ({ centre: c, l, r, odd, step, count: found.length, best });
    const show = (wl: number, wr: number, label: string) => { a.clearTones().noWin(); if (wl <= wr) a.win(Math.max(0, wl), Math.min(n - 1, wr), 'ok', label); a.ptrs({ L: l >= 0 && l < n ? l : null, R: r >= 0 && r < n ? r : null }); };
    const emit = (step: ExpandInfo['step'], eq: string, tone?: 'ok' | 'bad') => {
      v.line(...(step === 'start' ? o.lines.centre : step === 'grow' ? o.lines.grow : o.lines.stop)).eq(eq + (o.eqSuffix?.(info(step)) ?? ''), tone);
      const t = o.say?.(info(step));
      if (t) v.say(t); else v.hold(o.hold ?? 420);
    };
    if (!odd && s[l] !== s[r]) {
      show(1, 0, '');
      a.tone(l, 'bad').tone(r, 'bad');
      emit('stop', `centre between ${l} and ${r}: '${s[l]}' ≠ '${s[r]}' → nothing`, 'bad');
      continue;
    }
    while (l >= 0 && r < n && s[l] === s[r]) {
      found.push([l, r]);
      if (r - l > best[1] - best[0]) best = [l, r];
      show(l, r, s.slice(l, r + 1));
      emit(found.length && l === r ? 'start' : 'grow', `"${s.slice(l, r + 1)}" is a palindrome (${l}..${r})`, 'ok');
      l--; r++;
    }
    show(l + 1, r - 1, s.slice(l + 1, r));
    const why = l < 0 || r >= n ? 'hit the edge' : `'${s[l]}' ≠ '${s[r]}'`;
    if (l >= 0 && r < n) a.tone(l, 'bad').tone(r, 'bad');
    emit('stop', `stop: ${why}`);
  }
  a.clearTones().noWin().noPtr('L', 'R');
  return { found, best };
}
