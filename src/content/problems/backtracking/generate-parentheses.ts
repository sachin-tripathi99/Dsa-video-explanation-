import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const N = 3;
function gp(n: number) { const out: string[] = []; const go = (s: string, o: number, c: number) => { if (s.length === 2 * n) { out.push(s); return; } if (o < n) go(s + '(', o + 1, c); if (c < o) go(s + ')', o, c + 1); }; go('', 0, 0); return out; }

function video() {
  const v = new Video('generate-parentheses', 'Generate Parentheses');
  v.chapter('intro', 'The problem');
  v.say(`Given n equals ${words(N)}, generate every string of ${words(N)} pairs of well-formed parentheses.`);
  v.eq(gp(N).join('  '));

  v.chapter('brute', 'Brute force: all 2²ⁿ strings, keep the valid ones', { cx: 'O(2²ⁿ · n)', code: ['for every string of length 2n over { "(", ")" }:', '  if balanced: record it'] });
  v.eq(`2⁶ = ${2 ** (2 * N)} strings to find ${gp(N).length}`, 'bad').say(`Each of the six positions is an open or a close bracket, so there are sixty-four strings; only five are valid. Most of the work is wasted.`);

  v.chapter('optimal', 'Backtracking: only add brackets that keep the string valid', { cx: 'O(4ⁿ / √n)', code: ['def go(s, open, close):', '  if len(s) == 2n: record', '  if open < n: go(s + "(", open + 1, close)', '  if close < open: go(s + ")", open, close + 1)'] });
  v.clear();
  const d = decisionTree(v, 't', 'only valid prefixes are ever built');
  let count = 0, told = 0;
  const go = (s: string, o: number, c: number, edge?: string) => {
    const nid = d.enter(s || '""', edge);
    if (s.length === 2 * N) {
      d.mark(nid, 'ok'); count++;
      v.line(1).counter(`found: ${count}`).eq(`record ${s}`, 'ok');
      if (told === 2) { v.say(`Three opens, three closes: record ${s.split('').map((x) => (x === '(' ? 'open' : 'close')).join(', ')}.`); told++; } else v.hold(400);
      d.leave();
      return;
    }
    v.eq(`"${s}": open ${o}, close ${c}`);
    if (told === 0) { v.line(2).say(`Two rules keep every prefix valid. We may add an open bracket while fewer than ${words(N)} are used. We may add a close bracket only if it has an open bracket to match: close less than open.`); told++; }
    else if (told === 1 && o === N) { v.line(3).say(`Now all ${words(N)} opens are used, so only closes are allowed, and each close needs an unmatched open.`); told++; }
    else v.hold(300);
    if (o < N) go(s + '(', o + 1, c, '(');
    if (c < o) go(s + ')', o, c + 1, ')');
    d.leave();
  };
  go('', 0, 0);
  v.eq(`${count} valid strings (Catalan number C₃ = 5)`, 'ok').say(`Five strings, and we never built an invalid prefix. The count is the Catalan number, which grows like four to the n divided by n to the one and a half.`);
  v.answer(gp(N));

  recap(v, [{ name: 'All strings + filter', time: 'O(2²ⁿ · n)', space: 'O(n)' }, { name: 'Backtracking with counts', time: 'O(4ⁿ / √n)', space: 'O(n)' }], 'Add "(" while open < n; add ")" while close < open.', ['Generate valid structures → prune with simple counters'], 'Never build what can’t become valid.');
  return v.build();
}

const problem: Problem = {
  slug: 'generate-parentheses',
  statement: 'Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses, in any order.',
  examples: [{ input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' }, { input: 'n = 1', output: '["()"]' }],
  constraints: ['1 ≤ n ≤ 8'],
  hints: ['Track how many opens and closes you have used.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All strings + filter', idea: 'Generate every bracket string of length 2n; keep the balanced ones.', time: 'O(2²ⁿ · n)', space: 'O(n)', bottleneck: 'Most strings are invalid.' },
    { id: 'optimal', kind: 'optimal', name: 'Backtracking', idea: 'Add "(" if open < n; add ")" if close < open.', time: 'O(4ⁿ / √n)', space: 'O(n)' },
  ],
  takeaway: '**Counters** keep every prefix valid.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'generateParenthesis', params: ['int'], ret: 'List<String>', cmp: 'sorted',
    tests: [{ args: [3], out: gp(3) }, { args: [1], out: ['()'] }, { args: [4], out: gp(4) }],
    gen: (r: Rng) => [r.int(1, 5)],
    ref: (n: number) => gp(n),
  },
};

export default problem;
