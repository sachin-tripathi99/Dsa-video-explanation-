import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const T = [1, 2, 3, 4, 5, 6];

function video() {
  const v = new Video('count-complete', 'Count Complete Tree Nodes');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'a complete tree: every level full except the last, filled from the left' });
  v.say('Count the nodes of a complete binary tree. Visiting every node is easy, but can we do better than O of n by using the shape?');

  v.chapter('brute', 'Count every node', { cx: 'O(n)', code: ['count(node) = 0 if null else 1 + count(left) + count(right)'] });
  v.eq('visits all 6 nodes').say('Plain counting visits every node: O of n. It ignores that the tree is complete.');

  v.chapter('optimal', 'Use perfect subtrees', { cx: 'O(log² n)', code: ['lh = height going always left', 'rh = height going always right', 'if lh == rh: return 2^lh − 1   (perfect!)', 'else: return 1 + count(left) + count(right)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'compare leftmost and rightmost depth' });
  t.tone(['t0', 't1', 't3'], 'active').tone(['t2'], 'warn');
  v.line(0, 1).eq('root: left height 3, right height 2 → not perfect', 'warn');
  v.say('At the root, walk straight down the left edge: three levels. Walk down the right edge: two levels. They differ, so this tree is not perfect. Recurse into both children.');
  t.clearTones().tone(['t1', 't3', 't4'], 'ok');
  v.line(2).eq('subtree 2: left 2 = right 2 → perfect → 2² − 1 = 3 nodes', 'ok').say('The subtree at two: its left edge and right edge both have two levels. That means it is perfect, so it has two squared minus one, three nodes, without visiting them.');
  t.tone(['t2', 't5'], 'warn');
  v.eq('subtree 3: left 2, right 1 → recurse (small)', 'warn').say('The subtree at three is not perfect, so we recurse, but only down one side. In a complete tree, at every level one of the two children is perfect.');
  v.eq('total = 1 + 3 + 2 = 6', 'ok').note('log n levels × O(log n) height checks').say('The total is six. At most one recursive branch continues per level, and each level measures heights in log n steps: O of log squared n.');
  v.answer(6);
  recap(v, [{ name: 'Count every node', time: 'O(n)', space: 'O(h)' }, { name: 'Skip perfect subtrees', time: 'O(log² n)', space: 'O(log n)' }], 'A complete tree always has at least one perfect subtree at each step, counted by formula.', ['Perfect tree of height h has 2^h − 1 nodes', 'Use structural guarantees to skip work'], 'Special shapes come with shortcuts. A perfect subtree can be counted without visiting it.');
  return v.build();
}

const problem: Problem = {
  slug: 'count-complete-tree-nodes',
  statement: 'Given the `root` of a **complete** binary tree (every level full except possibly the last, which is filled from the left), return the number of nodes. Design an algorithm that runs in less than O(n).',
  examples: [{ input: 'root = [1,2,3,4,5,6]', output: '6' }, { input: 'root = []', output: '0' }, { input: 'root = [1]', output: '1' }],
  constraints: ['0 ≤ nodes ≤ 5 · 10⁴', 'the tree is complete'],
  hints: ['How many nodes does a perfect tree of height h have?', 'Compare the leftmost depth and the rightmost depth.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count every node', idea: '`1 + count(left) + count(right)`.', time: 'O(n)', space: 'O(h)', bottleneck: 'Ignores the complete shape.' },
    { id: 'optimal', kind: 'optimal', name: 'Skip perfect subtrees', idea: 'If the leftmost and rightmost heights are equal, the subtree is perfect: return `2^h − 1`. Otherwise `1 + count(left) + count(right)`.', time: 'O(log² n)', space: 'O(log n)' },
  ],
  takeaway: 'Use the tree’s **guaranteed shape**: perfect subtrees are counted with a formula.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'countNodes', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [[1, 2, 3, 4, 5, 6]], out: 6 }, { args: [[]], out: 0 }, { args: [[1]], out: 1 }],
    gen: (r) => { const n = r.int(0, 40); return [Array.from({ length: n }, (_, i) => i + 1)]; },
    ref: (a: number[]) => a.length,
  },
};

export default problem;
