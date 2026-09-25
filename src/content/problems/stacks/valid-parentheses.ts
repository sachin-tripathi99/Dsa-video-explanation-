import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const S = '{[()]}(]';

function video() {
  const v = new Video('valid-parentheses', 'Valid Parentheses');
  v.chapter('intro', 'The problem');
  v.array('s', [...S], { label: 's' });
  v.say('Given a string of brackets, decide whether every opener is closed by the same type, in the correct order. Here the first six characters are fine, but then a round opener is closed by a square bracket.');

  v.chapter('brute', 'Brute force: delete matched pairs repeatedly', { cx: 'O(n²)', code: ['while s contains "()", "[]" or "{}":', '  delete it', 'return s is empty'] });
  const steps = ['{[()]}(]', '{[]}(]', '{}(]', '(]'];
  steps.forEach((st, i) => {
    v.eq(`"${st}"`, i === steps.length - 1 ? 'bad' : 'none');
    if (i === 0) v.say('A simple idea: keep deleting adjacent matched pairs like round-round until nothing changes.');
    else if (i === steps.length - 1) v.say('We are stuck with round then square, which is not empty, so the string is invalid. Each pass scans the whole string, and there can be n over two passes: n squared.');
    else v.hold(700);
  });

  v.chapter('optimal', 'Optimal: a stack of openers', { cx: 'O(n)', code: ['for c in s:', '  if c is an opener: push(c)', '  elif empty or top != partner(c): return false', '  else: pop()', 'return stack is empty'] });
  v.clear().layout('row');
  const a = v.array('s', [...S], { label: 's' });
  const st = v.stack('st', [], { label: 'stack', ends: ['top', ''] });
  const pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  let ok = true;
  for (let i = 0; i < S.length; i++) {
    const c = S[i];
    a.clearTones().ptr('c', i).tone(i, 'active');
    if (!pair[c]) {
      st.push(c).clearTones().toneTop('active');
      v.line(1).eq(`'${c}' opens → push`);
      if (i === 0) v.say('Push every opener. It waits for its closer.');
      else v.hold(550);
    } else if (!st.size || st.peek() !== pair[c]) {
      st.clearTones().toneTop('bad');
      a.tone(i, 'bad');
      v.line(2).eq(`'${c}' but top is '${st.peek()}' → false`, 'bad').say('A square closer, but the top of the stack is a round opener. Mismatch: return false immediately.');
      ok = false;
      break;
    } else {
      st.clearTones().toneTop('ok');
      v.line(3).eq(`'${c}' matches top '${st.peek()}' → pop`, 'ok');
      if (c === ')') v.say('A closer must match the most recent opener, which is the top. It does, so pop.');
      else v.hold(600);
      st.pop();
      st.clearTones();
    }
  }
  v.note('also invalid: leftover openers at the end').say('If we reach the end, the stack must also be empty; leftover openers mean unclosed brackets. One pass, O of n.');
  v.answer(ok);
  recap(v, [{ name: 'Delete matched pairs repeatedly', time: 'O(n²)', space: 'O(n)' }, { name: 'Stack of openers', time: 'O(n)', space: 'O(n)' }], 'The stack always holds exactly the unmatched openers, most recent on top.', ['Nesting / matching → stack', 'Check: mismatch, closer with empty stack, leftovers at the end'], 'Three ways to fail: a mismatch, a closer with an empty stack, and leftovers at the end. Check all three.');
  return v.build();
}

const problem: Problem = {
  slug: 'valid-parentheses',
  statement: 'Given a string `s` containing only `()[]{}`, determine if it is **valid**: every open bracket is closed by the same type of bracket, in the correct order, and every close bracket has a matching open bracket.',
  examples: [{ input: 's = "()"', output: 'true' }, { input: 's = "()[]{}"', output: 'true' }, { input: 's = "(]"', output: 'false' }, { input: 's = "([])"', output: 'true' }],
  constraints: ['1 ≤ s.length ≤ 10⁴'],
  hints: ['Which opener must a closer match?', 'The most recent unmatched opener: what structure gives you "most recent"?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Delete matched pairs', idea: 'Repeatedly remove "()", "[]", "{}" until nothing changes; valid if the string ends up empty.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Each pass rescans and copies the string.' },
    { id: 'optimal', kind: 'optimal', name: 'Stack of openers', idea: 'Push openers. For a closer, the stack must be non-empty with the matching opener on top; pop it. Valid if the stack is empty at the end.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['Forgetting the final "stack must be empty" check ("((" is invalid).', 'Popping an empty stack on a leading closer.'],
  takeaway: 'Nested structure → **stack**. The top is always the most recent unmatched item.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'isValid', params: ['String'], ret: 'boolean',
    tests: [{ args: ['()'], out: true }, { args: ['()[]{}'], out: true }, { args: ['(]'], out: false }, { args: ['([])'], out: true }, { args: ['(('], out: false }, { args: [']'], out: false }, { args: ['([)]'], out: false }],
    gen: (r) => [r.str(r.int(1, 10), '()[]{}')],
    ref: (s: string) => { const st: string[] = []; const p: Record<string, string> = { ')': '(', ']': '[', '}': '{' }; for (const c of s) { if (!p[c]) st.push(c); else if (st.pop() !== p[c]) return false; } return st.length === 0; },
    genCount: 60,
  },
};

export default problem;
