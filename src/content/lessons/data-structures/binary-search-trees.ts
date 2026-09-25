import type { Lesson } from '../../types';
import { Video } from '../../helpers';

const T = [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13];

function video() {
  const v = new Video('bst', 'Binary search trees');
  v.chapter('intro', 'Smaller left, bigger right');
  const t = v.binaryTree('t', T, { label: 'a binary search tree' });
  v.say('A binary search tree is a binary tree with one rule: everything in a node’s left subtree is smaller than the node, and everything in its right subtree is bigger. Not just the children: the whole subtrees.');
  t.tone('t0', 'pivot').tone(['t1', 't3', 't4', 't9', 't10'], 'ok').tone(['t2', 't6', 't11'], 'warn');
  v.eq('left of 8: {3, 1, 6, 4, 7} all < 8 · right: {10, 14, 13} all > 8');
  v.say('Everything left of eight is smaller than eight, and everything to its right is bigger. The same holds at every node.');
  t.clearTones();

  v.chapter('search', 'Search: one path down', { code: ['node = root', 'while node and node.val != x:', '  node = node.left if x < node.val else node.right', 'return node'] });
  const path = ['t0', 't1', 't4', 't10'];
  const x = 7;
  path.forEach((id, i) => {
    t.clearTones().tone(path.slice(0, i), 'path').tone(id, t.val(id) === x ? 'ok' : 'active');
    t.ptr('node', id);
    const val = t.val(id) as number;
    v.line(val === x ? 3 : 2).eq(val === x ? `found ${x}` : `${x} ${x < val ? '<' : '>'} ${val} → go ${x < val ? 'left' : 'right'}`, val === x ? 'ok' : 'none');
    if (i === 0) v.say('To find seven, compare with the root. Seven is less than eight, so it can only be on the left. We never look at the right subtree at all.');
    else if (i === 1) v.say('Seven is more than three: go right.');
    else if (val === x) v.say('Found in four steps. Each comparison throws away a whole subtree, like binary search on an array. The cost is the height of the tree.');
    else v.hold(700);
  });
  t.noPtr().clearTones();

  v.chapter('insert', 'Insert: search, then attach', { code: ['walk down as if searching for x', 'attach x where you fall off the tree'] });
  const ins = [['t0', 'right'], ['t2', 'right'], ['t6', 'left'], ['t11', 'left']] as const;
  ins.forEach(([id], i) => {
    t.clearTones().tone(id, 'active');
    v.eq(`11 vs ${t.val(id)} → ${11 < (t.val(id) as number) ? 'left' : 'right'}`).hold(i === 0 ? 900 : 600);
  });
  const nid = t.add('t11', 11, 0, 'n11');
  t.clearTones().tone(nid, 'ok');
  v.line(1).eq('11 attached as the left child of 13', 'ok').say('Inserting eleven: walk down as if searching for it. Right of eight, right of ten, left of fourteen, left of thirteen. We fall off the tree there, so eleven goes exactly in that spot.');
  t.clearTones();

  v.chapter('inorder', 'In-order traversal is sorted');
  const inorder: string[] = [];
  const walk = (id: string | null) => { if (!id) return; walk(t.left(id)); inorder.push(id); walk(t.right(id)); };
  walk('t0');
  const arr = v.array('sorted', [], { label: 'in-order output' });
  v.layout('col');
  inorder.forEach((id, i) => {
    t.clearTones().tone(inorder.slice(0, i), 'done').tone(id, 'active');
    arr.push(t.val(id) as number).clearTones().tone(i, 'active');
    if (i === 0) v.say('An in-order traversal, left subtree, then the node, then the right subtree, visits a BST in sorted order.');
    else v.hold(350);
  });
  arr.clearTones().toneRange(0, inorder.length - 1, 'sorted');
  v.eq('sorted!', 'ok').say('One, three, four, six, seven, eight… sorted. Many BST problems are just "do an in-order traversal".');

  v.chapter('balance', 'Why balance matters');
  v.clear();
  const bad = v.tree('chain', { label: 'insert 1, 2, 3, 4, 5 in order → a chain', binary: true });
  let prev = bad.add(null, 1);
  for (let k = 2; k <= 5; k++) prev = bad.add(prev, k, 1);
  v.eq('height n → search O(n)', 'bad').say('The catch: if you insert values in sorted order, every new value goes right, and the tree becomes a chain. Search degrades to O of n. Self-balancing trees, like red-black and AVL trees, rotate nodes to keep the height at log n. Java TreeMap and C plus plus map are built on them.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.table('ops', ['Operation', 'Balanced BST', 'Unbalanced (worst)'], [
    ['search / insert / delete', 'O(log n)', 'O(n)'],
    ['min / max', 'O(log n)', 'O(n)'],
    ['in-order (sorted) traversal', 'O(n)', 'O(n)'],
    ['floor / ceiling / range queries', 'O(log n)', 'O(n)'],
  ]);
  v.say('A BST keeps data sorted while allowing fast inserts and deletes. Use it, usually through TreeMap, SortedList or std map, when you need order plus updates.');
  return v.build();
}

