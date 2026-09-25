import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const W = ['flower', 'flow', 'flight'];

function video() {
  const v = new Video('lcp', 'Longest Common Prefix');
  v.chapter('intro', 'The problem');
  const maxLen = Math.max(...W.map((w) => w.length));
  const g = v.grid('g', W.map((w) => Array.from({ length: maxLen }, (_, i) => w[i] ?? null)), { label: 'one word per row', rowHead: W });
  v.say('Find the longest prefix shared by every word. For flower, flow and flight, it is f l: fl.');

  v.chapter('brute', 'Horizontal: shrink a candidate', { cx: 'O(S)', code: ['prefix = words[0]', 'for w in words[1:]:', '  while not w.startswith(prefix):', '    prefix = prefix[:-1]'] });
  const steps: [string, string][] = [['flower', 'flow'], ['flow', 'flight']];
  let prefix = 'flower';
  v.eq(`prefix = "${prefix}"`).line(0).say('One idea: start with the first word as the candidate, and shrink it until it is a prefix of each next word.');
  for (const [, w] of steps) {
    while (!w.startsWith(prefix)) prefix = prefix.slice(0, -1);
    v.line(3).eq(`vs "${w}" → prefix = "${prefix}"`);
    v.hold(900);
  }
  v.say('Against flow it shrinks to flow, and against flight it shrinks to fl. This is linear in the total number of characters, but it can do a lot of useless comparing when the first word is long and the answer is short.');

  v.chapter('optimal', 'Vertical: compare column by column', { cx: 'O(S)', code: ['for i in 0..len(words[0])-1:', '  c = words[0][i]', '  for w in words:', '    if i == len(w) or w[i] != c: return words[0][:i]', 'return words[0]'] });
  let col = 0;
  let done = false;
  while (!done) {
    const c = W[0][col];
    const bad = W.findIndex((w) => col >= w.length || w[col] !== c);
    for (let r = 0; r < W.length; r++) g.tone(r, col, bad === -1 ? 'ok' : r === bad ? 'bad' : 'cmp');
    v.line(3).eq(bad === -1 ? `column ${col}: all '${c}' ✓` : `column ${col}: '${W[bad][col]}' ≠ '${c}' → stop`, bad === -1 ? 'ok' : 'bad');
    if (col === 0) v.say('Better: compare the words one column at a time. Column zero: all f.');
    else if (bad !== -1) v.say('Column two: o, o, and i. They differ, so stop. The answer is everything before this column: fl.');
    else v.hold(700);
    if (bad !== -1) done = true;
    col++;
  }
  v.note('stops at the first mismatch');
  v.answer('fl');
  v.say('It stops at the first mismatch, so it never looks past the answer plus one column. Both approaches are O of total characters in the worst case.');

  recap(v, [{ name: 'Horizontal shrinking', time: 'O(S)', space: 'O(1)' }, { name: 'Vertical scanning', time: 'O(S)', space: 'O(1)' }], 'S is the total number of characters. Vertical scanning stops as early as possible.', ['Compare many strings position by position → scan columns', 'Stop at the first mismatch or the shortest word'], 'Scanning column by column is the natural way to compare many strings at once.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-common-prefix',
  statement: 'Given an array of strings `strs`, return the **longest common prefix** shared by all of them, or `""` if there is none.',
  examples: [
    { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
    { input: 'strs = ["dog","racecar","car"]', output: '""' },
  ],
  constraints: ['1 ≤ strs.length ≤ 200', '0 ≤ strs[i].length ≤ 200', 'lowercase letters'],
  hints: ['Compare the words one character position at a time.', 'Stop at the first position where they differ or a word ends.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Horizontal scanning', idea: 'Start with the first word and shorten it until it is a prefix of every other word.', time: 'O(S)', space: 'O(1)', bottleneck: 'May compare many characters beyond the final answer.' },
    { id: 'optimal', kind: 'optimal', name: 'Vertical scanning', idea: 'For each index i of the first word, check that every word has the same character at i; stop at the first mismatch or end.', time: 'O(S)', space: 'O(1)' },
  ],
  takeaway: 'To compare many strings, **scan column by column** and stop at the first mismatch.',
  video,
  videoArgs: [W],
  judge: {
    type: 'fn', fn: 'longestCommonPrefix', params: ['String[]'], ret: 'String',
    tests: [{ args: [['flower', 'flow', 'flight']], out: 'fl' }, { args: [['dog', 'racecar', 'car']], out: '' }, { args: [['a']], out: 'a' }, { args: [['', 'b']], out: '' }, { args: [['ab', 'a']], out: 'a' }],
    gen: (r) => { const base = r.str(r.int(0, 5), 'ab'); return [Array.from({ length: r.int(1, 5) }, () => base.slice(0, r.int(0, base.length)) + r.str(r.int(0, 3), 'abc'))]; },
    ref: (w: string[]) => { let p = w[0]; for (const s of w) while (!s.startsWith(p)) p = p.slice(0, -1); return p; },
  },
};

export default problem;
