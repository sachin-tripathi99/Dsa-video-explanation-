import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const NOTE = 'aab';
const MAG = 'baac';

function video() {
  const v = new Video('ransom-note', 'Ransom Note');
  v.chapter('intro', 'The problem');
  v.array('note', [...NOTE], { label: 'ransomNote' });
  v.array('mag', [...MAG], { label: 'magazine' });
  v.say('Can you build the ransom note by cutting letters out of the magazine? Each magazine letter can be used once.');

  v.chapter('brute', 'Brute force: search and cross out', { cx: 'O(n·m)', code: ['for c in note:', '  find c in magazine (scan)', '  if missing: return false; else remove it'] });
  v.eq('each lookup scans the magazine → O(n·m)', 'bad').say('For every note letter, scan the magazine for it and cross it out. That rescans the magazine each time.');

  v.chapter('optimal', 'Count the magazine letters', { cx: 'O(n + m)', code: ['count[c]++ for c in magazine', 'for c in note:', '  if count[c] == 0: return false', '  count[c]−−', 'return true'] });
  v.clear();
  const cnt = v.array('cnt', [0, 0, 0, 0], { label: 'count of a, b, c, d', showIdx: false });
  cnt.subs(['a', 'b', 'c', 'd']);
  [...MAG].forEach((c) => cnt.set(c.charCodeAt(0) - 97, (cnt.get(c.charCodeAt(0) - 97) as number) + 1));
  cnt.toneRange(0, 2, 'active');
  v.line(0).say('Count the magazine letters once: two a, one b, one c.');
  const note = v.array('note', [...NOTE], { label: 'ransomNote' });
  [...NOTE].forEach((c, i) => {
    const k = c.charCodeAt(0) - 97;
    const ok = (cnt.get(k) as number) > 0;
    cnt.set(k, (cnt.get(k) as number) - 1).clearTones().tone(k, ok ? 'ok' : 'bad');
    note.clearTones().tone(i, ok ? 'ok' : 'bad');
    v.line(3).eq(`use '${c}' → ${cnt.get(k)} left`);
    if (i === 0) v.say('Then spend a letter for each note character. As long as no count goes below zero, we can build it.');
    else v.hold(600);
  });
  v.eq('never ran out → true', 'ok').hold(700);
  v.answer(true);
  recap(v, [{ name: 'Search and cross out', time: 'O(n·m)', space: 'O(m)' }, { name: 'Letter counts', time: 'O(n + m)', space: 'O(1)' }], 'Counting turns repeated scans into constant-time lookups.', ['"Can A be built from B?" → count B, spend for A'], 'Supply and demand: count the supply once, then spend it.');
  return v.build();
}

const problem: Problem = {
  slug: 'ransom-note',
  statement: 'Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be built from the letters of `magazine`, using each magazine letter at most once.',
  examples: [{ input: 'ransomNote = "a", magazine = "b"', output: 'false' }, { input: 'ransomNote = "aa", magazine = "ab"', output: 'false' }, { input: 'ransomNote = "aa", magazine = "aab"', output: 'true' }],
  constraints: ['1 ≤ lengths ≤ 10⁵', 'lowercase letters'],
  hints: ['Count what the magazine offers.', 'Spend a letter for each note character; fail if a count goes negative.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Search and remove', idea: 'For each note letter, find and remove one occurrence from a list of magazine letters.', time: 'O(n·m)', space: 'O(m)', bottleneck: 'Each search scans the magazine.' },
    { id: 'optimal', kind: 'optimal', name: 'Letter counts', idea: 'Count the magazine letters, then decrement for each note letter; return false if any count would go negative.', time: 'O(n + m)', space: 'O(1)' },
  ],
  takeaway: 'Count the **supply** once, then **spend** it.',
  video,
  videoArgs: [NOTE, MAG],
  judge: {
    type: 'fn', fn: 'canConstruct', params: ['String', 'String'], ret: 'boolean',
    tests: [{ args: ['a', 'b'], out: false }, { args: ['aa', 'ab'], out: false }, { args: ['aa', 'aab'], out: true }],
    gen: (r) => [r.str(r.int(1, 6), 'abc'), r.str(r.int(1, 10), 'abc')],
    ref: (n: string, m: string) => { const c: Record<string, number> = {}; for (const x of m) c[x] = (c[x] ?? 0) + 1; for (const x of n) { if (!c[x]) return false; c[x]--; } return true; },
  },
};

export default problem;