const body = String.raw`
## The BST property

For **every** node: all values in its left subtree are **smaller**, and all values in its right subtree are **larger** (usually no duplicates).

> Real-life picture: a guessing game. "Is it bigger or smaller than 50?" Each answer rules out half of what's left.

It's the whole subtree that matters, not just the children. \`[5, 1, 6, null, null, 3, 7]\` is **not** a BST even though each parent/child pair looks fine: 3 is in 5's right subtree but smaller than 5.

## Operations

\`\`\`java
TreeNode search(TreeNode root, int x) {
    while (root != null && root.val != x) root = x < root.val ? root.left : root.right;
    return root;
}

TreeNode insert(TreeNode root, int x) {
    if (root == null) return new TreeNode(x);
    if (x < root.val) root.left = insert(root.left, x);
    else root.right = insert(root.right, x);
    return root;
}
\`\`\`

\`\`\`python
def search(root, x):
    while root and root.val != x:
        root = root.left if x < root.val else root.right
    return root

def insert(root, x):
    if not root:
        return TreeNode(x)
    if x < root.val:
        root.left = insert(root.left, x)
    else:
        root.right = insert(root.right, x)
    return root
\`\`\`

\`\`\`cpp
TreeNode* search(TreeNode* root, int x) {
    while (root && root->val != x) root = x < root->val ? root->left : root->right;
    return root;
}

TreeNode* insert(TreeNode* root, int x) {
    if (!root) return new TreeNode(x);
    if (x < root->val) root->left = insert(root->left, x);
    else root->right = insert(root->right, x);
    return root;
}
\`\`\`

**Delete** has three cases: a leaf (just remove it), one child (replace the node by its child), two children (replace the value with the in-order successor, the smallest value in the right subtree, then delete that successor). See [Delete Node in a BST](#/problem/delete-node-in-a-bst).

## Costs

| Operation | Balanced | Worst case (chain) |
|---|---|---|
| search / insert / delete | O(log n) | O(n) |
| min / max | O(log n) | O(n) |
| in-order traversal (sorted) | O(n) | O(n) |

Inserting sorted data into a plain BST creates a chain. Self-balancing BSTs (AVL, red-black) fix that with rotations; you use them through libraries:

| Language | Sorted map / set |
|---|---|
| Java | \`TreeMap\`, \`TreeSet\`: \`floorKey\`, \`ceilingKey\`, \`headMap\`, \`tailMap\` |
| Python | no built-in; \`sortedcontainers.SortedList\` (not on every judge), or \`bisect\` on a list |
| C++ | \`std::map\`, \`std::set\`: \`lower_bound\`, \`upper_bound\` |

## Problem-solving tips

- **In-order = sorted.** Kth smallest, validate, min difference: all in-order traversals.
- **Use the property to prune.** Search, insert, LCA of two values: go left or right, never both.
- **Pass bounds down** to validate: each node must lie in \`(low, high)\` inherited from its ancestors.
`;

const lesson: Lesson = {
  slug: 'binary-search-trees',
  video,
  body,
  quiz: [
    { q: 'Is [5, 1, 6, null, null, 3, 7] a valid BST?', options: ['Yes', 'No: 3 is in the right subtree of 5 but smaller than 5', 'No: 7 > 6', 'Only if duplicates are allowed'], answer: 1, why: 'The rule applies to whole subtrees, not just parent–child pairs.' },
    { q: 'What does an in-order traversal of a BST produce?', options: ['Level order', 'Values in sorted order', 'Reverse insertion order', 'Random order'], answer: 1, why: 'Left (smaller), node, right (larger).' },
    { q: 'Search in a BST with height h costs…', options: ['O(1)', 'O(h)', 'O(n log n)', 'O(n²)'], answer: 1, why: 'One root-to-leaf path at most.' },
    { q: 'Inserting 1, 2, 3, …, n in order into a plain BST gives height…', options: ['log n', 'n', '1', '√n'], answer: 1, why: 'Every value goes right: a chain.' },
  ],
};

export default lesson;
