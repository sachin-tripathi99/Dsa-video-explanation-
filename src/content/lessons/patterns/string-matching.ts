import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { lpsOf, lpsViz, kmpScanViz } from '../../kmpviz';

const T = 'abababaca';
const P = 'ababaca';

function video() {
  const v = new Video('string-matching', 'KMP and rolling hashes');
  const L = lpsOf(P);

  v.chapter('intro', 'Finding a pattern in text');
  const t = v.array('t', [...T], { label: 'text' });
  const pa = v.array('p', [...P, null, null], { label: 'pattern at start 0', showIdx: false });
  v.say('Where does a pattern occur inside a text? Think of searching a long document for a word. The obvious way lines the pattern up at each start and compares character by character.');
  t.toneRange(0, 4, 'ok').tone(5, 'bad');
  pa.toneRange(0, 4, 'ok').tone(5, 'bad');
  v.eq('start 0: 5 characters match, then b ≠ c', 'bad').say('At start zero, five characters match, then the text has b where the pattern has c.');
  pa.setAll([null, ...P, null]);
  t.clearTones().toneRange(1, 5, 'dim');
  pa.clearTones();
  v.eq('slide by 1 and re-read characters already seen', 'warn').say('Brute force now slides the pattern by one and compares from scratch, re-reading characters it has already looked at. In the worst case that costs n times m comparisons.');

  v.chapter('lps', 'The failure table: borders', { code: ['lps[0] = 0, len = 0', 'for i = 1 .. m − 1:', '  if p[i] == p[len]:', '    len += 1; lps[i] = len', '  elif len > 0: len = lps[len − 1]', '  else: lps[i] = 0'] });
  v.clear();
  const la = v.array('p', [...P], { label: 'pattern' });
  la.toneRange(0, 2, 'win').toneRange(2, 4, 'ok');
  v.eq('“ababa”: prefix aba = suffix aba → border 3');
  v.say('The fix comes from studying the pattern alone. A border of a string is a proper prefix that is also a suffix. The prefix a b a b a starts with a b a and ends with a b a, so its longest border has length three.');
  la.clearTones();
  v.say('Why care? If we matched a b a b a and then failed, the text we just read ends with a b a, which is also how the pattern begins. So we can keep going as if we had already matched three characters. The table lps stores the longest border of every prefix.');
  lpsViz(v, la, P, {
    lines: { match: [2, 3], fall: [4], zero: [5] },
    say: (e) => {
      if (e.kind === 'zero' && e.i === 1) return 'Build it left to right. len is the border we are trying to extend, i the new character. Position one: b against a, no match and nothing to fall back to, so zero.';
      if (e.kind === 'match' && e.i === 2) return 'Position two: a matches the first character, so the border grows to one.';
      if (e.kind === 'match' && e.i === 4) return undefined;
      if (e.kind === 'fall' && e.from === 3) return 'Position five: c does not match b, the character after the border a b a. The next shorter border we can try is the border of a b a itself, which is a, length one. This is the same fall-back that the search will use.';
      if (e.kind === 'fall' && e.from === 1) return 'c does not match b either. Fall back once more, to length zero.';
      return undefined;
    },
  });
  v.eq(`lps = [${L.join(', ')}]`, 'ok').say(`The finished table: ${L.join(', ')}. Every step either moves i forward or shrinks len, and len can only shrink as much as it grew, so building it takes linear time.`);

  v.chapter('search', 'The search: the text pointer never goes back', { cx: 'O(n + m)', code: ['j = 0', 'for i, c in enumerate(text):', '  while j > 0 and c ≠ p[j]: j = lps[j − 1]', '  if c == p[j]: j += 1', '  if j == m: found at i − m + 1'] });
  v.clear();
  const kt = v.array('t', [...T], { label: 'text' });
  const kp = v.array('p', Array(T.length).fill(null), { label: 'pattern, aligned at i − j', showIdx: false });
  const vars = v.vars('v', { i: 0, j: 0 });
  const r = kmpScanViz(v, kt, kp, T, P, L, {
    lines: { fall: [2], match: [3], skip: [3], found: [4] },
    vars,
    hold: 480,
    say: (e) => {
      if (e.kind === 'match' && e.i === 0) return 'Now scan the text once. j counts how many pattern characters currently match. Each text character that matches moves j forward.';
      if (e.kind === 'fall' && e.first) return `Mismatch at i ${words(e.i)}, with j at ${words(e.from)}. Instead of moving back in the text, jump j to lps of ${words(e.from - 1)}, which is ${words(e.j)}. The pattern slides right to line its prefix a b a up with the a b a we just read, and we compare the same text character again.`;
      if (e.kind === 'found') return `j reaches the pattern length: a match starting at ${words(e.i - P.length + 1)}. The text pointer never moved backwards, so the whole search is linear: order n plus m.`;
      return undefined;
    },
  });
  v.answer(r.found[0]);

  v.chapter('hash', 'Rolling hash: compare numbers, not strings', { cx: 'O(n + m) expected', code: ['h = value of the first window', 'slide: h = (h − first · 10ᵐ⁻¹) · 10 + next', 'h == target → confirm by comparing'] });
  v.clear();
  const D = '31415926', Q = '1592', m = Q.length;
  const target = Number(Q);
  const da = v.array('d', [...D], { label: 'text (digits)' });
  const hv = v.vars('h', { target, window: Number(D.slice(0, m)) });
  da.win(0, m - 1);
  v.line(0).say('Rabin-Karp turns each window into a number. With digits it is easy to see: the window three one four one is the number three thousand one hundred forty-one, and the pattern is one thousand five hundred ninety-two.');
  let h = Number(D.slice(0, m));
  for (let s = 1; s + m <= D.length; s++) {
    const out = Number(D[s - 1]), inn = Number(D[s + m - 1]);
    const was = h;
    h = (h - out * 10 ** (m - 1)) * 10 + inn;
    da.win(s, s + m - 1);
    const hit = h === target;
    hv.set({ target, window: h }, hit ? 'ok' : undefined);
    if (hit) da.clearTones().toneRange(s, s + m - 1, 'ok');
    v.line(hit ? 2 : 1).eq(`(${was} − ${out}·${10 ** (m - 1)}) · 10 + ${inn} = ${h}${hit ? ' = target' : ''}`, hit ? 'ok' : undefined);
    if (s === 1) v.say(`Sliding one step does not recompute the window. Remove the leading ${words(out)} thousand, shift by multiplying by ten, and add the new digit, ${words(inn)}. Constant work per step.`);
    else if (hit) v.say(`The window value equals the target at start ${words(s)}. For letters we use a larger base such as thirty-one and take everything modulo a big prime to keep numbers small. Different strings can then collide, so on equal hashes we confirm with a real comparison.`);
    else v.hold(800);
  }

  v.chapter('table', 'Recognising string matching');
  v.clear();
  v.table('t', ['Clue', 'Tool'], [
    ['find pattern in text in linear time', 'KMP search'],
    ['longest prefix that is also a suffix', 'lps[n − 1]'],
    ['is s made of a repeated block?', 'p = n − lps[n − 1]; n % p == 0'],
    ['longest palindromic prefix', 'lps of s + "#" + reverse(s)'],
    ['compare many substrings quickly', 'rolling hash / prefix hashes'],
  ]);
  v.say('The lps table answers more than search. Its last value is the longest border of the whole string, which solves periodic-string and palindrome-prefix problems in one pass.');
  return v.build();
}

