import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { levelScene } from '../../treevid';

const T: Level = [1, 7, 0, 7, -8, null, null];
function mls(lv: Level) { let q: TNode[] = []; const r = build(lv); if (r) q = [r]; let best = -Infinity, at = 0, d = 1; while (q.length) { const s = q.reduce((a, n) => a + n.v, 0); if (s > best) { best = s; at = d; } q = q.flatMap((n) => [n.l, n.r].filter((x): x is TNode => !!x)); d++; } return at; }

function video() {
  const v = new Video('maximum-level-sum', 'Maximum Level Sum of a Binary Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [1,7,0,7,-8]' });
  v.say('Levels are numbered from one at the root. Return the level whose values add up to the largest sum. If several levels tie, return the smallest level number.');
  v.eq(`answer: level ${mls(T)}`);

  v.chapter('brute', 'DFS: accumulate a sum per depth', { cx: 'O(n) · O(h)', code: ['dfs(node, d): sums[d] += val', 'answer = first index of max(sums) + 1'] });
  v.eq('an extra array of sums, scanned at the end', 'warn').say('A DFS can add each value into a sums array indexed by depth, then pick the best index. It needs the whole array before deciding.');

  v.chapter('optimal', 'BFS: compare each level’s sum as you go', { cx: 'O(n) · O(width)', code: ['for level = 1, 2, …:', '  s = sum of the level', '  if s > best: best, answer = s, level   # strict'] });
  let best = -Infinity;
  levelScene(v, T, 'sum each level', (vals, d) => {
    const s = vals.reduce((a, b) => a + b, 0);
    const nb = s > best;
    if (nb) best = s;
    const say = d === 0 ? 'Level one is just the root: sum one. That is the best so far.' : d === 1 ? `Level two sums to seven plus zero, seven: a new best.` : d === 2 ? `Level three sums to seven minus eight, minus one. Not better. Use a strict greater-than, so on a tie the earlier, smaller level wins.` : undefined;
    return { eq: `level ${d + 1}: ${vals.join(' + ')} = ${s}${nb ? ' ← best' : ''}`, ok: nb, say };
  }, [0, 1, 2]);
  v.eq(`answer = level ${mls(T)}`, 'ok').hold(800);
  v.answer(mls(T));

  recap(v, [{ name: 'DFS sums by depth', time: 'O(n)', space: 'O(h + levels)' }, { name: 'BFS running best', time: 'O(n)', space: 'O(width)' }], 'Sum each level; update only on a strictly larger sum.', ['Pick the best level → BFS with a running maximum'], 'A strict comparison handles “smallest index on ties” for free.');
  void words;
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-level-sum-of-a-binary-tree',
  statement: 'Given the `root` of a binary tree, the root is at level 1, its children at level 2, and so on. Return the smallest level `x` such that the sum of all values at level `x` is maximal.',
  examples: [{ input: 'root = [1,7,0,7,-8,null,null]', output: '2' }, { input: 'root = [989,null,10250,98693,-89388,null,null,null,-32127]', output: '2' }],
  constraints: ['1 ≤ nodes ≤ 10⁴', '−10⁵ ≤ Node.val ≤ 10⁵'],
  hints: ['BFS; sum per level.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS sums', idea: 'sums[depth] += val; choose the first maximum.', time: 'O(n)', space: 'O(h + levels)', bottleneck: 'Side array.' },
    { id: 'optimal', kind: 'optimal', name: 'BFS', idea: 'Level sums with a strict running maximum.', time: 'O(n)', space: 'O(width)' },
  ],
  takeaway: 'Strict **>** keeps the smallest level on ties.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'maxLevelSum', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [T], out: 2 }, { args: [[989, null, 10250, 98693, -89388, null, null, null, -32127]], out: 2 }, { args: [[-1, -2, -3]], out: 1 }],
    gen: (r: Rng) => { let lv = randomTree(r); while (!lv.length) lv = randomTree(r); return [lv]; },
    ref: (lv: Level) => mls(lv),
  },
};

export default problem;
