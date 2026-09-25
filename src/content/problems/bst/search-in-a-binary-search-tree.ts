import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomBst, toLevel, type TNode } from '../../treeutil';

const T = [4, 2, 7, 1, 3];
const X = 2;

function video() {
  const v = new Video('search-bst', 'Search in a Binary Search Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'BST' });
  v.say(`Find the node whose value is ${words(X)} and return the subtree rooted there, or null if it does not exist.`);

  v.chapter('brute', 'Brute force: search every node', { cx: 'O(n)', code: ['dfs(node): if null → null; if val == x → node', '  return dfs(left) or dfs(right)'] });
  v.eq('ignores the BST ordering').say('A general tree search checks every node. It works on any tree, but ignores the ordering that a BST gives us.');

  v.chapter('optimal', 'Optimal: go left or right', { cx: 'O(h)', code: ['while node and node.val != x:', '  node = node.left if x < node.val else node.right', 'return node'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: `searching for ${X}` });
  let id: string | null = 't0';
  const seen: string[] = [];
  while (id && t.val(id) !== X) {
    const val = t.val(id) as number;
    t.clearTones().tone(seen, 'path').tone(id, 'active').ptr('node', id);
    v.line(1).eq(`${X} ${X < val ? '<' : '>'} ${val} → go ${X < val ? 'left' : 'right'}`);
    v.say(`${words(X)} is ${X < val ? 'smaller' : 'bigger'} than ${words(val)}, so it can only be in the ${X < val ? 'left' : 'right'} subtree.`);
    seen.push(id);
    id = X < val ? t.left(id) : t.right(id);
  }
  if (id) {
    t.clearTones().tone(seen, 'path').tone(id, 'ok').ptr('node', id);
    const sub: string[] = [];
    const walk = (x: string | null) => { if (!x) return; sub.push(x); walk(t.left(x)); walk(t.right(x)); };
    walk(id);
    t.tone(sub, 'ok');
    v.line(2).eq(`found → return subtree rooted at ${X}`, 'ok').say(`Found ${words(X)}. Return that node; its subtree comes along with it. Only one path was followed: O of h.`);
  }
  let n: TNode | null = build(T);
  while (n && n.v !== X) n = X < n.v ? n.l : n.r;
  v.answer(toLevel(n));
  recap(v, [{ name: 'Search every node', time: 'O(n)', space: 'O(h)' }, { name: 'Follow the BST order', time: 'O(h)', space: 'O(1)' }], 'Each comparison discards a whole subtree.', ['BST → at each node go left or right, never both'], 'In a BST, one comparison tells you which half to ignore.');
  return v.build();
}

const problem: Problem = {
  slug: 'search-in-a-binary-search-tree',
  statement: 'Given the `root` of a BST and an integer `val`, return the subtree rooted at the node whose value equals `val`, or `null` if there is no such node.',
  examples: [{ input: 'root = [4,2,7,1,3], val = 2', output: '[2,1,3]' }, { input: 'root = [4,2,7,1,3], val = 5', output: '[]' }],
  constraints: ['1 ≤ nodes ≤ 5000', 'values are unique'],
  hints: ['Compare val with the current node: which side can it be on?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Full tree search', idea: 'DFS through every node.', time: 'O(n)', space: 'O(h)', bottleneck: 'Visits nodes the BST property tells us to skip.' },
    { id: 'optimal', kind: 'optimal', name: 'Follow the BST order', idea: 'While the node exists and differs, go left if val is smaller, right otherwise.', time: 'O(h)', space: 'O(1)' },
  ],
  takeaway: 'BST search follows **one path**: O(height).',
  video,
  videoArgs: [T, X],
  judge: {
    type: 'fn', fn: 'searchBST', params: ['TreeNode', 'int'], ret: 'TreeNode',
    tests: [{ args: [[4, 2, 7, 1, 3], 2], out: [2, 1, 3] }, { args: [[4, 2, 7, 1, 3], 5], out: [] }],
    gen: (r) => [randomBst(r), r.int(1, 60)],
    ref: (lv: (number | null)[], x: number) => { let n = build(lv); while (n && n.v !== x) n = x < n.v ? n.l : n.r; return toLevel(n); },
  },
};

export default problem;