const body = String.raw`
## Borders and the lps table

A **border** of a string is a proper prefix that is also a suffix. \`lps[i]\` is the length of the longest border of \`p[0..i]\`.

| p | a | b | a | b | a | c | a |
|---|---|---|---|---|---|---|---|
| lps | 0 | 0 | 1 | 2 | 3 | 0 | 1 |

> Real-life picture: you are reading a word aloud and stumble. Instead of restarting from the first letter, you restart from the longest part you have already said that is also how the word begins.

## KMP

\`\`\`java
int[] lps(String p) {
    int[] lps = new int[p.length()];
    for (int i = 1, len = 0; i < p.length(); ) {
        if (p.charAt(i) == p.charAt(len)) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];             // fall back to a shorter border
        else lps[i++] = 0;
    }
    return lps;
}

int search(String t, String p) {
    int[] lps = lps(p);
    for (int i = 0, j = 0; i < t.length(); i++) {
        while (j > 0 && t.charAt(i) != p.charAt(j)) j = lps[j - 1];
        if (t.charAt(i) == p.charAt(j)) j++;
        if (j == p.length()) return i - j + 1;
    }
    return -1;
}
\`\`\`

\`\`\`python
def lps_of(p):
    lps, length = [0] * len(p), 0
    for i in range(1, len(p)):
        while length and p[i] != p[length]:
            length = lps[length - 1]              # fall back to a shorter border
        if p[i] == p[length]:
            length += 1
        lps[i] = length
    return lps

def search(t, p):
    lps, j = lps_of(p), 0
    for i, c in enumerate(t):
        while j and c != p[j]:
            j = lps[j - 1]
        if c == p[j]:
            j += 1
        if j == len(p):
            return i - j + 1
    return -1
\`\`\`

\`\`\`cpp
vector<int> lpsOf(const string& p) {
    vector<int> lps(p.size());
    for (int i = 1, len = 0; i < (int)p.size(); ) {
        if (p[i] == p[len]) lps[i++] = ++len;
        else if (len) len = lps[len - 1];                  // fall back to a shorter border
        else lps[i++] = 0;
    }
    return lps;
}
\`\`\`

## Rolling hash (Rabin-Karp)

Treat a window as a number in base B modulo a prime M. Sliding right: \`h = ((h − first · B^(m−1)) · B + next) mod M\`. Equal hashes **probably** mean equal strings, so confirm with a direct comparison (or use two moduli).

## Tricks built on lps

- Longest happy prefix: \`s[0 : lps[n − 1]]\`.
- Repeated block: \`p = n − lps[n − 1]\`; the string is periodic iff \`lps[n − 1] > 0\` and \`n % p == 0\`.
- Longest palindromic prefix: the last lps value of \`s + "#" + reverse(s)\`. The separator stops a border from crossing over.

## Pitfalls

- Off-by-one in the fall-back: it is \`lps[j − 1]\`, not \`lps[j]\`.
- In Python, \`in\` / \`find\` are fine for interviews unless the interviewer asks for KMP.
- Hash overflow: use \`long\` and take the modulo after every multiply.
`;

const lesson: Lesson = {
  slug: 'string-matching',
  video,
  body,
  quiz: [
    { q: 'lps of "aabaa" (last value)?', options: ['1', '2', '3', '4'], answer: 1, why: '"aa" is both a prefix and a suffix; "aab" ≠ "baa".' },
    { q: 'On a mismatch with j > 0, KMP sets…', options: ['i = i − j + 1', 'j = lps[j − 1]', 'j = 0', 'i = 0'], answer: 1, why: 'The text pointer stays; the pattern falls back to its border.' },
    { q: 'KMP search runs in…', options: ['O(n · m)', 'O(n + m)', 'O(n log m)', 'O(m²)'], answer: 1, why: 'i only moves forward and j falls back at most as much as it rose.' },
    { q: 'Why confirm a rolling-hash match?', options: ['Hashes are slow', 'Different strings can share a hash', 'It is required by the modulo', 'To find the next window'], answer: 1, why: 'Collisions are rare but possible.' },
  ],
};

export default lesson;
