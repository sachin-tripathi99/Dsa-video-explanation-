import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'abbaca';
const solve = (s: string) => { const st: string[] = []; for (const c of s) { if (st.length && st[st.length - 1] === c) st.pop(); else st.push(c); } return st.join(''); };

function video() {
  const v = new Video('remove-adjacent-duplicates', 'Remove All Adjacent Duplicates In String');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 'remove two adjacent equal letters, repeat until none remain' });
  v.say('Repeatedly delete two adjacent equal letters until no such pair remains. Deleting b, b from a, b, b, a, c, a brings the two a’s together, and they go too.');
  v.eq(`"${S}" → "aaca" → "ca"`);

  v.chapter('brute', 'Brute force: rescan after every deletion', { cx: 'O(n²)', code: ['repeat:', '  find any i with s[i] == s[i+1]; delete both', 'until no pair is found'] });
  v.eq('each deletion rebuilds the string and scans again', 'warn').say('Scanning for a pair, deleting it, and starting over can take n scans of length n.');

  v.chapter('optimal', 'Optimal: the stack is the answer being built', { cx: 'O(n)', code: ['st = []', 'for c in s:', '  if st and st[-1] == c: st.pop()', '  else: st.append(c)', 'return "".join(st)'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const st = v.stack('st', [], { label: 'result so far' });
  const cur: string[] = [];
  let told = 0;
  v.say('Build the result on a stack. Each new letter either cancels the top, or is pushed.');
  S.split('').forEach((c, i) => {
    a.clearTones().tone(i, 'active');
    if (cur.length && cur[cur.length - 1] === c) {
      cur.pop();
      st.pop();
      a.tone(i, 'bad');
      v.line(2).eq(`'${c}' = top → pop`, 'bad');
      if (told === 0) { v.say('The second b cancels the b on top.'); told++; }
      else if (told === 1) { v.say('Then a meets the a that is now on top. The cascade happens automatically.'); told++; }
      else v.hold(600);
    } else {
      cur.push(c);
      st.push(c);
      v.line(3).eq(`push '${c}'`).hold(450);
    }
  });
  a.clearTones();
  v.line(4).eq(`"${cur.join('')}"`, 'ok').say('Each letter is pushed once and popped at most once. Linear time.');
  v.answer(solve(S));

  recap(v, [{ name: 'Rescan after each deletion', time: 'O(n²)', space: 'O(n)' }, { name: 'Stack', time: 'O(n)', space: 'O(n)' }], 'The top of the stack is the left neighbour after all deletions so far.', ['Cascading cancellations of neighbours → stack'], 'A stack handles cancellations that expose new neighbours, in one pass.');
  return v.build();
}

const problem: Problem = {
  slug: 'remove-all-adjacent-duplicates-in-string',
  statement: 'You are given a string `s` of lowercase letters. A duplicate removal chooses two adjacent equal letters and removes them. Repeat duplicate removals until no longer possible, and return the final string (it is unique).',
  examples: [{ input: 's = "abbaca"', output: '"ca"' }, { input: 's = "azxxzy"', output: '"ay"' }],
  constraints: ['1 ≤ s.length ≤ 10⁵'],
  hints: ['After a removal, which letters become neighbours?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Rescan after each deletion', idea: 'Find and remove a pair, repeat until none.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Many rescans.' },
    { id: 'optimal', kind: 'optimal', name: 'Stack', idea: 'Pop if the top equals c, else push; join the stack.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Cascading neighbour cancellation → **stack**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'removeDuplicates', params: ['String'], ret: 'String',
    tests: [{ args: ['abbaca'], out: 'ca' }, { args: ['azxxzy'], out: 'ay' }, { args: ['aa'], out: '' }],
    gen: (r: Rng) => [r.str(r.int(1, 14), 'abc')],
    ref: (s: string) => solve(s),
  },
};

export default problem;
