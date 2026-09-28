import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { orderIds } from '../../treevid';

const T: Level = [3, 4, 5, 1, 3, null, 1];
function rob(lv: Level) { const f = (n: TNode | null): [number, number] => { if (!n) return [0, 0]; const [lt, ls] = f(n.l), [rt, rs] = f(n.r); return [n.v + ls + rs, Math.max(lt, ls) + Math.max(rt, rs)]; }; const [a, b] = f(build(lv)); return Math.max(a, b); }

function video() {
  const v = new Video('house-robber-iii', 'House Robber III');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'houses form a binary tree' });
  v.say('The houses now form a binary tree. Robbing two houses joined by an edge, a parent and its child, triggers the alarm. What is the most you can rob?');
  v.eq(`answer: ${rob(T)} (4 + 5)`);

  v.chapter('brute', 'Brute force: rob the node plus grandchildren, or its children', { cx: 'exponential', code: ['rob(node) = max(', '  node.val + rob(4 grandchildren),', '  rob(left) + rob(right))'] });
  v.eq('grandchildren are recomputed by several ancestors', 'bad').say('Either rob this house and skip to its grandchildren, or skip it and solve both children. The same subtrees are solved again from their grandparent and from their parent: exponential on deep trees.');

  v.chapter('better', 'Better: memoise rob(node)', { cx: 'O(n)', code: ['cache rob(node) in a hash map'] });
  v.eq('n nodes, each solved once', 'warn').say('A hash map from node to answer makes it linear, at the cost of the map.');

  v.chapter('optimal', 'Optimal: return a pair (rob, skip)', { cx: 'O(n) time, O(h) space', code: ['solve(node) → (rob, skip)', 'rob = val + left.skip + right.skip', 'skip = max(left) + max(right)', 'answer = max(solve(root))'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'badge = rob / skip' });
  const post = orderIds(t, 'post');
  const R: Record<string, number> = {}, S: Record<string, number> = {};
  v.line(0).say('Return both answers from each subtree: the best if this house is robbed, and the best if it is not. Then no subtree is ever solved twice, and no map is needed.');
  post.forEach((id, i) => {
    const l = t.left(id), r = t.right(id), val = t.val(id) as number;
    R[id] = val + (l ? S[l] : 0) + (r ? S[r] : 0);
    S[id] = (l ? Math.max(R[l], S[l]) : 0) + (r ? Math.max(R[r], S[r]) : 0);
    t.clearTones(); post.slice(0, i).forEach((x) => t.tone(x, 'done')); t.tone(id, 'active');
    if (l) t.tone(l, 'cmp'); if (r) t.tone(r, 'cmp');
    t.badge(id, `${R[id]}/${S[id]}`);
    v.line(1, 2).eq(`house ${val}: rob ${R[id]} · skip ${S[id]}`);
    if (i === 0) v.say('A leaf worth one: robbing it gives one, skipping gives zero.');
    else if (val === 4) v.say('House four: robbing it means skipping both children, so four. Skipping it lets the children be robbed: one plus three, four as well.');
    else if (id === post[post.length - 1]) v.say(`The root: robbing three adds the skip values of four and five, four and one: eight. Skipping it takes the best of each child: four and five, nine.`);
    else v.hold(700);
  });
  const root = post[post.length - 1];
  t.clearTones().tone(root, 'ok');
  v.line(3).eq(`answer = max(${R[root]}, ${S[root]}) = ${rob(T)}`, 'ok').say(`The best is ${words(rob(T))}: rob four and five, the root’s children. One post-order pass, with only the recursion stack as memory.`);
  v.answer(rob(T));

  recap(v, [{ name: 'Recursion with grandchildren', time: 'exponential', space: 'O(h)' }, { name: 'Memo map', time: 'O(n)', space: 'O(n)' }, { name: '(rob, skip) pairs', time: 'O(n)', space: 'O(h)' }], 'Each subtree returns (rob, skip).', ['Take / skip on a tree → return one value per choice'], 'Robbing a node forces skipping its children.');
  return v.build();
}

const problem: Problem = {
  slug: 'house-robber-iii',
  statement: 'The houses form a binary tree rooted at `root`. Robbing two directly-linked houses (parent and child) on the same night alerts the police. Return the maximum amount you can rob.',
  examples: [{ input: 'root = [3,2,3,null,3,null,1]', output: '7' }, { input: 'root = [3,4,5,1,3,null,1]', output: '9' }],
  constraints: ['1 ≤ nodes ≤ 10⁴', '0 ≤ Node.val ≤ 10⁴'],
  hints: ['Return two values per subtree.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Rob node + grandchildren, or children.', time: 'exponential', space: 'O(h)', bottleneck: 'Recomputes subtrees.' },
    { id: 'better', kind: 'better', name: 'Memo map', idea: 'Cache rob(node).', time: 'O(n)', space: 'O(n)', bottleneck: 'Hash map.' },
    { id: 'optimal', kind: 'optimal', name: 'Pair return', idea: 'Post-order returning (rob, skip).', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'Return **(rob, skip)**.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'rob', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [[3, 2, 3, null, 3, null, 1]], out: 7 }, { args: [T], out: 9 }, { args: [[4]], out: 4 }],
    gen: (r: Rng) => { let lv = randomTree(r, 14, 0, 9); while (!lv.length) lv = randomTree(r, 14, 0, 9); return [lv]; },
    ref: (lv: Level) => rob(lv),
  },
};

export default problem;
