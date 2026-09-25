import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const S = '  the sky  is blue ';

function video() {
  const v = new Video('reverse-words', 'Reverse Words in a String');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'Reverse the order of the words', lines: [`in:  "${S}"`, 'out: "blue is sky the"', 'single spaces between words, none at the ends'], mono: true });
  v.say('Reverse the order of the words. The input may have extra spaces at the ends or between words; the output must have exactly one space between words.');

  v.chapter('brute', 'Split, reverse, join', { cx: 'O(n)', code: ['words = s.split()', 'reverse(words)', 'return " ".join(words)'] });
  v.clear();
  const words = S.trim().split(/\s+/);
  const w = v.array('w', words, { label: 'words after split' });
  v.line(0).say('The practical answer: split on whitespace, which also drops the extra spaces, reverse the list, and join with single spaces.');
  let l = 0;
  let r = words.length - 1;
  while (l < r) {
    w.swap(l, r).clearTones().tone([l, r], 'warn');
    v.line(1).hold(650);
    l++;
    r--;
  }
  w.clearTones().toneRange(0, words.length - 1, 'ok');
  v.line(2).eq('"blue is sky the"', 'ok').say('Linear time, with O of n extra space for the list of words. In an interview this is often enough, but the follow-up asks: can you do it in place if the string were mutable?');

  v.chapter('optimal', 'In place: reverse all, then each word', { cx: 'O(n)', code: ['clean spaces (one between words, none at ends)', 'reverse the whole char array', 'reverse each word back'] });
  v.clear();
  const clean = words.join(' ');
  const c = v.array('c', [...clean].map((ch) => (ch === ' ' ? '␣' : ch)), { label: 'cleaned characters', showIdx: false });
  v.line(0).say('Treat the string as a character array. First squeeze the spaces, using a write pointer like in remove element.');
  const chars = [...clean];
  const rev = (lo: number, hi: number) => {
    while (lo < hi) {
      [chars[lo], chars[hi]] = [chars[hi], chars[lo]];
      c.swap(lo, hi);
      lo++;
      hi--;
    }
  };
  rev(0, chars.length - 1);
  c.clearTones().toneRange(0, chars.length - 1, 'warn');
  v.line(1).eq(chars.join('')).say('Reverse the whole array. The words are now in the right order, but each word is spelled backwards.');
  let start = 0;
  for (let i = 0; i <= chars.length; i++) {
    if (i === chars.length || chars[i] === ' ') {
      rev(start, i - 1);
      c.toneRange(start, i - 1, 'ok');
      v.line(2).eq(chars.join('')).hold(600);
      start = i + 1;
    }
  }
  v.say('Then reverse each word back. The same reversal trick as rotate array, and only O of one extra space on a mutable array.');
  v.answer(chars.join(''));

  recap(v, [{ name: 'Split, reverse, join', time: 'O(n)', space: 'O(n)' }, { name: 'Reverse all, then each word', time: 'O(n)', space: 'O(1) on a char array' }], 'Both are linear; the reversal trick avoids the word list when the string is mutable.', ['Reverse order of blocks = reverse everything, then each block'], 'Double reversal again: reverse the whole thing, then fix each piece.');
  return v.build();
}

const problem: Problem = {
  slug: 'reverse-words-in-a-string',
  statement: 'Given a string `s`, reverse the **order of the words**. Words are sequences of non-space characters. The result must have words separated by a **single space**, with no leading or trailing spaces.',
  examples: [
    { input: 's = "the sky is blue"', output: '"blue is sky the"' },
    { input: 's = "  hello world  "', output: '"world hello"' },
    { input: 's = "a good   example"', output: '"example good a"' },
  ],
  constraints: ['1 ≤ s.length ≤ 10⁴', 'at least one word'],
  hints: ['Most languages can split on whitespace for you.', 'In place: what happens if you reverse the whole string first?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Split, reverse, join', idea: 'Split on whitespace (dropping empties), reverse the list of words, join with single spaces.', time: 'O(n)', space: 'O(n)', bottleneck: 'Allocates a list of words.' },
    { id: 'optimal', kind: 'optimal', name: 'Reverse the whole array, then each word', idea: 'On a character array: compact spaces with a write pointer, reverse everything, then reverse each word.', time: 'O(n)', space: 'O(1) extra on a mutable array (Java/Python still copy the string once)' },
  ],
  pitfalls: ['Multiple spaces between words produce empty strings if you split on a single space.'],
  takeaway: 'To reverse the order of blocks in place, **reverse everything, then reverse each block**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'reverseWords', params: ['String'], ret: 'String',
    tests: [{ args: ['the sky is blue'], out: 'blue is sky the' }, { args: ['  hello world  '], out: 'world hello' }, { args: ['a good   example'], out: 'example good a' }, { args: ['x'], out: 'x' }],
    gen: (r) => { const w = Array.from({ length: r.int(1, 5) }, () => r.str(r.int(1, 5), 'abcde')); return [' '.repeat(r.int(0, 2)) + w.join(' '.repeat(r.int(1, 3))) + ' '.repeat(r.int(0, 2))]; },
    ref: (s: string) => s.trim().split(/\s+/).reverse().join(' '),
  },
};

export default problem;
