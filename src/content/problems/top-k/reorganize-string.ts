import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const S = 'aaabbcd';
function reorg(s: string) { const c = new Map<string, number>(); for (const x of s) c.set(x, (c.get(x) ?? 0) + 1); const e = [...c.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)); if (e[0][1] > Math.ceil(s.length / 2)) return ''; const out: string[] = Array(s.length); let i = 0; for (const [ch, k] of e) for (let t = 0; t < k; t++) { if (i >= s.length) i = 1; out[i] = ch; i += 2; } return out.join(''); }

function video() {
  const v = new Video('reorganize-string', 'Reorganize String');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Rearrange the characters so that no two neighbours are equal. Return any valid arrangement, or an empty string if it is impossible.');
  v.eq(`e.g. "${reorg(S)}"`);

  v.chapter('when', 'When is it impossible?');
  v.clear();
  v.text('t', { title: 'The most frequent character is the bottleneck', lines: ['Its copies need a different character between each pair', `With n = ${S.length}, at most ⌈n / 2⌉ = ${Math.ceil(S.length / 2)} copies fit: positions 0, 2, 4, 6`, 'maxCount > ⌈n / 2⌉  →  impossible'], shown: 3 });
  v.say(`The most frequent character needs a different character between every pair of its copies. In a string of length ${words(S.length)}, it can use at most every other position, ${words(Math.ceil(S.length / 2))} positions. If it appears more often than that, there is no answer. Otherwise there always is one.`);

  v.chapter('brute', 'Brute force: backtracking', { cx: 'exponential', code: ['place characters one position at a time', 'skip a character equal to the previous one', 'undo on a dead end'] });
  v.eq('tries many arrangements', 'bad').say('Backtracking over positions, choosing any remaining character different from the previous one, finds an answer but can explore an exponential number of dead ends when none exists.');

  v.chapter('better', 'Better: max-heap, always place the most frequent allowed character', { cx: 'O(n log σ)', code: ['heap of (count, char), max first', 'pop the top; if it equals the previous char, use the second instead', 'place it; push back with count − 1'] });
  v.clear();
  const cnt = new Map<string, number>();
  for (const c of S) cnt.set(c, (cnt.get(c) ?? 0) + 1);
  const o = v.array('o', [], { label: 'result' });
  const m = v.map('m', { label: 'remaining' });
  [...cnt.entries()].forEach(([k, c]) => m.put(k, c));
  v.say('Greedy: at each position, place the character with the most copies left, unless it was just placed; then take the next most frequent. Always spending the biggest pile first keeps it from piling up at the end.');
  let prev = '';
  const res: string[] = [];
  let told = false;
  for (let i = 0; i < S.length; i++) {
    const order = [...cnt.entries()].filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
    const pick = order[0][0] === prev ? order[1][0] : order[0][0];
    const skipped = order[0][0] === prev;
    cnt.set(pick, cnt.get(pick)! - 1);
    res.push(pick);
    o.push(pick);
    o.clearTones().tone(i, 'active');
    m.clearTones().put(pick, cnt.get(pick)!).tone(pick, 'active');
    v.line(skipped ? 1 : 2).eq(skipped ? `${prev} was just placed → take the next: ${pick}` : `most copies left: ${pick}`, skipped ? 'warn' : undefined);
    if (skipped && !told) { v.say(`${prev} still has the most copies, but it was just placed. Take the next one, ${pick}.`); told = true; }
    else if (i === 0) v.say(`${pick} has the most copies: place it first.`);
    else v.hold(600);
    prev = pick;
  }
  o.clearTones();
  m.clearTones();
  v.eq(`"${res.join('')}"`, 'ok').say('Every position is valid. A heap makes each step logarithmic in the alphabet size.');

  v.chapter('optimal', 'Optimal: fill even positions first', { cx: 'O(n)', code: ['if maxCount > ⌈n/2⌉: return ""', 'write the most frequent char at 0, 2, 4, …', 'continue with the other chars at the next even slot,', 'wrapping to 1, 3, 5, … when the evens run out'] });
  v.clear();
  const out: (string | null)[] = Array(S.length).fill(null);
  const a = v.array('o', out, { label: 'result slots' });
  const c2 = new Map<string, number>();
  for (const c of S) c2.set(c, (c2.get(c) ?? 0) + 1);
  const ent = [...c2.entries()].sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1));
  let i = 0;
  v.say('No heap needed. Put the most frequent character on the even positions zero, two, four, and so on. Then keep going with the other characters, first on the remaining even slots, then wrapping around to the odd slots. Copies of the same character always land two apart, so they never touch.');
  for (const [ch, k] of ent) {
    for (let t = 0; t < k; t++) {
      if (i >= S.length) i = 1;
      a.set(i, ch).clearTones().tone(i, 'active');
      i += 2;
    }
    v.line(ent[0][0] === ch ? 1 : 2, 3).eq(`place ${k} × ${ch}`).hold(800);
  }
  a.clearTones();
  v.eq(`"${reorg(S)}"`, 'ok').say('Counting and placing are both linear. The only check needed is the one we did first: the most frequent character must fit on the even positions.');
  v.answer(reorg(S));

  recap(v, [{ name: 'Backtracking', time: 'exponential', space: 'O(n)' }, { name: 'Max-heap greedy', time: 'O(n log σ)', space: 'O(σ)' }, { name: 'Even slots first', time: 'O(n)', space: 'O(n)' }], 'Possible ⇔ maxCount ≤ ⌈n/2⌉; place the most frequent on even slots.', ['No two equal neighbours → most frequent first (heap or even slots)'], 'The bottleneck character decides feasibility and placement.');
  return v.build();
}

const problem: Problem = {
  slug: 'reorganize-string',
  statement: 'Given a string `s`, rearrange the characters so that no two adjacent characters are the same. Return any possible rearrangement, or `""` if not possible.',
  examples: [{ input: 's = "aab"', output: '"aba"' }, { input: 's = "aaab"', output: '""' }],
  constraints: ['1 ≤ n ≤ 500', 'lowercase letters'],
  hints: ['When is it impossible?', 'Place the most frequent character first, two apart.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Backtracking', idea: 'Place characters position by position, never repeating the previous one.', time: 'exponential', space: 'O(n)', bottleneck: 'Dead ends.' },
    { id: 'better', kind: 'better', name: 'Max-heap greedy', idea: 'Place the most frequent allowed character each time.', time: 'O(n log σ)', space: 'O(σ)', bottleneck: 'Heap operations.' },
    { id: 'optimal', kind: 'optimal', name: 'Even slots first', idea: 'Most frequent on 0, 2, 4, …; the rest continue, wrapping to odd slots.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Feasible ⇔ **maxCount ≤ ⌈n/2⌉**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'reorganizeString', params: ['String'], ret: 'String', cmp: { checker: 'noAdjacent' },
    tests: [{ args: ['aab'], out: 'aba' }, { args: ['aaab'], out: '' }, { args: ['a'], out: 'a' }, { args: [S], out: reorg(S) }],
    gen: (r: Rng) => [r.str(r.int(1, 9), 'aaabbc')],
    ref: (s: string) => reorg(s),
  },
};

export default problem;
