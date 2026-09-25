import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'fly me   to   the moon  ';

function video() {
  const v = new Video('length-of-last-word', 'Length of Last Word');
  v.chapter('intro', 'The problem');
  const a = v.array('s', [...S].map((c) => (c === ' ' ? '␣' : c)), { label: 's (spaces shown as ␣)', showIdx: false });
  v.say('Return the length of the last word in the string. Words are separated by spaces, and there may be extra spaces anywhere, including at the end.');

  v.chapter('brute', 'Brute force: split into words', { cx: 'O(n)', code: ['words = s.split()', 'return len(words[-1])'] });
  v.eq('split → [fly, me, to, the, moon] → "moon" → 4').say('Easiest: split into words and measure the last one. It is linear, but builds a whole list of words just to use one.');

  v.chapter('optimal', 'Optimal: scan from the end', { cx: 'O(n)', code: ['i = n − 1', 'while s[i] == " ": i −= 1       (skip trailing spaces)', 'length = 0', 'while i >= 0 and s[i] != " ":', '  length += 1; i −= 1'] });
  let i = S.length - 1;
  while (S[i] === ' ') {
    a.clearTones().ptr('i', i).tone(i, 'dim');
    v.line(1).hold(400);
    i--;
  }
  v.say('Start at the end. Skip the trailing spaces first.');
  let len = 0;
  while (i >= 0 && S[i] !== ' ') {
    len++;
    a.ptr('i', i).tone(i, 'ok');
    v.line(4).counter(`length: ${len}`);
    if (len === 1) v.say('Then count characters until the next space.');
    else v.hold(420);
    i--;
  }
  a.noPtr();
  v.eq(`"moon" → ${len}`, 'ok').say('Moon has four letters. We only touched the end of the string and used no extra memory.');
  v.answer(len);

  recap(v, [{ name: 'Split into words', time: 'O(n)', space: 'O(n)' }, { name: 'Scan from the end', time: 'O(n)', space: 'O(1)' }], 'Scanning from the end avoids building a list of words.', ['Answer at the end of the input → scan backwards', 'Skip trailing spaces first'], 'If the answer lives at the end, start at the end.');
  return v.build();
}

const problem: Problem = {
  slug: 'length-of-last-word',
  statement: 'Given a string `s` of words and spaces, return the length of the **last word**. A word is a maximal run of non-space characters. There is at least one word.',
  examples: [
    { input: 's = "Hello World"', output: '5' },
    { input: 's = "   fly me   to   the moon  "', output: '4' },
    { input: 's = "luffy is still joyboy"', output: '6' },
  ],
  constraints: ['1 ≤ s.length ≤ 10⁴', 'English letters and spaces only'],
  hints: ['Watch out for trailing spaces.', 'You only care about the end of the string.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Split into words', idea: 'Split on whitespace and return the length of the last piece.', time: 'O(n)', space: 'O(n)', bottleneck: 'Builds every word just to use the last one.' },
    { id: 'optimal', kind: 'optimal', name: 'Scan backwards', idea: 'From the end, skip spaces, then count non-space characters until a space or the start.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Trailing spaces: "moon  " must still give 4.'],
  takeaway: 'When the answer is at the **end**, scan **backwards** and stop early.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'lengthOfLastWord', params: ['String'], ret: 'int',
    tests: [{ args: ['Hello World'], out: 5 }, { args: ['   fly me   to   the moon  '], out: 4 }, { args: ['luffy is still joyboy'], out: 6 }, { args: ['a'], out: 1 }],
    gen: (r) => { const w = Array.from({ length: r.int(1, 5) }, () => r.str(r.int(1, 6), 'abcxyz')); return [' '.repeat(r.int(0, 2)) + w.join(' '.repeat(r.int(1, 3))) + ' '.repeat(r.int(0, 3))]; },
    ref: (s: string) => s.trim().split(/\s+/).pop()!.length,
  },
};

export default problem;
