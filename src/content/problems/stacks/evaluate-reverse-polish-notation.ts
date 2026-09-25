import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const TOK = ['4', '13', '5', '/', '+'];

function video() {
  const v = new Video('rpn', 'Evaluate Reverse Polish Notation');
  v.chapter('intro', 'The problem');
  v.array('t', TOK, { label: 'tokens' });
  v.say('In reverse Polish notation the operator comes after its two operands. Four, thirteen, five, divide, plus means four plus, thirteen divided by five. No brackets are ever needed.');
  v.eq('4 + (13 / 5) = 4 + 2 = 6 (division truncates toward zero)');

  v.chapter('brute', 'Brute force: collapse the first operator repeatedly', { cx: 'O(n²)', code: ['while more than one token:', '  find the first operator at i', '  replace tokens[i−2..i] with the result'] });
  v.eq('each collapse rescans and shifts the list → O(n²)', 'bad').say('You could repeatedly find the first operator, compute it with the two tokens before it, and splice the result back in. Each splice shifts the list: n squared.');

  v.chapter('optimal', 'Optimal: a stack of operands', { cx: 'O(n)', code: ['for tok in tokens:', '  if tok is a number: push it', '  else: b = pop(); a = pop(); push(a op b)', 'return pop()'] });
  v.clear().layout('row');
  const a = v.array('t', TOK, { label: 'tokens' });
  const st = v.stack('st', [], { label: 'operands', ends: ['top', ''] });
  const vals: number[] = [];
  TOK.forEach((tok, i) => {
    a.clearTones().ptr('tok', i).tone(i, 'active');
    if (!'+-*/'.includes(tok)) {
      vals.push(Number(tok));
      st.push(Number(tok)).clearTones().toneTop('active');
      v.line(1).eq(`number → push ${tok}`);
      if (i === 0) v.say('Numbers wait on a stack.');
      else v.hold(500);
    } else {
      const bb = vals.pop()!;
      const aa = vals.pop()!;
      const r = tok === '+' ? aa + bb : tok === '-' ? aa - bb : tok === '*' ? aa * bb : Math.trunc(aa / bb);
      st.pop();
      st.pop();
      vals.push(r);
      st.push(r).clearTones().toneTop('ok');
      v.line(2).eq(`${aa} ${tok} ${bb} = ${r}`, 'ok');
      if (tok === '/') v.say('An operator pops two numbers. Careful with the order: the first pop is the right operand. Thirteen divided by five, truncated toward zero, is two.');
      else v.say(`Then four plus two is six, pushed back.`);
    }
  });
  a.noPtr();
  v.line(3).eq(`answer: ${vals[0]}`, 'ok').say('At the end, one number remains: the answer. One pass, O of n.');
  v.answer(vals[0]);
  recap(v, [{ name: 'Collapse operators repeatedly', time: 'O(n²)', space: 'O(n)' }, { name: 'Operand stack', time: 'O(n)', space: 'O(n)' }], 'The stack holds exactly the operands still waiting for an operator.', ['Operands waiting for operators → stack', 'Pop order: right operand first', 'Truncate division toward zero (Python: int(a / b))'], 'Postfix expressions and a stack are made for each other. Watch the pop order and the division rule.');
  return v.build();
}

const problem: Problem = {
  slug: 'evaluate-reverse-polish-notation',
  statement: 'Evaluate an arithmetic expression given in **Reverse Polish Notation** as an array of tokens. Operators are `+`, `-`, `*`, `/`; division **truncates toward zero**. The expression is always valid and every intermediate result fits in a 32-bit integer.',
  examples: [{ input: 'tokens = ["2","1","+","3","*"]', output: '9', why: '(2 + 1) × 3' }, { input: 'tokens = ["4","13","5","/","+"]', output: '6' }, { input: 'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', output: '22' }],
  constraints: ['1 ≤ tokens.length ≤ 10⁴', 'tokens are operators or integers in [-200, 200]'],
  hints: ['Where do numbers wait until their operator arrives?', 'Which popped value is the left operand?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Collapse the first operator repeatedly', idea: 'Find the first operator, replace it and its two preceding operands by the result, repeat.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Each collapse rescans and shifts the list.' },
    { id: 'optimal', kind: 'optimal', name: 'Operand stack', idea: 'Push numbers; on an operator pop `b` then `a` and push `a op b`.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['`b = pop()` first: `a - b` and `a / b` depend on the order.', 'Python’s `//` floors; use `int(a / b)` to truncate toward zero.', 'Negative numbers like "-11" are numbers, not operators.'],
  takeaway: '**Operands wait on a stack** until their operator arrives.',
  video,
  videoArgs: [TOK],
  judge: {
    type: 'fn', fn: 'evalRPN', params: ['String[]'], ret: 'int',
    tests: [{ args: [['2', '1', '+', '3', '*']], out: 9 }, { args: [['4', '13', '5', '/', '+']], out: 6 }, { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], out: 22 }, { args: [['7', '-2', '/']], out: -3 }],
    gen: (r) => { const toks: string[] = [String(r.int(-9, 9))]; let depth = 1; for (let k = 0; k < r.int(1, 6); k++) { toks.push(String(r.int(1, 9) * (r.chance(0.3) ? -1 : 1))); depth++; while (depth > 1 && r.chance(0.6)) { toks.push(r.pick(['+', '-', '*', '/'])); depth--; } } while (depth > 1) { toks.push(r.pick(['+', '-', '*'])); depth--; } return [toks]; },
    ref: (t: string[]) => { const s: number[] = []; for (const x of t) { if ('+-*/'.includes(x) && x.length === 1) { const b = s.pop()!; const a = s.pop()!; s.push(x === '+' ? a + b : x === '-' ? a - b : x === '*' ? a * b : Math.trunc(a / b)); } else s.push(Number(x)); } return s[0]; },
  },
};

export default problem;
