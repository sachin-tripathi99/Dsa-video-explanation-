import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { orderIds } from '../../treevid';

const T = [1, 2, 3, 4, 5, null, 6];

function video() {
  const v = new Video('tree-dfs', 'Depth-first search on trees');
  v.chapter('intro', 'Go deep first');
  v.binaryTree('t', T, { label: 'a binary tree' });
  v.say('Depth-first search walks a tree by going as deep as possible down one branch before backing up to try the next. On trees it is almost always written as a short recursive function. The only question is when the node itself is processed: before, between, or after its children.');

  const run = (kind: 'pre' | 'in' | 'post', title: string, code: string[], first: string) => {
    v.chapter(kind, title, { code });
    v.clear();
    const t = v.binaryTree('t', T, { label: `${kind}-order` });
    const out = v.array('o', [], { label: 'visit order' });
    const ids = orderIds(t, kind);
    ids.forEach((id, i) => {
      t.clearTones(); ids.slice(0, i).forEach((x) => t.tone(x, 'done')); t.tone(id, 'active');
      out.push(t.val(id) as number);
      v.line(kind === 'pre' ? 1 : kind === 'in' ? 2 : 3).eq(`visit ${t.val(id)}`);
      if (i === 0) v.say(first); else v.hold(500);
    });
    t.clearTones();
    v.eq(`${kind}-order: [${ids.map((x) => t.val(x)).join(', ')}]`, 'ok').hold(900);
  };
  run('pre', 'Pre-order: node, left, right', ['dfs(node):', '  visit(node)          # before the children', '  dfs(node.left)', '  dfs(node.right)'], 'Pre-order visits the node first, then its whole left subtree, then its right subtree. The root always comes first. Use it to copy or serialise a tree, or to pass information down from parent to child.');
  v.say('Pre-order: root first, then left, then right.');
  run('in', 'In-order: left, node, right', ['dfs(node):', '  dfs(node.left)', '  visit(node)          # between the children', '  dfs(node.right)'], 'In-order finishes the entire left subtree before visiting the node. In a binary search tree this gives the values in sorted order.');
  v.say('In-order: left, node, right. For a BST, sorted order.');
  run('post', 'Post-order: left, right, node', ['dfs(node):', '  dfs(node.left)', '  dfs(node.right)', '  visit(node)          # after the children'], 'Post-order visits a node only after both of its subtrees are done. So when we reach a node, its children already have their answers.');
  v.say('Post-order: children first, then the node. This is the most useful one for computing answers.');

  v.chapter('ask', 'The post-order trick: ask your children', { code: ['solve(node):', '  if node is null: return BASE', '  a = solve(node.left); b = solve(node.right)', '  return combine(node, a, b)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'each node returns the height of its subtree' });
  const h: Record<string, number> = {};
  const post = orderIds(t, 'post');
  post.forEach((id, i) => {
    const l = t.left(id), r = t.right(id);
    h[id] = 1 + Math.max(l ? h[l] : 0, r ? h[r] : 0);
    t.clearTones(); post.slice(0, i).forEach((x) => t.tone(x, 'done')); t.tone(id, 'active');
    t.badge(id, h[id]);
    v.line(2, 3).eq(`height(${t.val(id)}) = 1 + max(${l ? h[l] : 0}, ${r ? h[r] : 0}) = ${h[id]}`);
    if (i === 0) v.say('Most tree problems are solved the same way. A null child returns a base value. Every node asks its two children for their answers and combines them. Here the question is height: a leaf gets one plus the maximum of zero and zero.');
    else if (id === 't0') v.say(`The root combines its children’s heights, two and two, into three. Each node is visited once: O of n time and O of h stack space, where h is the height.`);
    else v.hold(600);
  });

  v.chapter('shapes', 'Three shapes of tree DFS');
  v.clear();
  v.table('s', ['Shape', 'Information flows', 'Examples'], [
    ['return a value up', 'children → parent (post-order)', 'height, balanced, subtree sums'],
    ['pass state down', 'parent → children (pre-order)', 'path sum, root-to-leaf paths'],
    ['return one thing, record another', 'up, plus a global best', 'diameter, maximum path sum'],
  ]);
  v.say(`Tree DFS comes in three shapes. Return a value upwards, like height. Pass state downwards, like the remaining sum on a path. Or return one thing to the parent while updating a global best on the side, like the diameter, where the path through a node is not the same as what the node returns.`);
  void words;
  return v.build();
}

const body = String.raw`
## The idea

**DFS** on a tree goes as deep as possible before backtracking. The recursive template differs only in **where the node is processed**:

| Order | Sequence | Typical use |
|---|---|---|
| Pre-order | node, left, right | copy / serialise a tree, pass state down |
| In-order | left, node, right | sorted order of a BST |
| Post-order | left, right, node | compute answers from children (height, sums) |

> Real-life picture: exploring every room of a building by always taking the next unexplored corridor, and walking back only when a corridor ends.

## The post-order template

\`\`\`java
int solve(TreeNode node) {
    if (node == null) return BASE;
    int a = solve(node.left), b = solve(node.right);   // ask the children
    return combine(node.val, a, b);                     // answer for this subtree
}
\`\`\`

\`\`\`python
def solve(node):
    if not node:
        return BASE
    a, b = solve(node.left), solve(node.right)          # ask the children
    return combine(node.val, a, b)                      # answer for this subtree
\`\`\`

\`\`\`cpp
int solve(TreeNode* node) {
    if (!node) return BASE;
    int a = solve(node->left), b = solve(node->right);  // ask the children
    return combine(node->val, a, b);                    // answer for this subtree
}
\`\`\`

## Three shapes

1. **Return up:** height, size, is-balanced, subtree sum.
2. **Pass down:** remaining target, current path, depth, allowed range (BST validation).
3. **Return one thing, record another:** the diameter or maximum path sum passes through a node, but the node can only return one branch to its parent. Keep a global best.

## Complexity

Every node is visited once: **O(n)** time. The recursion stack holds one frame per level: **O(h)** space, where h is log n for balanced trees and n for a chain.

## Iterative versions

A stack replaces recursion (pre-order: push right then left). **Morris traversal** uses temporary "threads" to the in-order successor and needs O(1) extra space.
`;

const lesson: Lesson = {
  slug: 'tree-dfs',
  video,
  body,
  quiz: [
    { q: 'Which traversal lists a BST in sorted order?', options: ['pre-order', 'in-order', 'post-order', 'level-order'], answer: 1, why: 'Left subtree < node < right subtree.' },
    { q: 'To compute each subtree’s height, the natural order is…', options: ['pre-order', 'in-order', 'post-order', 'any'], answer: 2, why: 'A node needs its children’s heights first.' },
    { q: 'Space used by recursive DFS on a tree of height h?', options: ['O(1)', 'O(h)', 'O(n log n)', 'O(n²)'], answer: 1, why: 'One stack frame per level of the current path.' },
    { q: 'Why does diameter need a global variable?', options: ['it is faster', 'the best path through a node is not what the node returns to its parent', 'recursion cannot return ints', 'to avoid overflow'], answer: 1, why: 'A node returns its longest single branch; the diameter joins two branches.' },
  ],
};

export default lesson;
