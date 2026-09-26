import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S1 = 'ab';
const S2 = 'eidbaooo';

function incl(s1: string, s2: string) {
  if (s1.length > s2.length) return false;
  const k = s1.length;
  const key = (s: string) => [...s].sort().join('');
  const want = key(s1);
  for (let i = 0; i + k <= s2.length; i++) if (key(s2.slice(i, i + k)) === want) return true;
  return false;
}

function video() {
  const v = new Video('permutation-in-string', 'Permutation in String');
  v.chapter('intro', 'The problem');
  v.array('s2', S2.split(''), { label: `s2 · does it contain a permutation of s1 = "${S1}"?` });
  v.say(`Does s two contain some rearrangement of s one as a contiguous substring? Here s one is a, b, so we are looking for "ab" or "ba".`);
  v.eq('a permutation = same letters, same counts, any order → compare letter counts', 'ok').say('Two strings are permutations of each other exactly when every letter appears the same number of times. So compare letter counts, not orders.');

  v.chapter('brute', 'Brute force: sort every window', { cx: 'O(n · k log k)', code: ['want = sorted(s1)', 'for each window w of length k in s2:', '  if sorted(w) == want: return true'] });
  v.eq('sorting each window repeats most of the work', 'warn').say('Sorting every window of length k and comparing works, but each window costs k log k, and neighbouring windows are almost identical.');

  v.chapter('optimal', 'Optimal: slide a count array', { cx: 'O(n)', code: ['need = counts of s1; have = counts of the first window', 'for r in k..n−1:', '  have[s2[r]] += 1; have[s2[r − k]] −= 1', '  if have == need: return true   (26 compares, or track a match counter)'] });
  v.clear();
  const a = v.array('s2', S2.split(''), { label: 's2' });
  const need = new Map<string, number>();
  for (const c of S1) need.set(c, (need.get(c) ?? 0) + 1);
  const tb = v.table('cnt', ['letter', 'need', 'window'], [...'abdeio'].map((c) => [c, String(need.get(c) ?? 0), '0']));
  const k = S1.length;
  const have = new Map<string, number>();
  const show = () => { tb.p.rows = [...'abdeio'].map((c) => [c, String(need.get(c) ?? 0), String(have.get(c) ?? 0)]); tb.clearTones(); [...'abdeio'].forEach((c, i) => { if ((need.get(c) ?? 0) === (have.get(c) ?? 0)) tb.tone(i, 'ok'); }); };
  v.say('Keep the letter counts of the current window of length two, and compare them with the counts of s one. When the window slides, only two counts change.');
  let found = false;
  for (let r = 0; r < S2.length && !found; r++) {
    have.set(S2[r], (have.get(S2[r]) ?? 0) + 1);
    if (r >= k) have.set(S2[r - k], have.get(S2[r - k])! - 1);
    if (r < k - 1) continue;
    show();
    const eq = [...'abdeio'].every((c) => (need.get(c) ?? 0) === (have.get(c) ?? 0));
    a.clearTones().win(r - k + 1, r, eq ? 'ok' : 'win').tone(r, 'active');
    v.line(2, 3).eq(`window "${S2.slice(r - k + 1, r + 1)}" → counts ${eq ? 'match ✓' : 'differ'}`, eq ? 'ok' : undefined);
    if (r === k - 1) v.say('The first window is e, i. Its counts do not match a, b.');
    else if (eq) { v.say(`The window ${S2.slice(r - k + 1, r + 1).split('').join(', ')} has one a and one b, exactly like s one. So the answer is true.`); found = true; }
    else v.hold(600);
  }
  a.noWin();
  v.answer(incl(S1, S2));
  v.eq('each slide changes 2 counts · compare in O(26) or track how many letters match', 'ok');

  recap(v, [{ name: 'Sort each window', time: 'O(n · k log k)', space: 'O(k)' }, { name: 'Sliding count array', time: 'O(n · 26) or O(n)', space: 'O(26)' }], 'Anagram check = equal counts; slide the counts.', ['Permutation / anagram inside a string → fixed window + counts'], 'Anagram questions are fixed-size windows over letter counts.');
  return v.build();
}

const problem: Problem = {
  slug: 'permutation-in-string',
  statement: 'Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1` as a substring.',
  examples: [{ input: 's1 = "ab", s2 = "eidbaooo"', output: 'true', why: '"ba" is a permutation of "ab".' }, { input: 's1 = "ab", s2 = "eidboaoo"', output: 'false' }],
  constraints: ['1 ≤ s1.length, s2.length ≤ 10⁴', 'lowercase letters'],
  hints: ['When are two strings permutations of each other?', 'Every candidate substring has length |s1|.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort every window', idea: 'Compare sorted(s1) with sorted(window) for every window of length |s1|.', time: 'O(n · k log k)', space: 'O(k)', bottleneck: 'Re-sorts overlapping windows.' },
    { id: 'optimal', kind: 'optimal', name: 'Sliding count array', idea: 'Maintain 26 counts for the window; add the entering letter, remove the leaving one, compare with s1’s counts.', time: 'O(26 · n)', space: 'O(26)' },
  ],
  takeaway: 'Anagram = **equal letter counts**; slide them with a fixed window.',
  video,
  videoArgs: [S1, S2],
  judge: {
    type: 'fn', fn: 'checkInclusion', params: ['String', 'String'], ret: 'boolean',
    tests: [{ args: ['ab', 'eidbaooo'], out: true }, { args: ['ab', 'eidboaoo'], out: false }, { args: ['abc', 'ab'], out: false }, { args: ['adc', 'dcda'], out: true }],
    gen: (r: Rng) => [r.str(r.int(1, 3), 'abc'), r.str(r.int(1, 10), 'abcd')],
    ref: (a: string, b: string) => incl(a, b),
  },
};

export default problem;
