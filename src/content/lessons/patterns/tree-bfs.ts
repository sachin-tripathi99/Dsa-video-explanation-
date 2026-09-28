import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const T = [3, 9, 20, 4, null, 15, 7];

function video() {
  const v = new Video('tree-bfs', 'Breadth-first search: level by level');
  v.chapter('intro', 'Level by level');
  v.binaryTree('t', T, { label: 'levels: [3] · [9, 20] · [4, 15, 7]' });
  v.say('Breadth-first search visits a tree level by level: the root, then all nodes one step away, then two steps away, and so on. It is the natural tool when a question talks about levels, rows, depth, or the closest something to the root.');

  v.chapter('queue', 'A queue does the work', { code: ['queue = [root]', 'while queue:', '  size = len(queue)          # nodes in this level', '  repeat size times:', '    node = pop front; process node', '    push node.left, node.right to the back'] });
  v.clear().layout('row');
  const t = v.binaryTree('t', T, { label: 'tree' });
  const q = v.queue('q', [], { label: 'queue', ends: ['front', 'back'] });
  const out = v.array('o', [], { label: 'visit order' });
  v.weight('t', 1.8).weight('q', 1).weight('o', 1.2);
  const Q: string[] = [t.root()!];
  q.push(t.val(t.root()!) as number);
  v.line(0).eq('queue = [3]').say('Put the root in a queue. A queue is first in, first out, so nodes come out in the order they were discovered: level by level.');
  let lvl = 0;
  const done: string[] = [];
  while (Q.length) {
    const size = Q.length;
    t.clearTones(); done.forEach((x) => t.tone(x, 'done')); Q.forEach((x) => t.tone(x, 'cmp'));
    v.line(2).counter(`level ${lvl}`).eq(`level ${lvl}: size = ${size}`);
    if (lvl === 0) v.say('The key trick: before processing, read the queue’s size. Exactly that many nodes belong to the current level; anything pushed while we process them belongs to the next level.'); else if (lvl === 1) v.say(`Level one has ${words(size)} nodes: nine and twenty. Children pushed now, four, fifteen and seven, wait behind them for the next level.`); else v.hold(600);
    for (let k = 0; k < size; k++) {
      const id = Q.shift()!;
      q.shift();
      out.push(t.val(id) as number);
      done.push(id);
      const kids = [t.left(id), t.right(id)].filter((x): x is string => !!x);
      kids.forEach((x) => { Q.push(x); q.push(t.val(x) as number); });
      t.clearTones(); done.forEach((x) => t.tone(x, 'done')); Q.forEach((x) => t.tone(x, 'cmp')); t.tone(id, 'active');
      v.line(4, 5).eq(`pop ${t.val(id)}${kids.length ? `, push ${kids.map((x) => t.val(x)).join(', ')}` : ''}`).hold(550);
    }
    lvl++;
  }
  t.clearTones();
  v.eq(`${lvl} levels · O(n) time · O(width) space`, 'ok').say('Every node enters and leaves the queue once: O of n time. The queue holds at most one level plus part of the next, so the space is the width of the tree, up to about n over two for the bottom level of a full tree.');

  v.chapter('when', 'BFS or DFS?');
  v.clear();
  v.table('w', ['Question mentions…', 'Use', 'Why'], [
    ['levels, rows, “each depth”', 'BFS', 'the queue hands you one level at a time'],
    ['minimum depth / nearest leaf', 'BFS', 'stop at the first leaf found'],
    ['paths, subtrees, heights', 'DFS', 'recursion follows one path at a time'],
    ['very wide tree, little memory', 'DFS', 'O(h) stack instead of O(width) queue'],
    ['very deep tree', 'BFS', 'no recursion depth limit'],
  ]);
  v.say('BFS is the right tool when the answer is organised by level, or when you want the nearest thing and can stop early. DFS is better for paths and subtree answers. Memory differs too: BFS stores a level, DFS stores a path.');
  return v.build();
}

const body = String.raw`
## The idea

**Breadth-first search** processes a tree **level by level** using a **queue**. The trick for per-level answers: read the queue size at the start of each level; that many pops belong to the level.

> Real-life picture: ripples on a pond. Everything one step away is reached before anything two steps away.

## Template

\`\`\`java
Deque<TreeNode> q = new ArrayDeque<>();
if (root != null) q.offer(root);
while (!q.isEmpty()) {
    int size = q.size();                         // nodes on this level
    for (int i = 0; i < size; i++) {
        TreeNode node = q.poll();
        // process node (i == 0: leftmost, i == size - 1: rightmost)
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
}
\`\`\`

\`\`\`python
q = deque([root]) if root else deque()
while q:
    for i in range(len(q)):                      # nodes on this level
        node = q.popleft()
        # process node
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
\`\`\`

\`\`\`cpp
queue<TreeNode*> q;
if (root) q.push(root);
while (!q.empty()) {
    int size = q.size();                         // nodes on this level
    for (int i = 0; i < size; i++) {
        TreeNode* node = q.front(); q.pop();
        // process node
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}
\`\`\`

## BFS vs DFS on trees

| Need | Prefer |
|---|---|
| per-level results (averages, right view, zigzag) | BFS |
| nearest leaf / minimum depth | BFS (stop early) |
| paths, heights, subtree answers | DFS |
| memory on a wide tree | DFS (O(h)) |

Both visit every node once: **O(n)** time.

## Variants

- **Zigzag:** alternate the direction you write each level.
- **Right side view:** the last node of each level.
- **Width:** give each node a position (left child 2p, right child 2p + 1) and measure first/last per level.
`;

const lesson: Lesson = {
  slug: 'tree-bfs',
  video,
  body,
  quiz: [
    { q: 'Which data structure drives BFS?', options: ['stack', 'queue', 'heap', 'hash map'], answer: 1, why: 'First in, first out keeps levels in order.' },
    { q: 'How do you know where a level ends?', options: ['count nulls', 'read the queue size before processing the level', 'use recursion depth', 'sort the queue'], answer: 1, why: 'Everything already in the queue is the current level.' },
    { q: 'Minimum depth: why is BFS natural?', options: ['uses less memory always', 'it can stop at the first leaf it meets', 'it sorts the nodes', 'DFS cannot compute it'], answer: 1, why: 'The first leaf found by BFS is the shallowest.' },
    { q: 'BFS extra space on a complete tree is about…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, why: 'The last level holds about n/2 nodes.' },
  ],
};

export default lesson;
