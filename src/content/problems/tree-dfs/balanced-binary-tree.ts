import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { orderIds } from '../../treevid';

const T: Level = [1, 2, 2, 3, 3, null, null, 4, 4];
function bal(lv: Level) { const h = (n: TNode | null): number => { if (!n) return 0; const a = h(n.l); if (a < 0) return -1; const b = h(n.r); if (b < 0 || Math.abs(a - b) > 1) return -1; return 1 + Math.max(a, b); }; return h(build(lv)) >= 0; }

function video() {
  const v = new Video('balanced-binary-tree', 'Balanced Binary Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [1,2,2,3,3,null,null,4,4]' });
  v.say('A tree is height-balanced if, at every node, the heights of the left and right subtrees differ by at most one. Not just at the root: at every node.');
  v.eq(`answer: ${bal(T)}`);

  v.chapter('brute', 'Top-down: check every node, computing heights each time', { cx: 'O(n²) worst', code: ['balanced(node):', '  |height(left) − height(right)| ≤ 1', '  and balanced(left) and balanced(right)'] });
  v.eq('height() is recomputed at every level', 'warn').say('Checking each node with a fresh height computation walks the same subtrees again and again: n log n on a balanced tree, n squared on a chain.');

  v.chapter('optimal', 'Bottom-up: return height, or −1 for “already unbalanced”', { cx: 'O(n)', code: ['h(node):', '  if not node: return 0', '  a = h(left); b = h(right)', '  if a == −1 or b == −1 or |a − b| > 1: return −1', '  return 1 + max(a, b)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'badge = height (or −1)' });
  const h: Record<string, number> = {};
  const post = orderIds(t, 'post');
  let told = 0;
  for (let i = 0; i < post.length; i++) {
    const id = post[i];
    const l = t.left(id), r = t.right(id);
    const a = l ? h[l] : 0, b = r ? h[r] : 0;
    const bad = a < 0 || b < 0 || Math.abs(a - b) > 1;
    h[id] = bad ? -1 : 1 + Math.max(a, b);
    t.clearTones(); post.slice(0, i).forEach((x) => t.tone(x, h[x] < 0 ? 'bad' : 'done')); t.tone(id, bad ? 'bad' : 'active');
    t.badge(id, h[id]);
    v.line(3, 4).eq(bad ? (a < 0 || b < 0 ? `a child already returned −1 → −1` : `|${a} − ${b}| = ${Math.abs(a - b)} > 1 → −1`) : `|${a} − ${b}| ≤ 1 → height ${h[id]}`, bad ? 'bad' : undefined);
    if (told === 0) { v.say('Compute heights bottom-up, and check the balance at the same time. Leaves have height one.'); told++; }
    else if (bad && told === 1) { v.say(`At this node the left subtree is ${words(a)} tall and the right is ${words(b)}. They differ by ${words(Math.abs(a - b))}: unbalanced. Return minus one as a signal.`); told++; }
    else if (bad && told === 2) { v.say('Once a child reports minus one, its parent simply passes minus one up. We could even stop immediately.'); told++; }
    else v.hold(550);
  }
  v.eq(`root returns ${h.t0} → ${h.t0 >= 0}`, h.t0 >= 0 ? 'ok' : 'bad').say(`The root receives minus one, so the answer is false. One pass, O of n.`);
  v.answer(bal(T));

  recap(v, [{ name: 'Top-down heights', time: 'O(n²)', space: 'O(h)' }, { name: 'Bottom-up with −1', time: 'O(n)', space: 'O(h)' }], 'Return height, or −1 once any subtree is unbalanced.', ['Check a property at every node → post-order with a sentinel'], 'A sentinel lets one return value carry two answers.');
  return v.build();
}

const problem: Problem = {
  slug: 'balanced-binary-tree',
  statement: 'Given a binary tree, determine if it is height-balanced: for every node, the heights of the two subtrees differ by at most one.',
  examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: 'true' }, { input: 'root = [1,2,2,3,3,null,null,4,4]', output: 'false' }, { input: 'root = []', output: 'true' }],
  constraints: ['0 ≤ nodes ≤ 5000'],
  hints: ['Compute heights bottom-up.', 'Use −1 to mean “unbalanced below”.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Top-down heights', idea: 'Check the height difference at every node with a fresh height() call.', time: 'O(n²)', space: 'O(h)', bottleneck: 'Recomputed heights.' },
    { id: 'optimal', kind: 'optimal', name: 'Bottom-up sentinel', idea: 'Return height or −1; propagate −1 upward.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'Height **or −1**, bottom-up.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'isBalanced', params: ['TreeNode'], ret: 'boolean',
    tests: [{ args: [[3, 9, 20, null, null, 15, 7]], out: true }, { args: [T], out: false }, { args: [[]], out: true }, { args: [[1, null, 2, null, 3]], out: false }],
    gen: (r: Rng) => [randomTree(r, 12)],
    ref: (lv: Level) => bal(lv),
  },
};

export default problem;
