import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { orderIds } from '../../treevid';

const T = [8, 3, 10, 1, 6, null, 14, null, null, 4, 7];

function video() {
  const v = new Video('bst-patterns', 'Using the BST property');
  v.chapter('intro', 'The rule that gives you everything');
  v.binaryTree('t', T, { label: 'left subtree < node < right subtree, at every node' });
  v.say('In a binary search tree, everything in a node’s left subtree is smaller and everything in its right subtree is bigger. This one rule gives three superpowers: sorted order for free, searching by halves, and ranges that shrink as you go down.');

  v.chapter('sorted', 'Power 1: in-order traversal is sorted', { code: ['inorder(node): inorder(left); visit(node); inorder(right)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'in-order visit' });
  const out = v.array('o', [], { label: 'in-order output' });
  const ids = orderIds(t, 'in');
  ids.forEach((id, i) => { t.clearTones(); ids.slice(0, i).forEach((x) => t.tone(x, 'done')); t.tone(id, 'active'); out.push(t.val(id) as number); v.line(0).hold(420); });
  t.clearTones(); out.clearTones();
  v.eq(`[${ids.map((x) => t.val(x)).join(', ')}] — sorted`, 'ok').say('An in-order traversal lists the values in increasing order. So any problem about sorted order, like the smallest difference, the k-th smallest, or two values adding to a target, can treat the BST as a sorted array, without building one.');

  v.chapter('search', 'Power 2: every comparison discards a subtree');
  v.clear();
  const s = v.binaryTree('t', T, { label: 'search for 7' });
  let cur: string | null = s.root();
  const path: string[] = [];
  while (cur) {
    path.push(cur);
    s.clearTones(); path.forEach((x) => s.tone(x, 'path')); s.tone(cur, 'active');
    const val = s.val(cur) as number;
    if (val === 7) { s.tone(cur, 'ok'); v.eq('found 7', 'ok').hold(700); break; }
    v.eq(`7 ${7 < val ? '<' : '>'} ${val} → go ${7 < val ? 'left' : 'right'}`).hold(700);
    cur = 7 < val ? s.left(cur) : s.right(cur);
  }
  v.say('Searching compares at one node per level and throws away a whole subtree each time: O of h, which is log n when the tree is balanced.');

  v.chapter('build', 'Power 3: build a balanced BST from sorted data');
  v.clear();
  v.array('a', [1, 3, 4, 6, 7, 8, 10, 14], { label: 'sorted values' }).tone(3, 'active');
  v.say('Going the other way, a sorted array becomes a balanced BST by making the middle element the root and recursing on the two halves. Each half becomes a subtree of equal size, so the height is log n.');

  v.chapter('toolkit', 'The BST toolkit');
  v.clear();
  v.table('k', ['Tool', 'Used for'], [
    ['in-order = sorted', 'min difference, k-th smallest, two sum, validation'],
    ['compare and go one way', 'search, insert, delete, LCA of a BST'],
    ['middle of a sorted range = root', 'build a balanced BST'],
    ['stack of left spine', 'BST iterator: next smallest in O(1) amortised'],
    ['(low, high) bounds passed down', 'validate a BST, range queries'],
  ]);
  v.say('Most BST problems use one of these five tools. Recognise which one, and the problem becomes a short function.');
  void words;
  return v.build();
}

const body = String.raw`
## The idea

A **binary search tree** keeps \`left < node < right\` at every node. That gives:

1. **In-order traversal is sorted** → treat the tree as a sorted array.
2. **Search by halves** → each comparison discards a subtree: O(h).
3. **Sorted data ↔ balanced tree** → the middle of a sorted range is a good root.

> Real-life picture: a well-organised library. Everything before a shelf label is to the left, everything after to the right.

## Tools

| Tool | Problems |
|---|---|
| In-order with a \`prev\` variable | Minimum Absolute Difference, Validate BST, Kth Smallest |
| Compare and descend | Search, Insert, Delete, LCA of BST |
| Middle as root | Convert Sorted Array to BST |
| Left-spine stack | BST Iterator, Two Sum IV (two iterators) |
| Bounds passed down | Validate BST |

## Iterator template (next smallest)

\`\`\`java
Deque<TreeNode> st = new ArrayDeque<>();
void pushLeft(TreeNode n) { while (n != null) { st.push(n); n = n.left; } }
int next() {
    TreeNode n = st.pop();
    pushLeft(n.right);          // the next values are in n's right subtree
    return n.val;
}
\`\`\`

\`\`\`python
def push_left(n):
    while n:
        st.append(n)
        n = n.left

def next_():
    n = st.pop()
    push_left(n.right)          # the next values are in n's right subtree
    return n.val
\`\`\`

\`\`\`cpp
void pushLeft(TreeNode* n) { while (n) { st.push(n); n = n->left; } }
int next() {
    TreeNode* n = st.top(); st.pop();
    pushLeft(n->right);         // the next values are in n's right subtree
    return n->val;
}
\`\`\`

Each node is pushed and popped once: **O(1) amortised** per call, **O(h)** space.

## Pitfalls

- "Balanced" is not guaranteed: O(h) can be O(n) for a skewed tree.
- Validation must compare against **all ancestors** (bounds), not just the parent.
`;

const lesson: Lesson = {
  slug: 'bst-patterns',
  video,
  body,
  quiz: [
    { q: 'In-order traversal of a BST gives…', options: ['level order', 'sorted order', 'reverse order', 'random order'], answer: 1, why: 'Left subtree, node, right subtree.' },
    { q: 'Best root for a balanced BST from a sorted array?', options: ['first element', 'last element', 'middle element', 'any'], answer: 2, why: 'It splits the rest into equal halves.' },
    { q: 'A BST iterator’s next() costs…', options: ['O(n) always', 'O(1) amortised, O(h) worst', 'O(log n) always', 'O(n log n)'], answer: 1, why: 'Each node is pushed and popped once overall.' },
    { q: 'Search in a skewed BST costs…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 2, why: 'O(h), and h = n for a chain.' },
  ],
};

export default lesson;
