import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { levelScene } from '../../treevid';

const T: Level = [3, 9, 20, 1, 2, 15, 7];
function zz(lv: Level) { const out: number[][] = []; let q: TNode[] = []; const r = build(lv); if (r) q = [r]; let d = 0; while (q.length) { const vals = q.map((n) => n.v); out.push(d % 2 ? vals.reverse() : vals); q = q.flatMap((n) => [n.l, n.r].filter((x): x is TNode => !!x)); d++; } return out; }

function video() {
  const v = new Video('zigzag-level-order', 'Binary Tree Zigzag Level Order Traversal');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [3,9,20,1,2,15,7]' });
  v.say('Level order, but alternate the direction: left to right on the first level, right to left on the second, and so on.');
  v.eq(`[${zz(T).map((l) => `[${l}]`).join(', ')}]`);

  v.chapter('brute', 'Level order, then reverse every other list', { cx: 'O(n)', code: ['levels = normal level order', 'reverse levels[1], levels[3], …'] });
  v.eq('a second pass over the odd levels', 'warn').say('Compute the ordinary level order and reverse every second list. Simple, and still linear, but it walks the odd levels twice.');

  v.chapter('optimal', 'BFS, writing each level in the right direction', { cx: 'O(n)', code: ['for each level (size snapshot):', '  row = array of size', '  i-th popped value goes to row[i] or row[size − 1 − i]', '  flip the direction'] });
  levelScene(v, T, 'odd levels are written right to left', (vals, d) => {
    const row = d % 2 ? [...vals].reverse() : vals;
    return { eq: `level ${d} (${d % 2 ? 'right → left' : 'left → right'}): [${row.join(', ')}]`, ok: true, say: d === 1 ? 'The queue still pops nine then twenty, left to right, because children are always pushed left first. On odd levels we simply write each value from the end of the row instead of the start: twenty, nine.' : undefined };
  });
  v.eq(`[${zz(T).map((l) => `[${l}]`).join(', ')}]`, 'ok').say('Knowing the level size up front lets us fill the row from either end in one pass.');
  v.answer(zz(T));

  recap(v, [{ name: 'Level order + reverse', time: 'O(n)', space: 'O(width)' }, { name: 'Write rows in direction', time: 'O(n)', space: 'O(width)' }], 'Keep the queue order; change where you write.', ['Alternating direction per level → fill rows from the other end'], 'Don’t reorder the queue; reorder the output.');
  void words;
  return v.build();
}

const problem: Problem = {
  slug: 'binary-tree-zigzag-level-order-traversal',
  statement: 'Given the `root` of a binary tree, return the zigzag level order traversal of its nodes’ values (left to right, then right to left for the next level, alternating).',
  examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[20,9],[15,7]]' }, { input: 'root = [1]', output: '[[1]]' }, { input: 'root = []', output: '[]' }],
  constraints: ['0 ≤ nodes ≤ 2000'],
  hints: ['BFS as usual; change the writing direction.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Reverse odd levels', idea: 'Normal level order, then reverse every second list.', time: 'O(n)', space: 'O(width)', bottleneck: 'Extra pass.' },
    { id: 'optimal', kind: 'optimal', name: 'Direction-aware rows', idea: 'Place the i-th value at i or size − 1 − i.', time: 'O(n)', space: 'O(width)' },
  ],
  takeaway: 'Reorder the **output**, not the queue.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'zigzagLevelOrder', params: ['TreeNode'], ret: 'List<List<Integer>>',
    tests: [{ args: [[3, 9, 20, null, null, 15, 7]], out: [[3], [20, 9], [15, 7]] }, { args: [[1]], out: [[1]] }, { args: [[]], out: [] }, { args: [T], out: zz(T) }],
    gen: (r: Rng) => [randomTree(r)],
    ref: (lv: Level) => zz(lv),
  },
};

export default problem;
