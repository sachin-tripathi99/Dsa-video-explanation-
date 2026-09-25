import type { Lesson } from '../../types';
import { Video } from '../../helpers';

function video() {
  const v = new Video('binary-trees', 'Trees and binary trees');
  v.chapter('intro', 'Family trees and folders');
  const t = v.binaryTree('t', [3, 9, 20, null, null, 15, 7], { label: 'a binary tree' });
  v.say('A tree is a hierarchy: a family tree, the folders on your computer, a company org chart. There is one top node, the root, and every other node has exactly one parent.');
  t.tone('t0', 'active').ptr('root', 't0');
  v.eq('root = 3').hold(700);
  t.clearTones().tone(['t1', 't5', 't6'], 'ok');
  v.eq('leaves: nodes with no children (9, 15, 7)', 'ok').say('Nodes with no children are leaves. In a binary tree, every node has at most two children: a left child and a right child.');
  t.clearTones().noPtr();

  v.chapter('words', 'Vocabulary');
  t.badge('t0', 'd0').badge('t1', 'd1').badge('t2', 'd1').badge('t5', 'd2').badge('t6', 'd2');
  v.eq('depth = edges from the root · height = edges on the longest path down to a leaf');
  v.say('Depth is how far a node is from the root. The height of the tree is the length of the longest root to leaf path. Here, depth two at the bottom, so height two.');
  t.clearBadges();
  t.tone(['t2', 't5', 't6'], 'path');
  v.eq('subtree rooted at 20', 'warn').say('Every node is itself the root of a smaller tree, its subtree. That is the key idea: a tree is made of smaller trees. So recursion fits trees perfectly.');
  t.clearTones();

  v.chapter('recursion', 'Thinking recursively: height', { code: ['height(node):', '  if node is null: return 0', '  return 1 + max(height(left), height(right))'] });
  const order = ['t1', 't5', 't6', 't2', 't0'];
  const h: Record<string, number> = { t1: 1, t5: 1, t6: 1, t2: 2, t0: 3 };
  v.say('To find the height, measured here in levels, ask each child for its height and add one for yourself. The answers flow up from the leaves.');
  order.forEach((id, i) => {
    t.clearTones().tone(id, 'active');
    for (const done of order.slice(0, i)) t.tone(done, 'done');
    t.badge(id, `h=${h[id]}`);
    v.line(id === 't1' || id === 't5' || id === 't6' ? 1 : 2).eq(id === 't0' ? 'height(3) = 1 + max(1, 2) = 3' : `height(${t.val(id)}) = ${h[id]}`);
    if (i === 0) v.say('Nine is a leaf. Its children are null, height zero, so nine has height one.');
    else if (id === 't2') v.say('Twenty gets one from each child, so its height is two.');
    else if (id === 't0') v.say('The root gets one from the left and two from the right: its height is three. That is the whole algorithm, and it visits each node once.');
    else v.hold(600);
  });
  t.clearTones().clearBadges();

  v.chapter('traversals', 'Four ways to visit every node');
  v.clear();
  v.table('tr', ['Traversal', 'Order', 'For [3,9,20,null,null,15,7]'], [
    ['Pre-order', 'node, left, right', '3, 9, 20, 15, 7'],
    ['In-order', 'left, node, right', '9, 3, 15, 20, 7'],
    ['Post-order', 'left, right, node', '9, 15, 7, 20, 3'],
    ['Level-order (BFS)', 'level by level', '3, 9, 20, 15, 7'],
  ]);
  v.say('There are four standard ways to visit every node. Pre-order visits a node before its children, in-order between them, post-order after them, and level-order goes level by level. Each gets its own module later.');

  v.chapter('shapes', 'Special shapes');
  v.clear();
  v.table('s', ['Shape', 'Meaning'], [
    ['Full', 'every node has 0 or 2 children'],
    ['Complete', 'all levels full except maybe the last, filled from the left (heaps)'],
    ['Perfect', 'all levels completely full: 2^h − 1 nodes'],
    ['Balanced', 'left and right heights differ by at most 1 everywhere → height O(log n)'],
    ['Degenerate', 'every node has one child → it is a linked list, height n'],
  ]);
  v.say('Shapes matter for speed. A balanced tree has height log n, so walking from root to leaf is fast. A degenerate tree is just a linked list with height n.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Trees in one breath', lines: ['Root, children, leaves; every node roots a subtree', 'Most tree problems = "ask the children, combine, return"', 'Visiting every node is O(n); stack depth is the height', 'Balanced → height O(log n); degenerate → O(n)'] });
  v.say('Ask the children, combine their answers, return. Almost every tree problem in this course is that sentence.');
  return v.build();
}

