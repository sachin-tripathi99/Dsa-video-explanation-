import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'ab#c';
const T = 'ad#c';

function video() {
  const v = new Video('backspace-compare', 'Backspace String Compare');
  v.chapter('intro', 'The problem');
  v.array('s', [...S], { label: 's' });
  v.array('t', [...T], { label: 't' });
  v.say('Each # means backspace. Typed into an editor, do s and t produce the same text? Here both become a c.');

  v.chapter('brute', 'Build both results with a stack', { cx: 'O(n + m)', code: ['for c in s:', '  if c == "#": pop (if not empty)', '  else: push(c)', 'compare the two stacks'] });
  v.clear().layout('row');
  const a = v.array('s', [...S], { label: 's' });
  const st = v.stack('st', [], { label: 'typed so far', ends: ['cursor', ''] });
  [...S].forEach((c, i) => {
    a.clearTones().tone(i, c === '#' ? 'bad' : 'active');
    if (c === '#') {
      st.pop();
      v.line(1).eq('# → delete the last character', 'bad');
    } else {
      st.push(c).clearTones().toneTop('active');
      v.line(2).eq(`type ${c}`);
    }
    if (i === 0) v.say('Simulate typing with a stack: letters are pushed, and a hash pops the last letter.');
    else v.hold(600);
  });
  v.eq('s → "ac", t → "ac" → equal', 'ok').say('Do the same for t and compare. Linear time, but it builds both strings, using extra memory.');

  v.chapter('optimal', 'Optimal: walk both from the end', { cx: 'O(n + m), O(1) space', code: ['i, j = end of s, end of t', 'loop:', '  move i back to the next real char (skip # and what they delete)', '  same for j', '  compare s[i] and t[j]; if different → false', '  i −= 1; j −= 1'] });
  v.clear();
  const x = v.array('s', [...S], { label: 's' });
  const y = v.array('t', [...T], { label: 't' });
  v.say('To use no extra memory, read both strings backwards. Going backwards, a hash tells us to skip the next real character we meet, so we keep a skip counter.');
  const back = (str: string, i: number) => {
    let skip = 0;
    while (i >= 0) {
      if (str[i] === '#') { skip++; i--; }
      else if (skip > 0) { skip--; i--; }
      else break;
    }
    return i;
  };
  let i = S.length - 1;
  let j = T.length - 1;
  let step = 0;
  for (;;) {
    i = back(S, i);
    j = back(T, j);
    x.clearTones().ptr('i', i >= 0 ? i : null);
    y.clearTones().ptr('j', j >= 0 ? j : null);
    if (i < 0 || j < 0) break;
    x.tone(i, S[i] === T[j] ? 'ok' : 'bad');
    y.tone(j, S[i] === T[j] ? 'ok' : 'bad');
    v.line(4).eq(`${S[i]} vs ${T[j]}`, S[i] === T[j] ? 'ok' : 'bad');
    if (step === 0) v.say('Both end in c: equal.');
    else if (step === 1) v.say('Moving back, each string meets a hash first. The hash deletes the letter before it: b in s, d in t. Both pointers land on a, and a equals a.');
    else v.hold(700);
    i--;
    j--;
    step++;
  }
  v.eq('both ran out together → true', 'ok').say('Both pointers run out together, so the typed texts are equal. Two pointers, constant extra space.');
  v.answer(true);
  recap(v, [{ name: 'Stack simulation', time: 'O(n + m)', space: 'O(n + m)' }, { name: 'Backwards with skip counters', time: 'O(n + m)', space: 'O(1)' }], 'Reading backwards lets each # affect characters we have not seen yet.', ['Deletions affect earlier characters → process from the end', 'Stack when memory is fine, backward scan when it is not'], 'When an operation affects what came before, try processing the input backwards.');
  return v.build();
}

const problem: Problem = {
  slug: 'backspace-string-compare',
  statement: 'Given strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors, where `#` means a backspace. Backspacing an empty text keeps it empty.',
  examples: [{ input: 's = "ab#c", t = "ad#c"', output: 'true' }, { input: 's = "ab##", t = "c#d#"', output: 'true' }, { input: 's = "a#c", t = "b"', output: 'false' }],
  constraints: ['1 ≤ lengths ≤ 200', 'lowercase letters and #'],
  hints: ['A stack simulates typing directly.', 'For O(1) space: walk backwards and count pending backspaces.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Build with a stack', idea: 'Type each string into a stack (letters push, # pops) and compare the results.', time: 'O(n + m)', space: 'O(n + m)', bottleneck: 'Builds both final strings.' },
    { id: 'optimal', kind: 'optimal', name: 'Two pointers from the end', idea: 'Walk both strings backwards; count #s to skip the right number of characters; compare the next real characters.', time: 'O(n + m)', space: 'O(1)' },
  ],
  pitfalls: ['Backspace on empty text must not fail.', 'Only one pointer running out means the strings differ.'],
  takeaway: 'If an operation affects **earlier** characters, **scan from the end**.',
  video,
  videoArgs: [S, T],
  judge: {
    type: 'fn', fn: 'backspaceCompare', params: ['String', 'String'], ret: 'boolean',
    tests: [{ args: ['ab#c', 'ad#c'], out: true }, { args: ['ab##', 'c#d#'], out: true }, { args: ['a#c', 'b'], out: false }, { args: ['a##c', '#a#c'], out: true }, { args: ['bxj##tw', 'bxo#j##tw'], out: true }],
    gen: (r) => [r.str(r.int(1, 8), 'ab##'), r.str(r.int(1, 8), 'ab##')],
    ref: (s: string, t: string) => { const b = (x: string) => { const st: string[] = []; for (const c of x) c === '#' ? st.pop() : st.push(c); return st.join(''); }; return b(s) === b(t); },
    genCount: 50,
  },
};

export default problem;
