import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = ')()())(()';
function lvp(s: string) { const st = [-1]; let b = 0; for (let i = 0; i < s.length; i++) { if (s[i] === '(') st.push(i); else { st.pop(); if (!st.length) st.push(i); else b = Math.max(b, i - st[st.length - 1]); } } return b; }

function video() {
  const v = new Video('longest-valid-parentheses', 'Longest Valid Parentheses');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 'only "(" and ")"' });
  v.say('Return the length of the longest substring of well-formed, matching parentheses.');
  v.eq(`"()()" has length ${lvp(S)}`);

  v.chapter('brute', 'Brute force: every start, balance counter', { cx: 'O(n²)', code: ['for i: bal = 0', '  for j from i: bal ±= 1; if bal < 0: break; if bal == 0: best = max(best, j − i + 1)'] });
  v.eq('n starts × n steps', 'warn').say('From every start, extend while the balance never goes negative, recording lengths where it returns to zero. Quadratic.');

  v.chapter('optimal', 'Optimal: stack of indices with a base', { cx: 'O(n)', code: ['stack = [−1]          # index before the current valid run', '"(" → push i', '")" → pop; if empty: push i (new base)', '      else: best = max(best, i − stack.top)'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const st = v.stack('st', [-1], { label: 'indices (bottom = base)' });
  const stack = [-1];
  let best = 0;
  let told = 0;
  v.say('Keep a stack of indices. Its bottom is a base: the index just before the current run of valid brackets. Unmatched opening brackets sit above it. When a closing bracket matches, the distance to the new top is the length of a valid run ending here.');
  [...S].forEach((c, i) => {
    a.clearTones().tone(i, 'active');
    if (c === '(') { stack.push(i); st.push(i); v.line(1).eq(`"(" → push ${i}`).hold(500); }
    else {
      stack.pop();
      st.pop();
      if (!stack.length) {
        stack.push(i);
        st.push(i);
        a.tone(i, 'bad');
        v.line(2).eq(`")" at ${i} unmatched → new base ${i}`, 'bad');
        if (told === 0) { v.say('A closing bracket with nothing to match: no valid run can cross it. It becomes the new base.'); told++; } else v.hold(600);
      } else {
        const len = i - stack[stack.length - 1];
        best = Math.max(best, len);
        a.toneRange(stack[stack.length - 1] + 1, i, 'ok');
        v.line(3).counter(`best: ${best}`).eq(`")" at ${i} matched → run length ${i} − ${stack[stack.length - 1]} = ${len}`, 'ok');
        if (told === 1 && len >= 4) { v.say(`Here the run reaches back to the base at ${stack[stack.length - 1]}, so its length is ${len}: two matched pairs side by side count as one run.`); told++; } else v.hold(650);
      }
    }
  });
  a.clearTones();
  v.eq(`longest = ${best}`, 'ok').say(`The longest valid run has length ${best}. A second, constant-memory approach counts opening and closing brackets in a pass from each direction.`);
  v.answer(lvp(S));

  recap(v, [{ name: 'Every start', time: 'O(n²)', space: 'O(1)' }, { name: 'Stack with a base index', time: 'O(n)', space: 'O(n)' }, { name: 'Two counter passes', time: 'O(n)', space: 'O(1)' }], 'The index below a match marks where the valid run began.', ['Longest valid run → stack of indices with a sentinel base'], 'A sentinel index at the bottom turns matches into lengths.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-valid-parentheses',
  statement: 'Given a string containing just the characters `(` and `)`, return the length of the longest valid (well-formed) parentheses substring.',
  examples: [{ input: 's = "(()"', output: '2' }, { input: 's = ")()())"', output: '4' }, { input: 's = ""', output: '0' }],
  constraints: ['0 ≤ s.length ≤ 3 · 10⁴'],
  hints: ['Store indices, not characters.', 'Keep the index before the current valid run at the bottom of the stack.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every start', idea: 'From each start, extend with a balance counter; record zero-balance lengths.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'better', kind: 'better', name: 'Stack with a base', idea: 'Stack starts with −1; "(" pushes i; ")" pops, then either becomes the new base or measures i − top.', time: 'O(n)', space: 'O(n)' },
    { id: 'optimal', kind: 'optimal', name: 'Two counter passes', idea: 'Left-to-right: count opens/closes; equal → record; closes > opens → reset. Repeat right-to-left with the roles swapped.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Indices + a **base sentinel** turn matches into lengths.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'longestValidParentheses', params: ['String'], ret: 'int',
    tests: [{ args: ['(()'], out: 2 }, { args: [')()())'], out: 4 }, { args: [''], out: 0 }, { args: ['()(())'], out: 6 }],
    gen: (r: Rng) => [r.str(r.int(0, 14), '()')],
    ref: (s: string) => lvp(s),
  },
};

export default problem;
