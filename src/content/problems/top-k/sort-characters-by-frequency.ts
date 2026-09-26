import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const S = 'programming';
function fs(s: string) { const m = new Map<string, number>(); for (const c of s) m.set(c, (m.get(c) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([c, n]) => c.repeat(n)).join(''); }

function video() {
  const v = new Video('sort-characters-by-frequency', 'Sort Characters By Frequency');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Rearrange the string so that characters appear in decreasing order of frequency, with equal characters grouped together. Characters that tie may come in any order.');
  v.eq(`e.g. "${fs(S)}"`);

  v.chapter('brute', 'Brute force: sort characters by (count, char)', { cx: 'O(n log n)', code: ['count each character', 'sort the characters of s by (count desc, char)', 'join'] });
  v.eq('sorting n characters', 'warn').say('Count, then sort all n characters with a comparator on their counts. n log n.');

  v.chapter('optimal', 'Optimal: bucket by frequency', { cx: 'O(n)', code: ['count each character', 'bucket[c] = characters that appear c times', 'for c from n down to 1: append each char c times'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const m = v.map('m', { label: 'count' });
  const cnt = new Map<string, number>();
  v.say('Count every character with a hash map.');
  S.split('').forEach((c, i) => { cnt.set(c, (cnt.get(c) ?? 0) + 1); a.clearTones().tone(i, 'active'); m.clearTones().put(c, cnt.get(c)!).tone(c, 'active'); v.hold(i < 3 ? 550 : 300); });
  a.clearTones();
  m.clearTones();
  const n = S.length;
  const buckets: string[][] = Array.from({ length: n + 1 }, () => []);
  [...cnt.entries()].sort((x, y) => (x[0] < y[0] ? -1 : 1)).forEach(([c, k]) => buckets[k].push(c));
  const top = Math.max(...cnt.values());
  const b = v.array('b', buckets.slice(0, top + 1).map((x) => (x.length ? x.join('') : null)), { label: 'bucket[count] (counts ≤ n)' });
  v.line(1).say(`A count is at most n, so put each character into the bucket for its count. Here the largest count is ${words(top)}.`);
  let out = '';
  const o = v.array('o', [], { label: 'result' });
  for (let c = top; c >= 1; c--) {
    if (!buckets[c].length) continue;
    b.clearTones().tone(c, 'ok');
    for (const ch of buckets[c]) { out += ch.repeat(c); for (let t = 0; t < c; t++) o.push(ch); }
    v.line(2).eq(`bucket[${c}] → ${buckets[c].map((ch) => ch.repeat(c)).join(' ')}`).hold(c === top ? 900 : 600);
    if (c === top) v.say(`Start with the highest bucket, ${words(c)}: those characters go first, each written ${words(c)} times.`);
  }
  b.clearTones();
  v.eq(`"${out}"`, 'ok').say('Walk down the buckets. Every step is linear: counting, bucketing, and writing the output.');
  v.answer(fs(S));

  recap(v, [{ name: 'Sort by count', time: 'O(n log n)', space: 'O(n)' }, { name: 'Bucket by count', time: 'O(n)', space: 'O(n)' }], 'Count, bucket by count, write from the highest bucket.', ['Order by frequency → counts + buckets'], 'The same bucket trick as Top K Frequent Elements.');
  return v.build();
}

const problem: Problem = {
  slug: 'sort-characters-by-frequency',
  statement: 'Given a string `s`, sort it in decreasing order based on the frequency of the characters. Return any valid answer (equal characters must be adjacent; ties in any order).',
  examples: [{ input: 's = "tree"', output: '"eert"', why: '"eetr" is also valid.' }, { input: 's = "cccaaa"', output: '"aaaccc"' }, { input: 's = "Aabb"', output: '"bbAa"' }],
  constraints: ['1 ≤ n ≤ 5 · 10⁵', 'letters and digits'],
  hints: ['Count first.', 'Counts are at most n: use buckets.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort by count', idea: 'Sort characters by (count desc, char).', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Comparison sort.' },
    { id: 'optimal', kind: 'optimal', name: 'Buckets', idea: 'bucket[count] → characters; write from high to low.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Frequency ordering → **bucket sort**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'frequencySort', params: ['String'], ret: 'String', cmp: { checker: 'freqSort' },
    tests: [{ args: ['tree'], out: 'eert' }, { args: ['cccaaa'], out: 'aaaccc' }, { args: ['Aabb'], out: 'bbAa' }],
    gen: (r: Rng) => [r.str(r.int(1, 14), 'aabbcAB1')],
    ref: (s: string) => fs(s),
  },
};

export default problem;
