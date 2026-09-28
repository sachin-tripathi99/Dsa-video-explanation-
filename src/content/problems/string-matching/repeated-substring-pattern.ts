import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { lpsViz } from '../../kmpviz';

const S = 'abcabcabc';
function periodic(s: string) { const n = s.length; for (let len = 1; len <= n / 2; len++) if (n % len === 0 && s === s.slice(0, len).repeat(n / len)) return true; return false; }

function video() {
  const v = new Video('repeated-substring-pattern', 'Repeated Substring Pattern');
  const n = S.length;
  v.chapter('intro', 'The problem');
  v.array('s', [...S], { label: 's' });
  v.say('Can the string be built by writing one of its substrings several times in a row? a b c written three times gives this string, so the answer is true.');
  v.eq('abc × 3 → true', 'ok');

  v.chapter('brute', 'Brute force: try every block length', { cx: 'O(n · d(n))', code: ['for len in 1 .. n / 2:', '  if n % len ≠ 0: skip', '  if every s[i] == s[i − len]:', '    return true', 'return false'] });
  v.clear();
  const a = v.array('s', [...S], { label: 's' });
  for (let len = 1; len <= n / 2; len++) {
    a.clearTones();
    if (n % len) {
      v.line(1).eq(`len ${len}: ${n} % ${len} ≠ 0 → skip`, 'warn').hold(700);
      continue;
    }
    let i = len;
    while (i < n && S[i] === S[i - len]) i++;
    if (i < n) {
      a.toneRange(0, i - 1, 'ok').tone(i - len, 'cmp').tone(i, 'bad');
      v.line(2).eq(`len ${len}: s[${i}] = ${S[i]} ≠ s[${i - len}] = ${S[i - len]}`, 'bad');
      v.say(`Try each block length that divides n. Length ${words(len)}: every character would have to equal ${len === 1 ? 'the one before it' : `the one ${words(len)} positions earlier`}, but ${S[i]} differs from ${S[i - len]}.`);
    } else {
      for (let b = 0; b < n / len; b++) a.toneRange(b * len, b * len + len - 1, b % 2 ? 'win' : 'ok');
      v.line(2, 3).eq(`len ${len}: every character equals the one ${len} earlier → true`, 'ok');
      v.say(`Length ${words(len)}: every character equals the one ${words(len)} positions earlier, so the block ${S.slice(0, len).split('').join(' ')} repeats. Each check is linear, and we try one check per divisor of n.`);
      break;
    }
  }

  v.chapter('better', 'Better: look for s inside s + s', { cx: 'O(n) with a linear search', code: ['t = (s + s) without first and last char', 'return s occurs in t'] });
  v.clear();
  const d = v.array('t', [...(S + S)], { label: 's + s' });
  d.tone(0, 'dim').tone(2 * n - 1, 'dim');
  v.line(0).say('A neat trick. Glue two copies of s together. Every rotation of s appears somewhere inside. Drop the first and last characters so that the two trivial copies, at zero and at n, are broken.');
  const at = (S + S).slice(1, -1).indexOf(S) + 1;
  d.toneRange(at, at + n - 1, 'ok');
  v.line(1).eq(`s found at index ${at} → true`, 'ok').say(`s still appears, starting at ${words(at)}. That means rotating s by ${words(at)} gives s back, which happens exactly when s is a block repeated. With a linear-time search inside, this is linear overall.`);

  v.chapter('optimal', 'Optimal: the period from the lps table', { cx: 'O(n)', code: ['lps = failure table of s', 'l = lps[n − 1]', 'p = n − l  (the period)', 'return l > 0 and n % p == 0'] });
  v.clear();
  const o = v.array('s', [...S], { label: 's' });
  const L = lpsViz(v, o, S, {
    lines: { match: [0], fall: [0], zero: [0] },
    name: 's',
    hold: 450,
    say: (e) => (e.kind === 'zero' && e.i === 1 ? 'Build the failure table of s, exactly as in the lesson. The first characters have no border.' : e.kind === 'match' && e.i === 3 ? 'At position three, a matches the first character and the borders start growing, one per step.' : undefined),
  });
  const l = L[n - 1], p = n - l;
  o.toneRange(0, p - 1, 'ok');
  v.line(1, 2, 3).eq(`l = ${l}, p = ${n} − ${l} = ${p}, ${n} % ${p} = ${n % p} → ${l > 0 && n % p === 0}`, 'ok');
  v.say(`The whole string has a border of length ${words(l)}: its first ${words(l)} characters equal its last ${words(l)}. So shifting s by p, ${words(n)} minus ${words(l)}, which is ${words(p)}, lines it up with itself: s has period ${words(p)}. When the period divides n, s is that block repeated.`);
  v.answer(periodic(S));

  recap(v, [{ name: 'Every divisor length', time: 'O(n · d(n))', space: 'O(1)' }, { name: 's in (s + s)[1 : −1]', time: 'O(n)*', space: 'O(n)' }, { name: 'lps period', time: 'O(n)', space: 'O(n)' }], 'Period p = n − lps[n − 1]; periodic iff p divides n.', ['“Built from a repeated block” → period from lps', 'or the s + s rotation trick'], '* The s + s check is linear only with a linear-time search such as KMP.');
  return v.build();
}

const problem: Problem = {
  slug: 'repeated-substring-pattern',
  statement: 'Given a string `s`, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.',
  examples: [{ input: 's = "abab"', output: 'true' }, { input: 's = "aba"', output: 'false' }, { input: 's = "abcabcabcabc"', output: 'true' }],
  constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of lowercase English letters'],
  hints: ['The block length must divide n.', 'Is s inside (s + s) with the ends removed?', 'lps[n − 1] gives the period.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try block lengths', idea: 'For each divisor len of n, check s[i] == s[i − len] for all i.', time: 'O(n · d(n))', space: 'O(1)', bottleneck: 'One pass per divisor.' },
    { id: 'better', kind: 'better', name: 'Doubling trick', idea: 's is periodic iff s occurs in (s + s)[1 : −1].', time: 'O(n)', space: 'O(n)', bottleneck: 'Relies on the library search.' },
    { id: 'optimal', kind: 'optimal', name: 'KMP period', idea: 'p = n − lps[n − 1]; true iff lps[n − 1] > 0 and n % p == 0.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'The **period** is n − lps[n − 1].',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'repeatedSubstringPattern', params: ['String'], ret: 'boolean',
    tests: [{ args: ['abab'], out: true }, { args: ['aba'], out: false }, { args: ['abcabcabcabc'], out: true }, { args: ['a'], out: false }, { args: ['abaababaab'], out: true }, { args: ['aabaaba'], out: false }, { args: [S], out: true }, { args: ['ab'.repeat(5000)], out: true, big: true }],
    gen: (r: Rng) => { if (r.int(0, 1)) { const b = r.str(r.int(1, 3), 'ab'); return [b.repeat(r.int(1, 4))]; } return [r.str(r.int(1, 10), 'ab')]; },
    ref: (s: string) => periodic(s),
  },
};

export default problem;
