import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'AABABBA';
const K = 1;

function longest(s: string, k: number) {
  const cnt = new Map<string, number>();
  let l = 0, mx = 0, b = 0;
  for (let r = 0; r < s.length; r++) {
    cnt.set(s[r], (cnt.get(s[r]) ?? 0) + 1);
    mx = Math.max(mx, cnt.get(s[r])!);
    while (r - l + 1 - mx > k) { cnt.set(s[l], cnt.get(s[l])! - 1); l++; }
    b = Math.max(b, r - l + 1);
  }
  return b;
}

function video() {
  const v = new Video('char-replacement', 'Longest Repeating Character Replacement');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: `k = ${K}` });
  v.say(`You may change at most ${K} character into any other letter. What is the longest substring you can make where every letter is the same?`);
  v.eq('a window is fixable if length − (count of its most common letter) ≤ k', 'ok').say('Think about one window. The cheapest plan keeps its most frequent letter and changes everything else. So a window is fixable exactly when its length minus the count of its most common letter is at most k.');

  v.chapter('brute', 'Brute force: every substring', { cx: 'O(n² · 26)', code: ['for i: counts = {}', '  for j from i: counts[s[j]]++', '    if (j − i + 1) − max(counts) <= k: best = max(best, j − i + 1)'] });
  v.eq('n² windows, each check scans 26 counts', 'warn').say('Checking every substring with a count table is n squared, times the alphabet.');

  v.chapter('optimal', 'Optimal: sliding window with counts', { cx: 'O(n)', code: ['for r: count[s[r]] += 1; maxf = max(maxf, count[s[r]])', '  while (r − l + 1) − maxf > k:', '    count[s[l]] −= 1; l += 1', '  best = max(best, r − l + 1)'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: `k = ${K}` });
  const m = v.map('cnt', { label: 'letter counts in the window' });
  const cnt = new Map<string, number>();
  let l = 0;
  let mx = 0;
  let b = 0;
  let told = false;
  v.say('Slide a window, keep counts of each letter inside it, and track the highest count, max f. The window is valid while its length minus max f is at most k.');
  for (let r = 0; r < S.length; r++) {
    cnt.set(S[r], (cnt.get(S[r]) ?? 0) + 1);
    mx = Math.max(mx, cnt.get(S[r])!);
    m.put(S[r], cnt.get(S[r])!).clearTones().tone(S[r], 'active');
    a.clearTones().tone(r, 'ok').win(l, r, 'win', `len ${r - l + 1} − maxf ${mx} = ${r - l + 1 - mx}`);
    if (r - l + 1 - mx > K) {
      v.line(1).eq(`${r - l + 1} − ${mx} = ${r - l + 1 - mx} > ${K} → shrink`, 'bad');
      if (!told) { v.say(`Now the window A, A, B, A, B has length five, and its most common letter appears three times. That means two changes, more than k. Shrink from the left.`); told = true; }
      else v.hold(500);
      while (r - l + 1 - mx > K) { cnt.set(S[l], cnt.get(S[l])! - 1); m.put(S[l], cnt.get(S[l])!); l++; }
      a.win(l, r, 'win', `len ${r - l + 1}`);
    }
    b = Math.max(b, r - l + 1);
    v.line(3).counter(`best: ${b}`).eq(`window "${S.slice(l, r + 1)}", changes needed ${r - l + 1 - Math.max(...cnt.values())}`);
    v.hold(500);
  }
  a.clearTones().noWin();
  v.eq(`best = ${b}`, 'ok').say(`The best window has length ${b}. A subtle detail: max f is never decreased when we shrink. That is safe, because only a window with a higher max f can ever beat the current best length.`);
  v.answer(longest(S, K));

  recap(v, [{ name: 'Every substring', time: 'O(n² · 26)', space: 'O(26)' }, { name: 'Window + counts + maxf', time: 'O(n)', space: 'O(26)' }], 'Valid window: length − most frequent count ≤ k.', ['“Change at most k” → window validity from counts'], 'Turn the operation into a window condition: length minus the most frequent count.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-repeating-character-replacement',
  statement: 'You are given a string `s` of uppercase English letters and an integer `k`. You can choose any character and change it to any other uppercase letter, at most `k` times. Return the length of the longest substring containing the same letter you can get.',
  examples: [{ input: 's = "ABAB", k = 2', output: '4' }, { input: 's = "AABABBA", k = 1', output: '4' }],
  constraints: ['1 ≤ s.length ≤ 10⁵', '0 ≤ k ≤ s.length'],
  hints: ['In a window, which letter should you keep?', 'Valid if windowLength − maxCount ≤ k.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every substring', idea: 'For each start, extend and check length − max count ≤ k.', time: 'O(n² · 26)', space: 'O(26)', bottleneck: 'Quadratic windows.' },
    { id: 'optimal', kind: 'optimal', name: 'Sliding window', idea: 'Track counts and the max count; shrink while length − maxf > k.', time: 'O(n)', space: 'O(26)' },
  ],
  pitfalls: ['Recomputing max over 26 counts each step is fine (O(26n)); not decreasing maxf is an optimisation that still gives the right answer.'],
  takeaway: 'Window valid ⇔ **length − maxFreq ≤ k**.',
  video,
  videoArgs: [S, K],
  judge: {
    type: 'fn', fn: 'characterReplacement', params: ['String', 'int'], ret: 'int',
    tests: [{ args: ['ABAB', 2], out: 4 }, { args: ['AABABBA', 1], out: 4 }, { args: ['A', 0], out: 1 }],
    gen: (r: Rng) => { const s = r.str(r.int(1, 14), 'ABC'); return [s, r.int(0, 3)]; },
    ref: (s: string, k: number) => longest(s, k),
  },
};

export default problem;
