import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const MAP: Record<string, string> = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' };
const D = '23';
function lc(d: string) { if (!d) return []; let out = ['']; for (const c of d) out = out.flatMap((p) => [...MAP[c]].map((ch) => p + ch)); return out; }

function video() {
  const v = new Video('letter-combinations', 'Letter Combinations of a Phone Number');
  v.chapter('intro', 'The problem');
  v.table('k', ['digit', 'letters'], Object.entries(MAP).map(([k, s]) => [k, s]));
  v.say(`Each digit on a phone keypad maps to a few letters. Given the digits ${D.split('').map((x) => words(Number(x))).join(', ')}, return every string you could type by choosing one letter per digit.`);
  v.eq(`"${D}" → ${lc(D).join(' ')}`);

  v.chapter('brute', 'Iterative expansion', { cx: 'O(4ⁿ · n)', code: ['result = [""]', 'for d in digits:', '  result = [p + ch for p in result for ch in letters[d]]'] });
  v.clear();
  let cur = [''];
  const a = v.array('r', ['""'], { label: 'partial strings' });
  v.say('One way: start with the empty string and, for each digit, extend every partial string with every letter of that digit.');
  for (const c of D) {
    cur = cur.flatMap((p) => [...MAP[c]].map((ch) => p + ch));
    a.p.items = []; cur.forEach((x) => a.push(x));
    v.line(2).eq(`after digit ${c}: ${cur.length} strings`).hold(900);
  }
  v.eq('keeps every partial string of a level in memory', 'warn').say('It works, but it stores a whole level of partial strings at once. Backtracking builds one string at a time with only a path of length n.');

  v.chapter('optimal', 'Backtracking: one letter per digit', { cx: 'O(4ⁿ · n)', code: ['def go(i, path):', '  if i == len(digits): record path', '  for ch in letters[digits[i]]:', '    go(i + 1, path + ch)'] });
  v.clear();
  const dt = decisionTree(v, 't', `level i chooses a letter for digit ${D.split('').join(', then ')}`);
  const out: string[] = [];
  let told = 0;
  const go = (i: number, path: string, edge?: string) => {
    const nid = dt.enter(path || '""', edge);
    if (i === D.length) {
      dt.mark(nid, 'ok'); out.push(path);
      v.line(1).counter(`found: ${out.length}`).eq(`record "${path}"`, 'ok');
      if (told === 1) { v.say(`Both digits have a letter: record ${path.split('').join(' ')}.`); told++; } else v.hold(350);
      dt.leave();
      return;
    }
    if (told === 0) { v.line(2).eq(`digit ${D[i]} → try ${MAP[D[i]].split('').join(', ')}`).say(`The first level chooses a letter for ${words(Number(D[i]))}: a, b or c. The second level chooses for ${words(Number(D[1]))}.`); told++; } else v.line(2).hold(300);
    for (const ch of MAP[D[i]]) go(i + 1, path + ch, ch);
    dt.leave();
  };
  go(0, '');
  v.eq(`${out.length} strings = 3 × 3`, 'ok').say(`Nine strings: three choices times three choices. Up to four letters per digit gives four to the n strings, each of length n.`);
  v.answer(lc(D));

  recap(v, [{ name: 'Iterative expansion', time: 'O(4ⁿ · n)', space: 'O(4ⁿ · n)' }, { name: 'Backtracking', time: 'O(4ⁿ · n)', space: 'O(n) extra' }], 'One level per digit; branch on its letters.', ['Cartesian product of choices → one recursion level per position'], 'The answer size is exponential, so the time is too; backtracking keeps memory small.');
  return v.build();
}

const problem: Problem = {
  slug: 'letter-combinations-of-a-phone-number',
  statement: 'Given a string containing digits from `2` to `9`, return all possible letter combinations that the number could represent (phone keypad mapping), in any order. Return an empty list for an empty input.',
  examples: [{ input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }, { input: 'digits = ""', output: '[]' }, { input: 'digits = "2"', output: '["a","b","c"]' }],
  constraints: ['0 ≤ digits.length ≤ 4', "digits[i] in '2'..'9'"],
  hints: ['One recursion level per digit.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Iterative expansion', idea: 'Extend every partial string with every letter of the next digit.', time: 'O(4ⁿ · n)', space: 'O(4ⁿ · n)', bottleneck: 'Stores whole levels.' },
    { id: 'optimal', kind: 'optimal', name: 'Backtracking', idea: 'Recurse over digit positions, appending one letter each.', time: 'O(4ⁿ · n)', space: 'O(n) extra' },
  ],
  pitfalls: ['Empty input must return [], not [""].'],
  takeaway: 'One recursion **level per position**.',
  video,
  videoArgs: [D],
  judge: {
    type: 'fn', fn: 'letterCombinations', params: ['String'], ret: 'List<String>', cmp: 'sorted',
    tests: [{ args: ['23'], out: lc('23') }, { args: [''], out: [] }, { args: ['2'], out: ['a', 'b', 'c'] }, { args: ['79'], out: lc('79') }],
    gen: (r: Rng) => [r.str(r.int(0, 4), '23456789')],
    ref: (d: string) => lc(d),
  },
};

export default problem;
