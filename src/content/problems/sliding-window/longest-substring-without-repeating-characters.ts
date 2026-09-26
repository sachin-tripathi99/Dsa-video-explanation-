import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'pwwkew';

function longest(s: string) {
  const last = new Map<string, number>();
  let l = 0, b = 0;
  for (let r = 0; r < s.length; r++) {
    if (last.has(s[r]) && last.get(s[r])! >= l) l = last.get(s[r])! + 1;
    last.set(s[r], r);
    b = Math.max(b, r - l + 1);
  }
  return b;
}

function video() {
  const v = new Video('longest-substring', 'Longest Substring Without Repeating Characters');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: `s = "${S}"` });
  v.say('Find the length of the longest substring, a contiguous piece, that has no repeated characters.');
  v.eq('"wke" has length 3 · "pwke" is not contiguous', 'ok').say('Here the answer is three, for w, k, e. Note that p, w, k, e would be a subsequence, not a substring, because it skips a character.');

  v.chapter('brute', 'Brute force: check every substring', { cx: 'O(n³) or O(n²)', code: ['for i in 0..n−1:', '  seen = {}', '  for j in i..n−1:', '    if s[j] in seen: break', '    seen.add(s[j]); best = max(best, j − i + 1)'] });
  v.eq('start at every i and extend until a repeat', 'warn').say('Starting from every position and extending until a repeat appears is n squared. It throws away everything it learned each time it restarts.');

  v.chapter('better', 'Better: window + set, shrink one step at a time', { cx: 'O(n), up to 2n steps', code: ['for r: while s[r] in set: remove s[l]; l += 1', '  add s[r]; best = max(best, r − l + 1)'] });
  v.eq('each character enters and leaves the set at most once', 'ok').say('The sliding window from the lesson does it in linear time: grow on the right, and when the new character is already inside, remove characters from the left one at a time until it is gone.');

  v.chapter('optimal', 'Optimal: jump l straight past the repeat', { cx: 'O(n), one step per character', code: ['last = {}   # character → last index', 'for r in 0..n−1:', '  if s[r] in last and last[s[r]] >= l: l = last[s[r]] + 1', '  last[s[r]] = r', '  best = max(best, r − l + 1)'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: `s = "${S}"` });
  const m = v.map('last', { label: 'last index of each character' });
  const last = new Map<string, number>();
  let l = 0;
  let b = 0;
  v.say('We can skip the one-by-one shrinking. Remember where each character was last seen. When s of r repeats inside the window, jump l directly to just after that previous position.');
  for (let r = 0; r < S.length; r++) {
    const c = S[r];
    m.clearTones();
    let jumped = false;
    if (last.has(c) && last.get(c)! >= l) {
      const old = l;
      l = last.get(c)! + 1;
      jumped = true;
      m.tone(c, 'bad');
      a.clearTones().tone(r, 'bad').win(l, r, 'win');
      v.line(2).eq(`'${c}' last seen at ${last.get(c)} ≥ l = ${old} → l jumps to ${l}`, 'bad');
      v.say(r === 2 ? `The second w. Its previous position, one, is inside the window, so l jumps to two. Everything before it is dropped at once.` : `${c} was seen at ${last.get(c)}, inside the window. l jumps to ${l}.`);
    }
    last.set(c, r);
    m.put(c, r).tone(c, 'active');
    b = Math.max(b, r - l + 1);
    a.clearTones().tone(r, 'ok').win(l, r, 'win', `len ${r - l + 1}`);
    v.line(3, 4).counter(`best: ${b}`).eq(`window "${S.slice(l, r + 1)}"`);
    if (r === 0) v.say('P goes into the window. Record that p was last seen at zero.');
    else if (!jumped) v.hold(600);
    else v.hold(500);
  }
  a.clearTones().noWin();
  v.eq(`best = ${b}`, 'ok').say(`The check last of c at least l matters: a character seen before the window started is not a repeat. The answer is ${b}.`);
  v.answer(longest(S));

  recap(v, [
    { name: 'Every start, extend', time: 'O(n²)', space: 'O(min(n, Σ))' },
    { name: 'Window + set', time: 'O(n)', space: 'O(min(n, Σ))' },
    { name: 'Window + last index', time: 'O(n)', space: 'O(min(n, Σ))' },
  ], 'Longest valid window: grow right, move l past the repeat.', ['Longest substring with a “no repeats / at most k” rule → variable window'], 'Store the last position of each character, and the left edge can jump instead of crawl.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-substring-without-repeating-characters',
  statement: 'Given a string `s`, find the length of the **longest substring** without repeating characters.',
  examples: [{ input: 's = "abcabcbb"', output: '3', why: '"abc"' }, { input: 's = "bbbbb"', output: '1' }, { input: 's = "pwwkew"', output: '3', why: '"wke"; "pwke" is a subsequence, not a substring.' }],
  constraints: ['0 ≤ s.length ≤ 5 · 10⁴', 'English letters, digits, symbols and spaces'],
  hints: ['Keep a window with no repeats. What do you do when a repeat enters?', 'Remember the last index of each character to jump the left edge.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every start, extend', idea: 'From each i, extend j with a set until a repeat.', time: 'O(n²)', space: 'O(Σ)', bottleneck: 'Restarts from scratch at each i.' },
    { id: 'better', kind: 'better', name: 'Window + set', idea: 'Grow r; while s[r] is in the set, remove s[l] and advance l.', time: 'O(n)', space: 'O(Σ)' },
    { id: 'optimal', kind: 'optimal', name: 'Window + last index', idea: 'If s[r] was last seen at index ≥ l, set l to that index + 1; update last[s[r]] = r.', time: 'O(n)', space: 'O(Σ)' },
  ],
  pitfalls: ['Only jump if the previous occurrence is inside the window (`last ≥ l`), otherwise l would move backwards.'],
  takeaway: 'Longest valid window; **last-seen index** lets l jump.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'lengthOfLongestSubstring', params: ['String'], ret: 'int',
    tests: [{ args: ['abcabcbb'], out: 3 }, { args: ['bbbbb'], out: 1 }, { args: ['pwwkew'], out: 3 }, { args: [''], out: 0 }, { args: ['abba'], out: 2 }, { args: [' '], out: 1 }],
    gen: (r: Rng) => [r.str(r.int(0, 14), 'abcd ')],
    ref: (s: string) => longest(s),
  },
};

export default problem;
