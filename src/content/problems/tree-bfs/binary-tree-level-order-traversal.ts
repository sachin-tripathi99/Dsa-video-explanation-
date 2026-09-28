import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { levelScene } from '../../treevid';

const T: Level = [3, 9, 20, null, null, 15, 7];
export function levels(lv: Level) { const out: number[][] = []; let q: TNode[] = []; const r = build(lv); if (r) q = [r]; while (q.length) { out.push(q.map((n) => n.v)); q = q.flatMap((n) => [n.l, n.r].filter((x): x is TNode => !!x)); } return out; }

function video() {
  const v = new Video('level-order', 'Binary Tree Level Order Traversal');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [3,9,20,null,null,15,7]' });
  v.say('Return the node values level by level, from left to right: one list per level.');
  v.eq(`[${levels(T).map((l) => `[${l}]`).join(', ')}]`);

  v.chapter('brute', 'DFS that passes the depth', { cx: 'O(n) · O(h) stack', code: ['dfs(node, depth):', '  if depth == len(out): out.append([])', '  out[depth].append(node.val)', '  dfs(left, depth + 1); dfs(right, depth + 1)'] });
  v.eq('works: pre-order visits each level left to right', 'warn').say('A DFS can do it too: carry the depth, and append each value to the list for its depth. Because left is visited before right, each list ends up in left-to-right order. It works, but BFS matches the question directly.');

  v.chapter('optimal', 'BFS with a level-size snapshot', { cx: 'O(n) · O(width)', code: ['queue = [root]', 'while queue: size = len(queue)', '  level = pop size nodes, collecting values', '  (children go to the back)', '  out.append(level)'] });
  let first = true;
  levelScene(v, T, 'one list per level', (vals, d) => {
    const say = first ? 'The queue holds exactly one level at a time. Pop that many nodes, collect their values into a list, and push their children for the next level.' : undefined;
    first = false;
    return { eq: `level ${d}: [${vals.join(', ')}]`, ok: true, say };
  });
  v.eq(`[${levels(T).map((l) => `[${l}]`).join(', ')}]`, 'ok').say('Three lists. Each node is enqueued and dequeued once.');
  v.answer(levels(T));

  recap(v, [{ name: 'DFS with depth', time: 'O(n)', space: 'O(h)' }, { name: 'BFS by level size', time: 'O(n)', space: 'O(width)' }], 'Read the queue size; pop that many; that is one level.', ['Anything “per level” → BFS with a size snapshot'], 'This loop is the template for every problem in this module.');
  void words;
  return v.build();
}

const problem: Problem = {
  slug: 'binary-tree-level-order-traversal',
  statement: 'Given the `root` of a binary tree, return the level order traversal of its nodes’ values (from left to right, level by level).',
  examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }, { input: 'root = [1]', output: '[[1]]' }, { input: 'root = []', output: '[]' }],
  constraints: ['0 ≤ nodes ≤ 2000'],
  hints: ['How many nodes of the current level are in the queue?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS with depth', idea: 'Append to out[depth] during a pre-order DFS.', time: 'O(n)', space: 'O(h)', bottleneck: 'Indirect; recursion depth.' },
    { id: 'optimal', kind: 'optimal', name: 'BFS', idea: 'Queue; per level pop `size` nodes.', time: 'O(n)', space: 'O(width)' },
  ],
  takeaway: '**Size snapshot** = one level.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'levelOrder', params: ['TreeNode'], ret: 'List<List<Integer>>',
    tests: [{ args: [T], out: [[3], [9, 20], [15, 7]] }, { args: [[1]], out: [[1]] }, { args: [[]], out: [] }],
    gen: (r: Rng) => [randomTree(r)],
    ref: (lv: Level) => levels(lv),
  },
};

export default problem;
