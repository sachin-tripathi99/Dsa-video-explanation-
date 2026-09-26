import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = '1-(4+5-(2-3))+6';
function calc(s: string) {
  let result = 0, sign = 1, num = 0;
  const st: number[] = [];
  for (const c of s) {
    if (c >= '0' && c <= '9') num = num * 10 + Number(c);
    else if (c === '+' || c === '-') { result += sign * num; num = 0; sign = c === '+' ? 1 : -1; }
    else if (c === '(') { st.push(result, sign); result = 0; sign = 1; }
    else if (c === ')') { result += sign * num; num = 0; const sg = st.pop()!; const prev = st.pop()!; result = prev + sg * result; }
  }
  return result + sign * num;
}

function video() {
  const v = new Video('basic-calculator', 'Basic Calculator');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 'digits, + −, parentheses, spaces; − may be unary' });
  v.say('Evaluate an expression with plus, minus and parentheses. A minus in front of a bracket flips the sign of everything inside it.');
  v.eq(`${S} = ${calc(S)}`);

  v.chapter('brute', 'Brute force: recursive evaluation / shunting-yard', { cx: 'O(n) · O(n)', code: ['evaluate(i): read terms until ")"; on "(" call evaluate recursively', '(or convert to postfix and evaluate with a stack)'] });
  v.eq('recursion mirrors the nesting, one call per bracket', 'ok').say('A natural approach recurses: when you meet an opening bracket, evaluate the inside with a recursive call and use its value as a number. That works well; the iterative version below keeps the same information on an explicit stack.');

  v.chapter('optimal', 'Iterative: stack of (result, sign) at each "("', { cx: 'O(n)', code: ['result = 0; sign = +1', 'digit → build num', '+ / − → result += sign·num; sign = ±1', '"(" → push result, push sign; result = 0; sign = +1', '")" → result += sign·num; result = popped result + popped sign × result'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const st = v.stack('st', [], { label: 'saved (result, sign) before each "("' });
  const vars = v.vars('v', { result: 0, sign: '+1', num: 0 });
  let result = 0;
  let sign = 1;
  let num = 0;
  const stack: number[] = [];
  let told = 0;
  v.say('Without brackets, keep a running result and the sign of the next number. An opening bracket starts a fresh sub-expression, so save the result so far and the sign in front of the bracket.');
  [...S].forEach((c, i) => {
    a.clearTones().tone(i, 'active');
    if (c >= '0' && c <= '9') { num = num * 10 + Number(c); v.line(1).hold(300); }
    else if (c === '+' || c === '-') { result += sign * num; num = 0; sign = c === '+' ? 1 : -1; v.line(2).eq(`result = ${result}, next sign ${c}`).hold(550); }
    else if (c === '(') {
      stack.push(result, sign);
      st.push(`(${result}, ${sign > 0 ? '+' : '−'})`);
      v.line(3).eq(`save (${result}, ${sign > 0 ? '+' : '−'}); start fresh`, 'warn');
      if (told === 0) { v.say(`An opening bracket after a minus. Save result ${result} and the minus sign, then evaluate the inside from zero.`); told++; } else v.hold(700);
      result = 0;
      sign = 1;
    } else if (c === ')') {
      result += sign * num;
      num = 0;
      const sg = stack.pop()!;
      const prev = stack.pop()!;
      st.pop();
      const inner = result;
      result = prev + sg * result;
      v.line(4).eq(`inside = ${inner} → ${prev} ${sg > 0 ? '+' : '−'} ${inner < 0 ? `(${inner})` : inner} = ${result}`, 'ok');
      if (told === 1) { v.say(`The inner bracket, two minus three, is minus one. It was preceded by a minus, so the saved result, nine, becomes nine minus minus one: ten.`); told++; } else v.hold(800);
    }
    vars.set({ result, sign: sign > 0 ? '+1' : '−1', num });
  });
  const ans = result + sign * num;
  v.eq(`${result} + ${sign * num} = ${ans}`, 'ok').say(`Add the last number: ${ans}.`);
  v.answer(calc(S));

  recap(v, [{ name: 'Recursive evaluation', time: 'O(n)', space: 'O(depth)' }, { name: 'Stack of (result, sign)', time: 'O(n)', space: 'O(depth)' }], 'On “(” save the outer result and sign; on “)” combine.', ['Parentheses → push context on “(”, pop on “)”'], 'Brackets are nesting, and nesting is a stack.');
  return v.build();
}

const problem: Problem = {
  slug: 'basic-calculator',
  statement: 'Given a string `s` representing a valid expression containing digits, `+`, `-`, `(`, `)` and spaces, evaluate it. `-` can be used as a unary operator (e.g. `-1` or `-(2 + 3)`), but `+` is never unary. You may not use built-in evaluation functions.',
  examples: [{ input: 's = "1 + 1"', output: '2' }, { input: 's = " 2-1 + 2 "', output: '3' }, { input: 's = "(1+(4+5+2)-3)+(6+8)"', output: '23' }],
  constraints: ['1 ≤ s.length ≤ 3 · 10⁵', 'every result fits in 32 bits'],
  hints: ['Without parentheses: running result and a sign.', 'On “(” save the current result and sign.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursive evaluation', idea: 'Parse terms; on “(” recurse and treat the returned value as a number.', time: 'O(n)', space: 'O(depth)', bottleneck: 'Deep nesting uses the call stack.' },
    { id: 'optimal', kind: 'optimal', name: 'Stack of (result, sign)', idea: 'Accumulate result with a sign; push (result, sign) on “(”; on “)” result = prevResult + prevSign × result.', time: 'O(n)', space: 'O(depth)' },
  ],
  takeaway: 'Brackets → **save (result, sign)** and combine on close.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'calculate', params: ['String'], ret: 'int',
    tests: [{ args: ['1 + 1'], out: 2 }, { args: [' 2-1 + 2 '], out: 3 }, { args: ['(1+(4+5+2)-3)+(6+8)'], out: 23 }, { args: ['-(2+3)'], out: -5 }, { args: ['- (3 + (4 + 5))'], out: -12 }],
    gen: (r: Rng) => {
      const expr = (d: number): string => { let s = (r.chance(0.2) ? '-' : '') + term(d); for (let k = 0; k < r.int(0, 3); k++) s += r.pick(['+', '-']) + term(d); return s; };
      const term = (d: number): string => (d > 0 && r.chance(0.35) ? `(${expr(d - 1)})` : String(r.int(0, 20)));
      return [expr(2)];
    },
    ref: (s: string) => calc(s),
  },
};

export default problem;
