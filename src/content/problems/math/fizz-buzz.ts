import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const N = 15;

function video() {
  const v = new Video('fizz-buzz', 'Fizz Buzz');
  v.chapter('intro', 'The problem');
  const nums = v.array('n', Array.from({ length: N }, (_, i) => i + 1), { label: 'i from 1 to 15' });
  v.say('For every number from one to n, output Fizz if it is divisible by three, Buzz if divisible by five, FizzBuzz if divisible by both, and otherwise the number itself.');

  v.chapter('brute', 'Straightforward checks', { cx: 'O(n)', code: ['for i in 1..n:', '  if i % 15 == 0: "FizzBuzz"', '  elif i % 3 == 0: "Fizz"', '  elif i % 5 == 0: "Buzz"', '  else: str(i)'] });
  const out = v.array('out', Array(N).fill(null), { label: 'answer' });
  const res: string[] = [];
  for (let i = 1; i <= N; i++) {
    const s = i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : String(i);
    res.push(s);
    out.set(i - 1, s === 'FizzBuzz' ? 'FB' : s === 'Fizz' ? 'Fz' : s === 'Buzz' ? 'Bz' : s);
    nums.clearTones().ptr('i', i - 1).tone(i - 1, 'active');
    out.clearTones().tone(i - 1, s === String(i) ? 'done' : s === 'FizzBuzz' ? 'ok' : 'warn');
    v.line(i % 15 === 0 ? 1 : i % 3 === 0 ? 2 : i % 5 === 0 ? 3 : 4).eq(`${i} → ${s}`);
    if (i === 3) v.say('Three is divisible by three: Fizz.');
    else if (i === 15) v.say('Fifteen is divisible by both, which is why we check fifteen first. If we checked three first, we would wrongly print just Fizz.');
    else if (i === 1) v.say('Go through the numbers once. One is not divisible by three or five, so it stays one.');
    else v.hold(420);
  }
  v.note('order of checks matters');

  v.chapter('optimal', 'Cleaner: build the word', { cx: 'O(n)', code: ['for i in 1..n:', '  s = ""', '  if i % 3 == 0: s += "Fizz"', '  if i % 5 == 0: s += "Buzz"', '  if s is empty: s = str(i)'] });
  v.clear();
  v.text('w', { title: 'Why build the word?', lines: ['No special case for 15: Fizz + Buzz = FizzBuzz', 'Adding "7 → Bazz" is one more line, not four more branches', 'Same O(n) time; output takes O(n) space'] });
  v.say('A neater version builds the word: add Fizz if divisible by three, add Buzz if divisible by five. Fifteen naturally becomes FizzBuzz, and adding a new rule is one line. Both are O of n.');
  v.answer(res);

  recap(v, [{ name: 'if / else with % 15 first', time: 'O(n)', space: 'O(1) extra' }, { name: 'Concatenate Fizz and Buzz', time: 'O(n)', space: 'O(1) extra' }], 'Both solutions touch each number once.', ['Check the most specific case first, or build the answer from parts', '`i % k == 0` means divisible by k'], 'The lesson here is small but real: order your conditions from most specific to least, or compose the answer from independent parts.');
  return v.build();
}

const problem: Problem = {
  slug: 'fizz-buzz',
  statement: 'Given `n`, return a list of strings `answer` (1-indexed) where `answer[i]` is `"FizzBuzz"` if `i` is divisible by 3 and 5, `"Fizz"` if divisible by 3, `"Buzz"` if divisible by 5, and otherwise `i` as a string.',
  examples: [
    { input: 'n = 3', output: '["1","2","Fizz"]' },
    { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' },
    { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
  ],
  constraints: ['1 ≤ n ≤ 10⁴'],
  hints: ['What happens at 15 if you check divisibility by 3 first?', 'Try building the string from "Fizz" and "Buzz" parts.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Branches, most specific first', idea: 'Check `% 15` first, then `% 3`, then `% 5`, else the number.', time: 'O(n)', space: 'O(1) extra', bottleneck: 'Already optimal in time; the next version is just easier to extend.' },
    { id: 'optimal', kind: 'optimal', name: 'Concatenate the parts', idea: 'Start with an empty string; append "Fizz" if divisible by 3 and "Buzz" if divisible by 5; if still empty use the number.', time: 'O(n)', space: 'O(1) extra' },
  ],
  pitfalls: ['Checking `% 3` before `% 15` prints "Fizz" for 15.', 'Starting the loop at 0 instead of 1.'],
  takeaway: 'Order conditions from **most specific to least**, or compose the answer from independent parts.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'fizzBuzz', params: ['int'], ret: 'List<String>',
    tests: [{ args: [3], out: ['1', '2', 'Fizz'] }, { args: [5], out: ['1', '2', 'Fizz', '4', 'Buzz'] }, { args: [1], out: ['1'] }],
    gen: (r) => [r.int(1, 60)],
    ref: (n: number) => Array.from({ length: n }, (_, k) => { const i = k + 1; return i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : String(i); }),
    genCount: 8,
  },
};

export default problem;
