import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'a)b(c)d)(e';
function solve(s: string) {
  const del = new Set<number>();
  const st: number[] = [];
  [...s].forEach((c, i) => { if (c === '(') st.push(i); else if (c === ')') { if (st.length) st.pop(); else del.add(i); } });
  st.forEach((i) => del.add(i));
  return [...s].filter((_, i) => !del.has(i)).join('');
}

function video() {
  const v = new Video('min-remove-parentheses', 'Minimum Remove to Make Valid Parentheses');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 'letters and parentheses' });
  v.say('Remove the fewest parentheses so that the string becomes valid: every closing bracket matches an earlier opening one. Letters stay. Any valid answer with the fewest removals is accepted.');
  v.eq(`e.g. "${solve(S)}"`);

  v.chapter('brute', 'Brute force: try removal subsets', { cx: 'O(2ⁿ · n)', code: ['try removing 0, 1, 2, … parentheses in every combination', 'return the first valid string'] });
  v.eq('exponentially many subsets', 'bad').say('Trying every set of removals, smallest first, is exponential.');

  v.chapter('optimal', 'Optimal: stack of unmatched "(" indices', { cx: 'O(n)', code: ['for i, c in s:', '  "(" → push i', '  ")" → pop if possible, else mark i for deletion', 'mark every index left on the stack', 'build the string without marked indices'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const st = v.stack('st', [], { label: 'indices of unmatched "("' });
  const stack: number[] = [];
  const del = new Set<number>();
  let told = 0;
  v.say('Scan left to right. Push the index of every opening bracket. A closing bracket matches the most recent unmatched opening one, if there is any. If there is none, that closing bracket must go.');
  [...S].forEach((c, i) => {
    a.clearTones();
    del.forEach((d) => a.tone(d, 'bad'));
    if (c === '(') { stack.push(i); st.push(i); a.tone(i, 'active'); v.line(1).eq(`"(" at ${i} → push`).hold(500); }
    else if (c === ')') {
      if (stack.length) { const j = stack.pop()!; st.pop(); a.tone(i, 'ok').tone(j, 'ok'); v.line(2).eq(`")" at ${i} matches "(" at ${j}`, 'ok').hold(600); }
      else { del.add(i); a.tone(i, 'bad'); v.line(2).eq(`")" at ${i} has no partner → delete`, 'bad'); if (told === 0) { v.say('The first closing bracket at index one has nothing to match. Mark it.'); told++; } else v.hold(600); }
    } else { a.tone(i, 'dim'); v.line(0).hold(250); }
  });
  stack.forEach((i) => { del.add(i); a.tone(i, 'bad'); });
  v.line(3).eq(`leftover "(" at ${stack.join(', ')} → delete`, 'bad').say(`At the end, any opening brackets still on the stack never found a partner. Mark them too.`);
  const out = [...S].filter((_, i) => !del.has(i)).join('');
  v.line(4).eq(`"${out}"`, 'ok').say('Drop the marked characters. Every removal was forced, so this removes the minimum number.');
  v.answer(solve(S));

  recap(v, [{ name: 'Try removal subsets', time: 'O(2ⁿ · n)', space: 'O(n)' }, { name: 'Stack of indices', time: 'O(n)', space: 'O(n)' }], 'Unmatched “)” while scanning, and unmatched “(” at the end, must go.', ['Bracket matching with removals → stack of indices'], 'Store indices, not characters, when you need to know exactly what to delete.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-remove-to-make-valid-parentheses',
  statement: 'Given a string `s` of `(`, `)` and lowercase letters, remove the minimum number of parentheses so that the resulting string is valid, and return any valid string. A string is valid if it is empty, only letters, `AB` (both valid), or `(A)` (A valid).',
  examples: [{ input: 's = "lee(t(c)o)de)"', output: '"lee(t(c)o)de"' }, { input: 's = "a)b(c)d"', output: '"ab(c)d"' }, { input: 's = "))(("', output: '""' }],
  constraints: ['1 ≤ s.length ≤ 10⁵'],
  hints: ['Which “)” can never be matched?', 'Which “(” remain unmatched at the end?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try removal subsets', idea: 'BFS over strings with one more parenthesis removed until one is valid.', time: 'O(2ⁿ · n)', space: 'O(2ⁿ)', bottleneck: 'Exponential.' },
    { id: 'optimal', kind: 'optimal', name: 'Stack of indices', idea: 'Push "(" indices; unmatched ")" are deleted; leftover "(" indices are deleted.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Match with a **stack of indices**; delete what is left unmatched.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'minRemoveToMakeValid', params: ['String'], ret: 'String', cmp: { checker: 'minRemoveParens' },
    tests: [{ args: ['lee(t(c)o)de)'], out: 'lee(t(c)o)de' }, { args: ['a)b(c)d'], out: 'ab(c)d' }, { args: ['))(('], out: '' }],
    gen: (r: Rng) => [r.str(r.int(1, 10), 'a()')],
    ref: (s: string) => solve(s),
  },
};

export default problem;
