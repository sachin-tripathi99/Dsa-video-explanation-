import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { orderIds } from '../../treevid';

const T: (number | null)[] = [5, 2, 6, 4, 1, null, 3];

function video() {
  const v = new Video('dp-on-trees', 'DP on trees');

  v.chapter('intro', 'A subtree is a subproblem');
  v.binaryTree('t', T, { label: 'value of inviting each person' });
  v.say('A company party. Each person has a fun value, but nobody enjoys a party with their direct boss, so no two directly connected people can both be invited. Which guests give the most fun?');
  v.say('On trees, the natural subproblem is a subtree. A node’s answer is built from its children’s answers, so children must be solved first: a post-order traversal is the filling order.');

  v.chapter('tuple', 'Return two answers: with me and without me', { cx: 'O(n)', code: ['solve(node) → (take, skip)', 'take = node.val + skip(left) + skip(right)', 'skip = max(left pair) + max(right pair)', 'answer = max(solve(root))'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'badge = take / skip' });
  const post = orderIds(t, 'post');
  const take: Record<string, number> = {}, skip: Record<string, number> = {};
  v.say('One number per subtree is not enough: the parent needs to know the best if this child is invited, because then the parent cannot be, and the best if it is not. So every call returns a pair. Inviting a node means both children must be skipped. Skipping it lets each child choose freely.');
  post.forEach((id, i) => {
    const l = t.left(id), r = t.right(id);
    const val = t.val(id) as number;
    const tk = val + (l ? skip[l] : 0) + (r ? skip[r] : 0);
    const sk = (l ? Math.max(take[l], skip[l]) : 0) + (r ? Math.max(take[r], skip[r]) : 0);
    take[id] = tk; skip[id] = sk;
    t.clearTones(); post.slice(0, i).forEach((x) => t.tone(x, 'done')); t.tone(id, 'active');
    if (l) t.tone(l, 'cmp'); if (r) t.tone(r, 'cmp');
    t.badge(id, `${tk}/${sk}`);
    v.line(1, 2).eq(`node ${val}: take = ${val}${l ? ` + ${skip[l]}` : ''}${r ? ` + ${skip[r]}` : ''} = ${tk} · skip = ${l ? `max(${take[l]}, ${skip[l]})` : '0'}${r ? ` + max(${take[r]}, ${skip[r]})` : ''} = ${sk}`);
    if (i === 0) v.say(`A leaf with value ${words(val)}: taking it gives ${words(val)}, skipping it gives zero.`);
    else if (val === 2) v.say('Person two: if invited, both children must stay home, giving two. If not, each child is free: four plus one, five. So the pair is two and five.');
    else if (id === post[post.length - 1]) v.say(`At the root, inviting five adds the skip values of both children; not inviting it adds the better of each child’s pair.`);
    else v.hold(800);
  });
  const root = post[post.length - 1];
  t.clearTones(); t.tone(root, 'ok');
  v.line(3).eq(`answer = max(${take[root]}, ${skip[root]}) = ${Math.max(take[root], skip[root])}`, 'ok').say(`The answer is the better of the root’s pair: ${words(Math.max(take[root], skip[root]))}. Every node is visited once and returns two numbers: linear time.`);

  v.chapter('family', 'Tree DP patterns');
  v.clear();
  v.table('fam', ['Problem', 'Each node returns'], [
    ['House Robber III', '(rob me, skip me)'],
    ['diameter / max path sum', 'best single branch up; record the bend separately'],
    ['longest zigzag', '(length going left, length going right)'],
    ['binary tree cameras', 'state: covered / has camera / needs cover'],
    ['subtree sizes, sums', 'one number, combined in post-order'],
  ]);
  v.say('The recipe: decide what a parent needs to know about a child’s subtree, return exactly that from a post-order DFS, and combine. When a node’s own choice affects its neighbours, return one value per choice.');
  return v.build();
}

const body = String.raw`
## The idea

On a tree, the subproblem is a **subtree**, and children are solved before parents: a **post-order DFS**. Each call returns what the parent needs, often a small tuple, one value per state of the node.

> Real-life picture: a company org chart. Each manager asks each direct report "what's the best your team can do if you come / if you don't?" and combines the answers.

## Template: take / skip

\`\`\`java
int[] solve(TreeNode node) {                           // {take, skip}
    if (node == null) return new int[]{0, 0};
    int[] l = solve(node.left), r = solve(node.right);
    int take = node.val + l[1] + r[1];                 // children must be skipped
    int skip = Math.max(l[0], l[1]) + Math.max(r[0], r[1]);
    return new int[]{take, skip};
}
\`\`\`

\`\`\`python
def solve(node):                                       # (take, skip)
    if not node:
        return 0, 0
    lt, ls = solve(node.left)
    rt, rs = solve(node.right)
    return node.val + ls + rs, max(lt, ls) + max(rt, rs)
\`\`\`

\`\`\`cpp
pair<int,int> solve(TreeNode* node) {                  // {take, skip}
    if (!node) return {0, 0};
    auto [lt, ls] = solve(node->left);
    auto [rt, rs] = solve(node->right);
    return {node->val + ls + rs, max(lt, ls) + max(rt, rs)};
}
\`\`\`

## Two kinds of answers

- **Returned** to the parent: what the parent can extend (one branch, a pair of states).
- **Recorded** globally: answers that bend at this node and cannot be extended (diameter, max path sum).

## Pitfalls

- Returning a single number when the parent needs several states.
- Mixing "returned" and "recorded" quantities.
- Very deep (skewed) trees can overflow the recursion stack; use an explicit stack if needed.
`;

const lesson: Lesson = {
  slug: 'dp-on-trees',
  video,
  body,
  quiz: [
    { q: 'Which traversal order does tree DP usually use?', options: ['pre-order', 'in-order', 'post-order', 'level order'], answer: 2, why: 'Children must be solved before their parent.' },
    { q: 'House Robber III: if you rob a node, its children must be…', options: ['robbed', 'skipped', 'either', 'removed'], answer: 1, why: 'They are directly connected.' },
    { q: 'Why return a pair (take, skip) instead of one number?', options: ['speed', 'the parent’s choice depends on whether the child was taken', 'to save memory', 'it is required by Java'], answer: 1, why: 'One number loses the information the parent needs.' },
    { q: 'Tree DP time complexity with O(1) work per node?', options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'], answer: 1, why: 'Each node is visited once.' },
  ],
};

export default lesson;
