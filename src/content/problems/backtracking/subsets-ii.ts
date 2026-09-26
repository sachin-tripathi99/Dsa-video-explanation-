import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const N = [2, 1, 2];
function sd(a: number[]) { const s = [...a].sort((x, y) => x - y); const out: number[][] = []; const p: number[] = []; const go = (st: number) => { out.push([...p]); for (let i = st; i < s.length; i++) { if (i > st && s[i] === s[i - 1]) continue; p.push(s[i]); go(i + 1); p.pop(); } }; go(0); return out; }

function video() {
  const v = new Video('subsets-ii', 'Subsets II');
  v.chapter('intro', 'The problem');
  v.array('a', N, { label: 'nums (may contain duplicates)' });
  v.say('Return all subsets, but the input can contain duplicates, and the answer must not contain the same subset twice.');
  v.eq(sd(N).map((x) => `[${x}]`).join(' '));

  v.chapter('brute', 'Brute force: all subsets, dedupe with a set', { cx: 'O(n · 2ⁿ · log)', code: ['generate all 2ⁿ subsets', 'sort each one, put it in a set'] });
  v.eq('[1,2] is generated twice: once per copy of 2', 'warn').say('Generating all subsets and removing duplicates with a set works, but it builds every duplicate first and pays to sort and hash each one.');

  v.chapter('optimal', 'Sort, then skip equal values at the same depth', { cx: 'O(n · 2ⁿ)', code: ['sort nums', 'def go(start):', '  record path', '  for i in start..n−1:', '    if i > start and nums[i] == nums[i−1]: continue   # same value, same depth', '    choose nums[i]; go(i + 1); un-choose'] });
  v.clear();
  const s = [...N].sort((x, y) => x - y);
  v.array('s', s, { label: 'sorted' });
  const d = decisionTree(v, 't', 'a repeated value at the same level would rebuild the same subtree');
  v.weight('s', 0.6).weight('t', 2.4);
  const path: number[] = [];
  let count = 0;
  let told = 0;
  const go = (st: number, edge?: string) => {
    const nid = d.enter(`[${path.join(',')}]`, edge);
    d.mark(nid, 'ok'); count++;
    v.line(2).counter(`recorded: ${count}`).eq(`record [${path.join(', ')}]`, 'ok');
    if (told === 0) { v.say('Sort first, so equal values sit next to each other. Then run the usual subsets backtracking.'); told++; } else v.hold(400);
    for (let i = st; i < s.length; i++) {
      if (i > st && s[i] === s[i - 1]) {
        const pid = d.enter('dup', `${s[i]}`);
        d.mark(pid, 'bad');
        v.line(4).eq(`i = ${i}: ${s[i]} equals the previous choice at this level → skip`, 'bad');
        if (told === 1) { v.say(`At this level we already tried starting with a ${words(s[i])}. Choosing the second ${words(s[i])} here would build exactly the same subtree again, so skip it. Note the condition i greater than start: using the second two right after the first, one level deeper, is fine; that builds [1, 2, 2].`); told++; } else v.hold(500);
        d.leave();
        continue;
      }
      path.push(s[i]);
      go(i + 1, `${s[i]}`);
      path.pop();
    }
    d.leave();
  };
  go(0);
  v.eq(`${count} distinct subsets`, 'ok').say(`${words(count)} distinct subsets, and no duplicate was ever built, so no set is needed.`);
  v.answer(sd(N));

  recap(v, [{ name: 'All subsets + set', time: 'O(n · 2ⁿ · log)', space: 'O(n · 2ⁿ)' }, { name: 'Sort + skip same-depth duplicates', time: 'O(n · 2ⁿ)', space: 'O(n)' }], 'Skip nums[i] when i > start and nums[i] == nums[i−1].', ['Duplicates in the input → sort + skip at the same depth'], 'The same value at the same depth means the same subtree.');
  return v.build();
}

const problem: Problem = {
  slug: 'subsets-ii',
  statement: 'Given an integer array `nums` that may contain duplicates, return all possible subsets. The solution set must not contain duplicate subsets. Return the solution in any order.',
  examples: [{ input: 'nums = [1,2,2]', output: '[[],[1],[1,2],[1,2,2],[2],[2,2]]' }, { input: 'nums = [0]', output: '[[],[0]]' }],
  constraints: ['1 ≤ n ≤ 10'],
  hints: ['Sort first.', 'At one depth, try each distinct value only once.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All subsets + set', idea: 'Generate everything; dedupe sorted subsets in a set.', time: 'O(n · 2ⁿ · log)', space: 'O(n · 2ⁿ)', bottleneck: 'Builds duplicates.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + skip', idea: 'Skip nums[i] if i > start and nums[i] == nums[i − 1].', time: 'O(n · 2ⁿ)', space: 'O(n)' },
  ],
  takeaway: 'Sort, then **skip equal values at the same depth**.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'subsetsWithDup', params: ['int[]'], ret: 'List<List<Integer>>', cmp: 'deepSorted',
    tests: [{ args: [[1, 2, 2]], out: sd([1, 2, 2]) }, { args: [[0]], out: [[], [0]] }, { args: [[4, 4, 4, 1, 4]], out: sd([4, 4, 4, 1, 4]) }],
    gen: (r: Rng) => [r.ints(r.int(1, 7), 0, 3)],
    ref: (a: number[]) => sd(a),
  },
};

export default problem;
