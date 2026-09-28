import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { lpsOf, kmpScanViz } from '../../kmpviz';

const A = 'abcd', B = 'cdabcdab';
function rsm(a: string, b: string) { const q = Math.ceil(b.length / a.length); for (let k = q; k <= q + 1; k++) if (a.repeat(k).includes(b)) return k; return -1; }

function video() {
  const v = new Video('repeated-string-match', 'Repeated String Match');
  const ans = rsm(A, B);
  v.chapter('intro', 'The problem');
  v.array('a', [...A], { label: 'a' });
  v.array('b', [...B], { label: 'b' });
  v.say('How many times must we repeat a so that b becomes a substring of the result? If it can never happen, return minus one.');
  v.eq(`${A} × ${ans} = ${A.repeat(ans)} contains ${B} → ${ans}`, 'ok');

  v.chapter('brute', 'Brute force: keep repeating and searching', { cx: 'O(k · (n + m) · m)', code: ['for k = 1, 2, …:', '  t = a repeated k times', '  if b in t: return k', '  stop when |t| > |b| + 2·|a|'] });
  v.clear();
  const t = v.array('t', [...A], { label: 'a repeated k times' });
  for (let k = 1; k <= ans; k++) {
    const s = A.repeat(k);
    t.setAll([...s]).clearTones();
    const at = s.indexOf(B);
    if (at >= 0) t.toneRange(at, at + B.length - 1, 'ok');
    v.line(1, 2).counter(`k = ${k}`).eq(at >= 0 ? `k = ${k}: b found at ${at} → ${k}` : `k = ${k}: “${s}” does not contain b`, at >= 0 ? 'ok' : 'bad');
    if (k === 1) v.say('Keep repeating a and search for b each time. One copy is shorter than b, so it cannot contain it.');
    else if (at < 0) v.say(`${words(k)} copies are as long as b, but b does not appear: it starts with c d, in the middle of a copy.`);
    else v.say(`${words(k)} copies contain b. Each round is a full substring search over a longer text. And when do we give up? b must start inside the first copy of a, so a text of length b plus one more copy of a is always enough.`);
  }

  v.chapter('optimal', 'Optimal: one KMP search over q + 1 copies', { cx: 'O(n + m)', code: ['q = ceil(|b| / |a|)', 't = a repeated q + 1 times', 'KMP-search b in t', 'match ends at i → ceil((i + 1) / |a|)', 'no match → −1'] });
  v.clear();
  const q = Math.ceil(B.length / A.length);
  const T = A.repeat(q + 1);
  const L = lpsOf(B);
  const lb = v.array('b', [...B], { label: 'b with its lps table' });
  lb.subs(L);
  v.line(0, 1).eq(`q = ceil(${B.length} / ${A.length}) = ${q} → search in ${q + 1} copies`).say(`So only two answers are possible: q, the fewest copies as long as b, or q plus one. Here q is ${words(q)}. Build ${words(q + 1)} copies once and run a single KMP search, with the lps table of b.`);
  v.clear();
  const kt = v.array('t', [...T], { label: `a × ${q + 1}` });
  const kp = v.array('p', Array(T.length).fill(null), { label: 'b, aligned', showIdx: false });
  const vars = v.vars('v', { i: 0, j: 0 });
  const r = kmpScanViz(v, kt, kp, T, B, L, {
    lines: { fall: [2], match: [2], skip: [2], found: [3] },
    vars, hold: 420,
    say: (e) => (e.kind === 'skip' && e.i === 0 ? 'The pattern starts with c, so the letters a and b cannot begin a match: i just moves on.' : e.kind === 'match' && e.j === 1 ? 'From c onwards every character matches.' : undefined),
  });
  const end = r.found[0] + B.length;
  kt.clearTones().toneRange(r.found[0], end - 1, 'ok');
  v.line(3).eq(`b ends at index ${end - 1} → ceil(${end} / ${A.length}) = ${Math.ceil(end / A.length)}`, 'ok').say(`b starts at ${words(r.found[0])} and ends at index ${words(end - 1)}, so we need enough copies to cover ${words(end)} characters: ${words(Math.ceil(end / A.length))} copies.`);
  v.answer(ans);

  recap(v, [{ name: 'Repeat and search', time: 'O(k · (n + m) · m)', space: 'O(n + m)' }, { name: 'KMP on q + 1 copies', time: 'O(n + m)', space: 'O(n + m)' }], 'The answer is q or q + 1; one linear search decides.', ['“Repeat until it contains” → bound the text, then one search'], 'q = ceil(|b| / |a|) copies may still miss because of where b starts.');
  return v.build();
}

const problem: Problem = {
  slug: 'repeated-string-match',
  statement: 'Given two strings `a` and `b`, return the minimum number of times you should repeat string `a` so that string `b` is a substring of it. If it is impossible, return -1.',
  examples: [{ input: 'a = "abcd", b = "cdabcdab"', output: '3' }, { input: 'a = "a", b = "aa"', output: '2' }],
  constraints: ['1 ≤ a.length, b.length ≤ 10⁴', 'lowercase English letters'],
  hints: ['b must start inside the first copy of a.', 'Only q = ceil(|b| / |a|) or q + 1 can work.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Repeat and search', idea: 'Try k = 1, 2, … until |a|·k exceeds |b| + 2|a|.', time: 'O(k · (n + m) · m)', space: 'O(n + m)', bottleneck: 'A fresh search every round.' },
    { id: 'optimal', kind: 'optimal', name: 'KMP on q + 1 copies', idea: 'One KMP search; the copies needed follow from where the match ends.', time: 'O(n + m)', space: 'O(n + m)' },
  ],
  takeaway: 'Bound the text, then **one** linear search.',
  video,
  videoArgs: [A, B],
  judge: {
    type: 'fn', fn: 'repeatedStringMatch', params: ['String', 'String'], ret: 'int',
    tests: [{ args: [A, B], out: 3 }, { args: ['a', 'aa'], out: 2 }, { args: ['abc', 'wxyz'], out: -1 }, { args: ['abc', 'cabcabca'], out: 4 }, { args: ['aaaaaaaaaaaaaaaaaaaaaab', 'ba'], out: 2 }, { args: ['abcd', 'bc'], out: 1 }, { args: ['ab', 'ba'.repeat(3000)], out: 3001, big: true }],
    gen: (r: Rng) => { const a = r.str(r.int(1, 4), 'ab'); if (r.int(0, 1)) { const t = a.repeat(6); const s = r.int(0, a.length - 1); return [a, t.slice(s, s + r.int(1, 10))]; } return [a, r.str(r.int(1, 8), 'ab')]; },
    ref: (a: string, b: string) => rsm(a, b),
  },
};

export default problem;
