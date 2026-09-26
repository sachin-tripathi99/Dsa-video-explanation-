import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const C = [2, 3, 6, 7];
const T = 7;
function cs(c: number[], t: number) { const a = [...c].sort((x, y) => x - y); const out: number[][] = []; const p: number[] = []; const go = (s: number, rem: number) => { if (rem === 0) { out.push([...p]); return; } for (let i = s; i < a.length; i++) { if (a[i] > rem) break; p.push(a[i]); go(i, rem - a[i]); p.pop(); } }; go(0, t); return out; }

function video() {
  const v = new Video('combination-sum', 'Combination Sum');
  v.chapter('intro', 'The problem');
  v.array('c', C, { label: `candidates (distinct), target = ${T}` });
  v.say(`Find all unique combinations of candidates that add up to ${words(T)}. Each candidate may be used any number of times.`);
  v.eq(cs(C, T).map((x) => `[${x}]`).join(' '));

  v.chapter('brute', 'Brute force: every ordered sequence, then dedupe', { cx: 'exponential, many duplicates', code: ['try any candidate at every step', 'when the sum hits the target: sort the sequence, add to a set'] });
  v.eq('[2,2,3], [2,3,2] and [3,2,2] are all generated', 'bad').say('If every step may pick any candidate, the same combination appears in every order: two, two, three; two, three, two; three, two, two. We would need a set to remove duplicates, and waste most of the work.');

  v.chapter('optimal', 'Backtracking: start index + sorted pruning', { cx: 'O(2^(t/min)) roughly', code: ['sort candidates', 'go(start, remain):', '  if remain == 0: record', '  for i from start: if c[i] > remain: break', '    choose c[i]; go(i, remain − c[i]); undo'] });
  v.clear();
  const d = decisionTree(v, 't', 'node = remaining amount; edges = candidate chosen');
  const a = [...C].sort((x, y) => x - y);
  const path: number[] = [];
  let count = 0;
  const told = { reuse: false, prune: false, found: false };
  v.say('Sort the candidates. Pass a start index so combinations are built in non-decreasing order, which makes each one appear exactly once. Recurse with the same index i, not i plus one, because a candidate may be reused.');
  const go = (s: number, rem: number, edge?: string) => {
    const nid = d.enter(rem, edge);
    if (rem === 0) {
      d.mark(nid, 'ok'); count++;
      v.line(2).counter(`found: ${count}`).eq(`remain 0 → record [${path.join(', ')}]`, 'ok');
      if (!told.found) { v.say(`Two, two, three: the remaining amount is zero. Record it.`); told.found = true; } else v.hold(700);
      d.leave();
      return;
    }
    for (let i = s; i < a.length; i++) {
      if (a[i] > rem) {
        const pid = d.enter(`✗`, `${a[i]}`);
        d.mark(pid, 'bad');
        v.line(3).eq(`${a[i]} > remain ${rem} → break (all later candidates are bigger)`, 'bad');
        if (!told.prune) { v.say(`With ${words(rem)} left, the candidate ${words(a[i])} is too big. Since the candidates are sorted, every later one is too big as well: break out of the loop.`); told.prune = true; } else v.hold(500);
        d.leave();
        break;
      }
      path.push(a[i]);
      v.eq(`choose ${a[i]} → remain ${rem - a[i]}`);
      if (!told.reuse && path.length === 2) { v.line(4).say('Take two, then two again: reuse is allowed because we recurse with the same index.'); told.reuse = true; } else v.line(4).hold(300);
      go(i, rem - a[i], `${a[i]}`);
      path.pop();
    }
    d.leave();
  };
  go(0, T);
  v.eq(cs(C, T).map((x) => `[${x}]`).join(' '), 'ok').say(`Two combinations: two, two, three, and seven. Every branch that overshoots was cut immediately.`);
  v.answer(cs(C, T));

  recap(v, [{ name: 'Ordered sequences + set', time: 'exponential, with duplicates', space: 'large' }, { name: 'Start index + sorted pruning', time: 'exponential in target / min', space: 'O(target / min)' }], 'Recurse with i (reuse allowed); break when c[i] > remain.', ['Combinations summing to a target → sorted start-index backtracking'], 'A start index removes order duplicates; sorting enables early breaks.');
  return v.build();
}

function refSorted(c: number[], t: number) { return cs(c, t); }

const problem: Problem = {
  slug: 'combination-sum',
  statement: 'Given an array of distinct integers `candidates` and a `target`, return a list of all unique combinations of candidates where the chosen numbers sum to `target`. The same number may be chosen an unlimited number of times. Return them in any order.',
  examples: [{ input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' }, { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' }, { input: 'candidates = [2], target = 1', output: '[]' }],
  constraints: ['1 ≤ candidates.length ≤ 30', '2 ≤ candidates[i] ≤ 40', '1 ≤ target ≤ 40'],
  hints: ['Use a start index to avoid order duplicates.', 'Recurse with i (not i + 1) to allow reuse.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sequences + dedupe', idea: 'Any candidate at every step; sort finished sequences into a set.', time: 'exponential', space: 'large', bottleneck: 'Every order is generated.' },
    { id: 'optimal', kind: 'optimal', name: 'Backtracking', idea: 'Sorted candidates, start index, break when a candidate exceeds the remainder.', time: 'exponential in target / min', space: 'O(target / min)' },
  ],
  takeaway: 'Recurse with **i** to allow reuse; **break** on overshoot.',
  video,
  videoArgs: [C, T],
  judge: {
    type: 'fn', fn: 'combinationSum', params: ['int[]', 'int'], ret: 'List<List<Integer>>', cmp: 'deepSorted',
    tests: [{ args: [[2, 3, 6, 7], 7], out: [[2, 2, 3], [7]] }, { args: [[2, 3, 5], 8], out: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] }, { args: [[2], 1], out: [] }],
    gen: (r: Rng) => [r.shuffle(Array.from({ length: 8 }, (_, i) => i + 2)).slice(0, r.int(1, 4)), r.int(1, 12)],
    ref: (c: number[], t: number) => refSorted(c, t),
  },
};

export default problem;
