import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const C = [2, 5, 2, 1, 2];
const T = 5;
function cs2(c: number[], t: number) { const a = [...c].sort((x, y) => x - y); const out: number[][] = []; const p: number[] = []; const go = (s: number, rem: number) => { if (rem === 0) { out.push([...p]); return; } for (let i = s; i < a.length; i++) { if (i > s && a[i] === a[i - 1]) continue; if (a[i] > rem) break; p.push(a[i]); go(i + 1, rem - a[i]); p.pop(); } }; go(0, t); return out; }

function video() {
  const v = new Video('combination-sum-ii', 'Combination Sum II');
  v.chapter('intro', 'The problem');
  v.array('c', C, { label: `candidates (with duplicates), target = ${T}` });
  v.say(`Find all unique combinations that sum to ${words(T)}. Each candidate may be used at most once, and the candidates can contain duplicates, but the answer must not repeat a combination.`);
  v.eq(cs2(C, T).map((x) => `[${x}]`).join(' '));

  v.chapter('brute', 'Brute force: every subset, dedupe', { cx: 'O(n · 2ⁿ)', code: ['for every subset: if its sum == target: add sorted to a set'] });
  v.eq('the three 2s create many identical subsets', 'warn').say('Checking every subset and deduplicating with a set works, but with repeated values most subsets are copies of each other.');

  v.chapter('optimal', 'Sort, skip same-depth duplicates, break on overshoot', { cx: 'O(n · 2ⁿ) worst, heavily pruned', code: ['sort', 'go(start, remain):', '  if remain == 0: record', '  for i from start:', '    if i > start and c[i] == c[i−1]: continue   # duplicate', '    if c[i] > remain: break                      # overshoot', '    choose c[i]; go(i + 1, remain − c[i]); undo'] });
  v.clear();
  const a = [...C].sort((x, y) => x - y);
  v.array('s', a, { label: 'sorted' });
  const d = decisionTree(v, 't', 'node = remaining amount');
  v.weight('s', 0.6).weight('t', 2.4);
  const path: number[] = [];
  const told = { dup: false, over: false, rec: false };
  let count = 0;
  const go = (s: number, rem: number, edge?: string) => {
    const nid = d.enter(rem, edge);
    if (rem === 0) {
      d.mark(nid, 'ok'); count++;
      v.line(2).counter(`found: ${count}`).eq(`remain 0 → record [${path.join(', ')}]`, 'ok');
      if (!told.rec) { v.say(`One, two, two adds up to five: record it.`); told.rec = true; } else v.hold(600);
      d.leave();
      return;
    }
    v.line(3).eq(`remain ${rem}, path [${path.join(', ')}]`).hold(300);
    for (let i = s; i < a.length; i++) {
      if (i > s && a[i] === a[i - 1]) {
        const pid = d.enter('dup', `${a[i]}`); d.mark(pid, 'bad');
        v.line(4).eq(`skip the repeated ${a[i]} at this depth`, 'bad');
        if (!told.dup) { v.say(`Another two at the same depth would rebuild the subtree we just explored. Skip it.`); told.dup = true; } else v.hold(400);
        d.leave();
        continue;
      }
      if (a[i] > rem) {
        const pid = d.enter('✗', `${a[i]}`); d.mark(pid, 'bad');
        v.line(5).eq(`${a[i]} > remain ${rem} → break`, 'bad');
        if (!told.over) { v.say(`${words(a[i])} is more than the ${words(rem)} we still need. Everything after it is at least as big, so stop the loop.`); told.over = true; } else v.hold(400);
        d.leave();
        break;
      }
      path.push(a[i]);
      go(i + 1, rem - a[i], `${a[i]}`);
      path.pop();
    }
    d.leave();
  };
  go(0, T);
  v.eq(cs2(C, T).map((x) => `[${x}]`).join(' '), 'ok').say('Each value is used at most once because we recurse with i plus one, and duplicates are skipped at the same depth. Two combinations.');
  v.answer(cs2(C, T));

  recap(v, [{ name: 'All subsets + set', time: 'O(n · 2ⁿ)', space: 'O(n · 2ⁿ)' }, { name: 'Sorted backtracking', time: 'O(n · 2ⁿ) worst', space: 'O(n)' }], 'Recurse with i + 1; skip equal values at the same depth; break on overshoot.', ['Use-once candidates with duplicates → Subsets II + target pruning'], 'Combination Sum II = Subsets II + a running target.');
  return v.build();
}

const problem: Problem = {
  slug: 'combination-sum-ii',
  statement: 'Given a collection of candidate numbers `candidates` (may contain duplicates) and a `target`, find all unique combinations where the candidate numbers sum to `target`. Each number may only be used once in a combination. The solution set must not contain duplicate combinations.',
  examples: [{ input: 'candidates = [10,1,2,7,6,1,5], target = 8', output: '[[1,1,6],[1,2,5],[1,7],[2,6]]' }, { input: 'candidates = [2,5,2,1,2], target = 5', output: '[[1,2,2],[5]]' }],
  constraints: ['1 ≤ n ≤ 100', '1 ≤ candidates[i] ≤ 50', '1 ≤ target ≤ 30'],
  hints: ['Sort; skip equal values at the same depth.', 'Recurse with i + 1.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All subsets + set', idea: 'Check every subset’s sum; dedupe sorted tuples.', time: 'O(n · 2ⁿ)', space: 'O(n · 2ⁿ)', bottleneck: 'Duplicates and no pruning.' },
    { id: 'optimal', kind: 'optimal', name: 'Sorted backtracking', idea: 'Skip same-depth duplicates; break when c[i] > remain; recurse with i + 1.', time: 'O(n · 2ⁿ) worst', space: 'O(n)' },
  ],
  takeaway: 'Subsets II + **target pruning**.',
  video,
  videoArgs: [C, T],
  judge: {
    type: 'fn', fn: 'combinationSum2', params: ['int[]', 'int'], ret: 'List<List<Integer>>', cmp: 'deepSorted',
    tests: [{ args: [[10, 1, 2, 7, 6, 1, 5], 8], out: cs2([10, 1, 2, 7, 6, 1, 5], 8) }, { args: [C, T], out: cs2(C, T) }, { args: [[3], 2], out: [] }],
    gen: (r: Rng) => [r.ints(r.int(1, 10), 1, 5), r.int(1, 10)],
    ref: (c: number[], t: number) => cs2(c, t),
  },
};

export default problem;