const body = String.raw`
## The idea

A **tree** is a hierarchy of nodes with one **root** and no cycles; every other node has exactly one **parent**. In a **binary tree**, each node has at most two children: **left** and **right**.

> Real-life picture: folders on your computer. The drive is the root, folders contain folders, and files are leaves.

\`\`\`java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
\`\`\`

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
\`\`\`

\`\`\`cpp
struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
\`\`\`

## Vocabulary

| Term | Meaning |
|---|---|
| root | the top node |
| leaf | a node with no children |
| depth of a node | number of edges from the root |
| height of a tree | edges (or levels) on the longest root-to-leaf path |
| subtree | a node plus all its descendants |
| balanced | at every node, left and right heights differ by ≤ 1 |

LeetCode writes trees in **level order** with \`null\` for missing children: \`[3,9,20,null,null,15,7]\`.

## The recursive template

Most tree problems follow one shape: **handle null, ask the children, combine, return.**

\`\`\`java
int solve(TreeNode node) {
    if (node == null) return BASE;          // e.g. 0
    int l = solve(node.left);
    int r = solve(node.right);
    return combine(node.val, l, r);         // e.g. 1 + Math.max(l, r)
}
\`\`\`

\`\`\`python
def solve(node):
    if not node:
        return BASE                         # e.g. 0
    l = solve(node.left)
    r = solve(node.right)
    return combine(node.val, l, r)          # e.g. 1 + max(l, r)
\`\`\`

\`\`\`cpp
int solve(TreeNode* node) {
    if (!node) return BASE;                 // e.g. 0
    int l = solve(node->left);
    int r = solve(node->right);
    return combine(node->val, l, r);        // e.g. 1 + max(l, r)
}
\`\`\`

- **Time:** O(n); each node is visited once.
- **Space:** O(h) for the recursion stack, where h is the height: O(log n) if balanced, O(n) if degenerate.

## Traversals

| Traversal | Order | Typical use |
|---|---|---|
| Pre-order | node, left, right | copy / serialise a tree, root-to-leaf paths |
| In-order | left, node, right | BSTs: gives sorted order |
| Post-order | left, right, node | compute from children: height, diameter, delete |
| Level-order | level by level (queue) | per-level answers, shortest depth |

Each has its own module: [Tree DFS](#/learn/tree-dfs) and [Tree BFS](#/learn/tree-bfs).

## Shapes

- **Complete:** every level full except possibly the last, filled left to right. Heaps are stored this way.
- **Perfect:** every level full: exactly 2^h − 1 nodes.
- **Balanced:** height O(log n). Balanced BSTs (red-black, AVL) power \`TreeMap\` and \`std::map\`.
- **Degenerate:** a chain; height n, so recursion can overflow for large n.
`;

const lesson: Lesson = {
  slug: 'binary-trees',
  video,
  body,
  quiz: [
    { q: 'In the tree [3,9,20,null,null,15,7], which nodes are leaves?', options: ['3 and 20', '9, 15 and 7', 'only 7', '9 and 20'], answer: 1, why: 'They have no children.' },
    { q: 'Recursion space for a tree algorithm is proportional to…', options: ['the number of nodes', 'the height of the tree', 'the number of leaves', 'always O(1)'], answer: 1, why: 'Only one root-to-node path is on the call stack at a time.' },
    { q: 'Which traversal visits the node between its left and right subtrees?', options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'], answer: 1, why: 'left, node, right.' },
    { q: 'A perfect binary tree of height h (levels) has how many nodes?', options: ['h', '2h', '2^h − 1', 'h²'], answer: 2, why: '1 + 2 + 4 + … + 2^(h−1) = 2^h − 1.' },
  ],
};

export default lesson;
