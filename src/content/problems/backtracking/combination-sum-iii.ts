import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const K = 2, N = 5;
function cs3(k: number, n: number) { const out: number[][] = []; const p: number[] = []; const go = (s: number, rem: number) => { if (p.length === k) { if (rem === 0) out.push([...p]); return; } for (let x = s; x <= 9; x++) { if (x > rem) break; p.push(x); go(x + 1, rem - x); p.pop(); } }; go(1, n); return out; }

function video() {
  const v = new Video('combination-sum-iii', 'Combination Sum III');
  v.chapter('intro', 'The problem');
  v.say(`Find all combinations of exactly ${words(K)} distinct numbers from one to nine that add up to ${words(N)}. (LeetCode’s own example uses k equals three and n equals seven; the idea is identical.)`);
  v.eq(`k = ${K}, n = ${N} → ${cs3(K, N).map((x) => `[${x}]`).join(' ')}`);

  v.chapter('brute', 'Brute force: all 2⁹ subsets of 1..9', { cx: 'O(9 · 2⁹)', code: ['for mask in 0 .. 511:', '  if popcount == k and sum == n: record'] });
  v.eq('512 subsets: tiny, but no insight', 'warn').say('There are only five hundred and twelve subsets of one to nine, so checking them all is actually fast. But backtracking with pruning is the pattern interviewers want to see, and it generalises.');

  v.chapter('optimal', 'Backtracking with two stopping rules', { cx: 'O(C(9, k) · k)', code: ['go(start, remain):', '  if len(path) == k: record if remain == 0; return', '  for x in start..9:', '    if x > remain: break', '    choose x; go(x + 1, remain − x); undo'] });
  v.clear();
  const d = decisionTree(v, 't', 'node = remaining sum');
  const path: number[] = [];
  let count = 0;
  const told = { dead: false, ok: false, br: false };
  const go = (s: number, rem: number, edge?: string) => {
    const nid = d.enter(rem, edge);
    if (path.length === K) {
      if (rem === 0) { d.mark(nid, 'ok'); count++; v.line(1).counter(`found: ${count}`).eq(`${K} numbers, remain 0 → record [${path.join(', ')}]`, 'ok'); if (!told.ok) { v.say(`[${path.join(', ')}] uses ${words(K)} numbers and hits the target exactly: record it.`); told.ok = true; } else v.hold(500); }
      else { d.mark(nid, 'bad'); v.line(1).eq(`${K} numbers but remain ${rem} → dead end`, 'bad'); if (!told.dead) { v.say(`[${path.join(', ')}] already has ${words(K)} numbers, but ${words(rem)} is still missing. Dead end.`); told.dead = true; } else v.hold(400); }
      d.leave();
      return;
    }
    v.line(2).eq(`remain ${rem}, path [${path.join(', ')}]`).hold(300);
    for (let x = s; x <= 9; x++) {
      if (x > rem) {
        if (!told.br) { v.line(3).eq(`${x} > remain ${rem} → break`, 'bad').say(`${words(x)} is already more than what remains, and larger numbers are worse: break.`); told.br = true; }
        break;
      }
      path.push(x);
      go(x + 1, rem - x, `${x}`);
      path.pop();
    }
    d.leave();
  };
  go(1, N);
  v.eq(cs3(K, N).map((x) => `[${x}]`).join(' '), 'ok').say(`Two combinations. Numbers increase along every path, so each combination appears once.`);
  v.answer(cs3(K, N));

  recap(v, [{ name: 'All 512 subsets', time: 'O(9 · 2⁹)', space: 'O(9)' }, { name: 'Backtracking + pruning', time: 'O(C(9, k) · k)', space: 'O(k)' }], 'Stop at k numbers; break when x > remain.', ['Fixed count + fixed sum → backtracking with both limits'], 'Two limits (count and sum) give two pruning rules.');
  return v.build();
}

const problem: Problem = {
  slug: 'combination-sum-iii',
  statement: 'Find all valid combinations of `k` numbers that sum up to `n` such that only numbers 1 through 9 are used and each number is used at most once. Return the list in any order.',
  examples: [{ input: 'k = 3, n = 7', output: '[[1,2,4]]' }, { input: 'k = 3, n = 9', output: '[[1,2,6],[1,3,5],[2,3,4]]' }, { input: 'k = 4, n = 1', output: '[]' }],
  constraints: ['2 ≤ k ≤ 9', '1 ≤ n ≤ 60'],
  hints: ['Increasing numbers avoid duplicates.', 'Stop when you have k numbers or overshoot n.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All subsets', idea: 'Check all 512 subsets of 1..9.', time: 'O(9 · 2⁹)', space: 'O(9)', bottleneck: 'No pruning (fine here, but does not scale).' },
    { id: 'optimal', kind: 'optimal', name: 'Backtracking', idea: 'Increasing picks; stop at k; break when x > remain.', time: 'O(C(9, k) · k)', space: 'O(k)' },
  ],
  takeaway: 'Count limit + sum limit = **two prunes**.',
  video,
  videoArgs: [K, N],
  judge: {
    type: 'fn', fn: 'combinationSum3', params: ['int', 'int'], ret: 'List<List<Integer>>', cmp: 'deepSorted',
    tests: [{ args: [3, 7], out: [[1, 2, 4]] }, { args: [3, 9], out: cs3(3, 9) }, { args: [4, 1], out: [] }, { args: [K, N], out: cs3(K, N) }],
    gen: (r: Rng) => [r.int(2, 5), r.int(1, 30)],
    ref: (k: number, n: number) => cs3(k, n),
  },
};

export default problem;
