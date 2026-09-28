import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { levelScene } from '../../treevid';

const T: Level = [3, 9, 20, null, null, 15, 7];
function avgs(lv: Level) { const out: number[] = []; let q: TNode[] = []; const r = build(lv); if (r) q = [r]; while (q.length) { out.push(q.reduce((s, n) => s + n.v, 0) / q.length); q = q.flatMap((n) => [n.l, n.r].filter((x): x is TNode => !!x)); } return out; }

function video() {
  const v = new Video('average-of-levels', 'Average of Levels in Binary Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [3,9,20,null,null,15,7]' });
  v.say('Return the average value of the nodes on each level.');
  v.eq(`[${avgs(T).join(', ')}]`);

  v.chapter('brute', 'DFS: sum and count per depth', { cx: 'O(n) · O(h)', code: ['dfs(node, d): sum[d] += val; cnt[d] += 1', 'average[d] = sum[d] / cnt[d]'] });
  v.eq('two arrays indexed by depth', 'warn').say('A DFS can keep a running sum and a count for every depth, then divide at the end. Correct, but it needs two extra arrays.');

  v.chapter('optimal', 'BFS: one level at a time', { cx: 'O(n) · O(width)', code: ['for each level (size snapshot):', '  sum the popped values', '  append sum / size'] });
  let told = false;
  levelScene(v, T, 'average each level', (vals, d) => {
    const s = vals.reduce((a, b) => a + b, 0);
    const say = !told ? `Level one holds nine and twenty. Their sum is twenty-nine and the level size is two: average fourteen and a half.` : undefined;
    if (d === 1) told = true;
    return { eq: `level ${d}: ${vals.join(' + ')} = ${s} → ${s} / ${vals.length} = ${s / vals.length}`, ok: true, say: d === 1 ? say : undefined };
  }, [0, 1, 2]);
  v.eq(`[${avgs(T).join(', ')}]`, 'ok').say('Use a 64-bit sum or a double: values up to two to the thirty-one can overflow an int when added up.');
  v.answer(avgs(T));

  recap(v, [{ name: 'DFS with sum/count per depth', time: 'O(n)', space: 'O(h)' }, { name: 'BFS per level', time: 'O(n)', space: 'O(width)' }], 'Sum each level; divide by its size.', ['Per-level aggregate → BFS level loop'], 'The level size you already read is the divisor.');
  void words;
  return v.build();
}

const problem: Problem = {
  slug: 'average-of-levels-in-binary-tree',
  statement: 'Given the `root` of a binary tree, return the average value of the nodes on each level as an array. Answers within 10⁻⁵ are accepted.',
  examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[3.00000,14.50000,11.00000]' }, { input: 'root = [3,9,20,15,7]', output: '[3.00000,14.50000,11.00000]' }],
  constraints: ['1 ≤ nodes ≤ 10⁴', '−2³¹ ≤ Node.val ≤ 2³¹ − 1'],
  hints: ['BFS level by level; sum with 64-bit or double.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS sums per depth', idea: 'Accumulate sum and count by depth, then divide.', time: 'O(n)', space: 'O(h)', bottleneck: 'Two side arrays.' },
    { id: 'optimal', kind: 'optimal', name: 'BFS', idea: 'Per level: sum popped values, divide by size.', time: 'O(n)', space: 'O(width)' },
  ],
  pitfalls: ['Overflow when summing large values in int.'],
  takeaway: 'Level **sum ÷ size**.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'averageOfLevels', params: ['TreeNode'], ret: 'List<Double>', cmp: 'float',
    tests: [{ args: [T], out: [3, 14.5, 11] }, { args: [[3, 9, 20, 15, 7]], out: [3, 14.5, 11] }, { args: [[2147483647, 2147483647, 2147483647]], out: [2147483647, 2147483647] }],
    gen: (r: Rng) => { let lv = randomTree(r); while (!lv.length) lv = randomTree(r); return [lv]; },
    ref: (lv: Level) => avgs(lv),
  },
};

export default problem;
