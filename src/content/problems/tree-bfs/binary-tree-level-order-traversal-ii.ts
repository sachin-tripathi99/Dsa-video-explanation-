import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { levelScene } from '../../treevid';

const T: Level = [3, 9, 20, null, null, 15, 7];
function bottomUp(lv: Level) { const out: number[][] = []; let q: TNode[] = []; const r = build(lv); if (r) q = [r]; while (q.length) { out.push(q.map((n) => n.v)); q = q.flatMap((n) => [n.l, n.r].filter((x): x is TNode => !!x)); } return out.reverse(); }

function video() {
  const v = new Video('level-order-ii', 'Binary Tree Level Order Traversal II');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [3,9,20,null,null,15,7]' });
  v.say('Return the level order traversal from the bottom level up to the root, each level still left to right.');
  v.eq(`[${bottomUp(T).map((l) => `[${l}]`).join(', ')}]`);

  v.chapter('brute', 'Collect each depth separately, deepest first', { cx: 'O(n · h)', code: ['h = height of the tree', 'for d from h − 1 down to 0:', '  collect all nodes at depth d (a full DFS each time)'] });
  v.eq('a full traversal for every level', 'warn').say('One could compute the height and then, for each depth from the bottom up, walk the whole tree collecting that depth. That repeats the traversal h times.');

  v.chapter('optimal', 'Normal BFS, then reverse the list of levels', { cx: 'O(n)', code: ['levels = BFS level order (top-down)', 'reverse(levels)   # O(number of levels)'] });
  const rows: number[][] = [];
  levelScene(v, T, 'build top-down, reverse at the end', (vals, d) => {
    rows.push(vals);
    return { eq: `level ${d}: [${vals.join(', ')}]`, say: d === 0 ? 'Run the ordinary level-order BFS. Collecting top-down is natural for a queue.' : undefined };
  }, [0]);
  v.line(1).eq(`reverse → [${[...rows].reverse().map((l) => `[${l}]`).join(', ')}]`, 'ok').say('Then reverse the list of levels. Only the outer list is reversed, which costs one step per level; the values inside each level keep their left-to-right order. Alternatively insert each level at the front of a linked list.');
  v.answer(bottomUp(T));

  recap(v, [{ name: 'One DFS per depth', time: 'O(n · h)', space: 'O(h)' }, { name: 'BFS + reverse levels', time: 'O(n)', space: 'O(width)' }], 'Build top-down, reverse the outer list.', ['Bottom-up level order → normal BFS + reverse'], 'Do the natural order, then fix the presentation.');
  void words;
  return v.build();
}

const problem: Problem = {
  slug: 'binary-tree-level-order-traversal-ii',
  statement: 'Given the `root` of a binary tree, return the bottom-up level order traversal of its nodes’ values (from left to right, level by level from leaf to root).',
  examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[15,7],[9,20],[3]]' }, { input: 'root = [1]', output: '[[1]]' }, { input: 'root = []', output: '[]' }],
  constraints: ['0 ≤ nodes ≤ 2000'],
  hints: ['Do the normal level order first.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS per depth', idea: 'For each depth from the bottom, traverse the whole tree collecting that depth.', time: 'O(n · h)', space: 'O(h)', bottleneck: 'Repeated traversals.' },
    { id: 'optimal', kind: 'optimal', name: 'BFS + reverse', idea: 'Level order, then reverse the outer list.', time: 'O(n)', space: 'O(width)' },
  ],
  takeaway: 'Top-down BFS, then **reverse**.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'levelOrderBottom', params: ['TreeNode'], ret: 'List<List<Integer>>',
    tests: [{ args: [T], out: [[15, 7], [9, 20], [3]] }, { args: [[1]], out: [[1]] }, { args: [[]], out: [] }],
    gen: (r: Rng) => [randomTree(r)],
    ref: (lv: Level) => bottomUp(lv),
  },
};

export default problem;
