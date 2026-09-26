import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = '3+2*2-8/3';
function calc(s: string) {
  const st: number[] = [];
  let num = 0, op = '+';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c >= '0' && c <= '9') num = num * 10 + Number(c);
    if ((c < '0' || c > '9') && c !== ' ' || i === s.length - 1) {
      if (op === '+') st.push(num); else if (op === '-') st.push(-num); else if (op === '*') st.push(st.pop()! * num); else st.push(Math.trunc(st.pop()! / num));
      op = c; num = 0;
    }
  }
  return st.reduce((a, b) => a + b, 0);
}

function video() {
  const v = new Video('basic-calculator-ii', 'Basic Calculator II');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 'non-negative integers, + − × ÷, spaces; ÷ truncates toward zero' });
  v.say('Evaluate an expression with plus, minus, times and divide, following normal precedence. Division truncates toward zero. No eval allowed.');
  v.eq(`${S.replace(/\*/g, ' × ').replace(/\//g, ' ÷ ').replace(/\+/g, ' + ').replace(/-/g, ' − ')} = ${calc(S)}`);

  v.chapter('brute', 'Brute force: two passes over tokens', { cx: 'O(n) · O(n)', code: ['tokenise into numbers and operators', 'pass 1: resolve every × and ÷ left to right', 'pass 2: add and subtract what remains'] });
  v.eq('3 + 2×2 − 8÷3 → 3 + 4 − 2 → 5', 'ok').say('Precedence says: first all multiplications and divisions, then additions and subtractions. Two passes over a token list do exactly that, with a list of tokens as extra memory.');

  v.chapter('optimal', 'Optimal: one pass, keep only the last term', { cx: 'O(n) · O(1)', code: ['result = 0; last = 0; op = "+"', 'on each number n (with the operator before it):', '  + → result += last; last = n     − → result += last; last = −n', '  × → last = last × n              ÷ → last = trunc(last / n)', 'answer = result + last'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const vars = v.vars('v', { result: 0, last: 0, op: '+' });
  let result = 0;
  let last = 0;
  let op = '+';
  let num = 0;
  v.say('A stack of terms works, but the only term that can still change is the most recent one, because only times and divide modify it. So keep a running result of finished terms and the last, still open term.');
  for (let i = 0; i < S.length; i++) {
    const c = S[i];
    if (c >= '0' && c <= '9') num = num * 10 + Number(c);
    const end = i === S.length - 1;
    if (!(c >= '0' && c <= '9') || end) {
      a.clearTones().tone(i, 'active');
      if (op === '+' || op === '-') {
        result += last;
        last = op === '+' ? num : -num;
        v.line(2).eq(`${op}${num}: close previous term → result ${result}; last = ${last}`);
      } else if (op === '*') {
        last = last * num;
        v.line(3).eq(`×${num}: last = ${last}`, 'warn');
      } else {
        const before = last;
        last = Math.trunc(last / num);
        v.line(3).eq(`÷${num}: last = trunc(${before} / ${num}) = ${last}`, 'warn');
      }
      vars.set({ result, last, op: end ? '—' : c });
      if (op === '*') v.say('Times two only changes the open term: two becomes four.');
      else if (op === '/') v.say(`Divide by three: eight divided by three is two point six six, truncated to two. Because the minus was stored in the term, the term is minus two.`);
      else v.hold(600);
      op = c;
      num = 0;
    }
  }
  const ans = result + last;
  v.line(4).eq(`${result} + (${last}) = ${ans}`, 'ok').say(`At the end, add the last open term to the result: ${ans}. One pass, constant memory.`);
  v.answer(calc(S));

  recap(v, [{ name: 'Tokens, two passes', time: 'O(n)', space: 'O(n)' }, { name: 'One pass, last term', time: 'O(n)', space: 'O(1)' }], 'Only the last term can still change; × ÷ modify it, + − close it.', ['Precedence without parentheses → running result + last term (or a stack)'], 'Precedence means “some operations bind to the latest term”. Keep that term open.');
  return v.build();
}

const problem: Problem = {
  slug: 'basic-calculator-ii',
  statement: 'Given a string `s` which represents a valid expression of non-negative integers, `+`, `-`, `*`, `/` and spaces, evaluate it and return its value. Integer division truncates toward zero. You may not use built-in evaluation functions.',
  examples: [{ input: 's = "3+2*2"', output: '7' }, { input: 's = " 3/2 "', output: '1' }, { input: 's = " 3+5 / 2 "', output: '5' }],
  constraints: ['1 ≤ s.length ≤ 3 · 10⁵', 'all intermediate results fit in 32 bits'],
  hints: ['× and ÷ bind to the most recent number.', 'You only need to keep the last term open.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Tokens, two passes', idea: 'Tokenise; fold × and ÷ into a list; sum the list.', time: 'O(n)', space: 'O(n)', bottleneck: 'Stores all tokens.' },
    { id: 'optimal', kind: 'optimal', name: 'One pass, last term', idea: 'Keep result and last; + and − move last into result; × and ÷ update last.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Process the final number at the last index.', 'Truncate toward zero: in Python use int(a / b), not a // b, for negatives.'],
  takeaway: 'Precedence = keep the **last term open**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'calculate', params: ['String'], ret: 'int',
    tests: [{ args: ['3+2*2'], out: 7 }, { args: [' 3/2 '], out: 1 }, { args: [' 3+5 / 2 '], out: 5 }, { args: ['14-3/2'], out: 13 }, { args: ['1-1*2-5/2'], out: -3 }],
    gen: (r: Rng) => { let s = String(r.int(0, 20)); for (let k = 0; k < r.int(0, 5); k++) { const op = r.pick(['+', '-', '*', '/']); s += (r.chance(0.3) ? ' ' : '') + op + String(op === '/' ? r.int(1, 9) : r.int(0, 20)); } return [s]; },
    ref: (s: string) => calc(s),
  },
};

export default problem;
