import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const H = [1, 2, 3, 6, 2, 3, 4, 7, 8];
const W = 3;
function hs(h: number[], w: number) { if (h.length % w) return false; const c = new Map<number, number>(); for (const x of h) c.set(x, (c.get(x) ?? 0) + 1); for (const k of [...c.keys()].sort((a, b) => a - b)) { const m = c.get(k)!; if (!m) continue; for (let d = 0; d < w; d++) { const have = c.get(k + d) ?? 0; if (have < m) return false; c.set(k + d, have - m); } } return true; }

function video() {
  const v = new Video('hand-of-straights', 'Hand of Straights');
  v.chapter('intro', 'The problem');
  v.array('h', H, { label: `hand, groupSize = ${W}` });
  v.say(`Can the cards be split into groups of ${words(W)} consecutive values? Every card must be used exactly once.`);
  v.eq(`answer: ${hs(H, W)}`);

  v.chapter('insight', 'The smallest card has no choice');
  v.clear();
  v.text('t', { title: 'Greedy anchor', lines: ['The smallest remaining card cannot be in the middle or end of a group', '(nothing smaller is left to come before it)', 'So it must START a group: smallest, smallest + 1, …'], shown: 3 });
  v.say('Look at the smallest card left. Nothing smaller remains, so it cannot sit in the middle or at the end of a run. It must start one. That forces the whole group: it and the next groupSize minus one values.');

  v.chapter('brute', 'Brute force: sort and remove from a list', { cx: 'O(n²)', code: ['sort the hand into a list', 'while list: x = first; remove x, x+1, …, x+w−1 (search each)', '  any missing → false'] });
  v.eq('removing from the middle of a list is O(n)', 'warn').say('Sort the cards into a list, then repeatedly take the first card and search for and remove its successors. Each removal is linear.');

  v.chapter('optimal', 'Optimal: counts + sorted keys', { cx: 'O(n log n)', code: ['count each value', 'for x in sorted keys:', '  m = count[x]; if m == 0: continue', '  for d in 0..w−1: count[x + d] −= m (fail if < 0)'] });
  v.clear();
  const cnt = new Map<number, number>();
  for (const x of H) cnt.set(x, (cnt.get(x) ?? 0) + 1);
  const keys = [...cnt.keys()].sort((a, b) => a - b);
  const m = v.map('m', { label: 'count of each card value (sorted keys)' });
  keys.forEach((k) => m.put(k, cnt.get(k)!));
  let told = 0;
  v.say('Count every value. Walk the distinct values in increasing order. If value x still has m copies, all m of them must start groups, so take m copies of each of x, x plus one, up to x plus groupSize minus one, all at once.');
  let ok = true;
  for (const k of keys) {
    const c = cnt.get(k)!;
    m.clearTones().tone(k, 'active');
    if (!c) { v.line(2).eq(`${k}: count 0 → already used`).hold(500); continue; }
    const run = Array.from({ length: W }, (_, d) => k + d);
    for (const x of run) {
      const have = cnt.get(x) ?? 0;
      if (have < c) { ok = false; m.tone(x, 'bad'); v.line(3).eq(`need ${c} × ${x}, have ${have} → false`, 'bad').say(`We need ${words(c)} copies of ${words(x)} but have ${words(have)}. Impossible.`); break; }
      cnt.set(x, have - c);
      m.put(x, have - c).tone(x, 'ok');
    }
    if (!ok) break;
    v.line(3).eq(`${c} group${c > 1 ? 's' : ''} ${run.join('-')}`, 'ok');
    if (told === 0) { v.say(`The smallest value is ${words(k)}, with ${words(c)} ${c > 1 ? 'copies' : 'copy'}. ${c > 1 ? 'Each' : 'It'} starts a group ${run.map(words).join(', ')}: subtract ${words(c)} from each of those counts.`); told++; }
    else v.hold(800);
  }
  if (ok) { m.clearTones(); v.eq('every count reached 0 → true', 'ok').say('Every count reached zero, so the hand splits perfectly.'); }
  v.answer(hs(H, W));

  recap(v, [{ name: 'Sorted list removals', time: 'O(n²)', space: 'O(n)' }, { name: 'Counts + sorted keys', time: 'O(n log n)', space: 'O(n)' }], 'The smallest remaining value must start a group.', ['Split into consecutive runs → start from the smallest'], 'Find the element with no freedom and let it decide.');
  return v.build();
}

const problem: Problem = {
  slug: 'hand-of-straights',
  statement: 'Alice has some cards `hand[i]` and wants to rearrange them into groups of size `groupSize` where each group consists of `groupSize` consecutive values. Return `true` if possible.',
  examples: [{ input: 'hand = [1,2,3,6,2,3,4,7,8], groupSize = 3', output: 'true' }, { input: 'hand = [1,2,3,4,5], groupSize = 4', output: 'false' }],
  constraints: ['1 ≤ n ≤ 10⁴', '0 ≤ hand[i] ≤ 10⁹', '1 ≤ groupSize ≤ n'],
  hints: ['What must the smallest card be part of?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sorted list removals', idea: 'Repeatedly remove the smallest card and its successors from a sorted list.', time: 'O(n²)', space: 'O(n)', bottleneck: 'List removals.' },
    { id: 'optimal', kind: 'optimal', name: 'Counts + sorted keys', idea: 'For each key in order, subtract its count from the next groupSize keys.', time: 'O(n log n)', space: 'O(n)' },
  ],
  pitfalls: ['If n is not divisible by groupSize, return false immediately.'],
  takeaway: 'The **smallest** card must **start** a group.',
  video,
  videoArgs: [H, W],
  judge: {
    type: 'fn', fn: 'isNStraightHand', params: ['int[]', 'int'], ret: 'boolean',
    tests: [{ args: [H, W], out: true }, { args: [[1, 2, 3, 4, 5], 4], out: false }, { args: [[1, 1, 2, 2, 3, 3], 3], out: true }, { args: [[8, 10, 12], 3], out: false }],
    gen: (r: Rng) => { const w = r.int(1, 3); const h: number[] = []; const g = r.int(1, 3); for (let i = 0; i < g; i++) { const s = r.int(0, 5); for (let d = 0; d < w; d++) h.push(s + d); } if (r.chance(0.4)) h[r.int(0, h.length - 1)] += r.pick([-1, 1, 2]); return [r.shuffle(h), w]; },
    ref: (h: number[], w: number) => hs(h, w),
  },
};

export default problem;
