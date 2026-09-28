import type { Tone } from '../engine/types';

/** Last `w` bits of x (two's complement for negatives). */
export const bstr = (x: number, w: number) => (x >>> 0).toString(2).padStart(32, '0').slice(32 - w);

/** One row for a bits panel; `tone(pos, bit)` colours individual bits (pos 0 = leftmost). */
export function brow(label: string, x: number, w: number, o: { note?: string; tone?: (pos: number, bit: string) => Tone | undefined } = {}) {
  const bits = bstr(x, w);
  const tones: Record<number, Tone> = {};
  if (o.tone) bits.split('').forEach((b, i) => { const t = o.tone!(i, b); if (t) tones[i] = t; });
  return { label, bits, tones, note: o.note };
}

/** Tone all 1 bits. */
export const ones = (t: Tone) => (_: number, b: string) => (b === '1' ? t : undefined);
