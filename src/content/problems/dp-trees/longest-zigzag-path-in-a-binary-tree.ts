import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { orderIds } from '../../treevid';

const T: Level = [1, null, 1, 1, 1, null, null, 1, 1, null, 1, null, null, null, 1];
function zig(lv: Level) { let best = 0; const f = (n: TNode | null): [number, number] => { if (!n) return [-1, -1]; const l = f(n.l), r = f(n.r); const res: [number, number] = [1 + l[1], 1 + r[0]]; best = Math.max(best, ...res); return res; }; f(build(lv)); return best; }

function video() {
  const v = new Video('longest-zigzag-path-in-a-binary-tree', 'Longest ZigZag Path in a Binary Tree');
  const ans = zig(T);
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'binary tree' });
  v.say('A zigzag path goes down the tree, switching direction at every step: left, right, left, and so on, or starting to the right. Its length is the number of edges. Find the longest zigzag anywhere in the tree.');
  v.eq(`answer: ${ans}`);

  v.chapter('brute', 'Brute force: start a zigzag from every node', { cx: 'O(n · h)', code: ['for each node, for each first direction:', '  walk down alternating directions until stuck'] });
  v.eq('n starts × up to h steps', 'bad').say('Starting a walk from every node in both directions revisits the same zigzags from many starting points: quadratic on a deep tree.');

  v.chapter('optimal', 'Each node returns (go left, go right)', { cx: 'O(n)', code: ['solve(null) = (−1, −1)', 'left  = 1 + solve(node.left).right', 'right = 1 + solve(node.right).left', 'best = max(best, left, right)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'badge = longest zigzag starting here going left / going right' });
  const post = orderIds(t, 'post');
  const L: Record<string, number> = {}, Rr: Record<string, number> = {};
  let best = 0;
  v.line(0).say('For every node, two numbers: the longest zigzag that starts here by stepping left, and the one that starts by stepping right. Stepping left to a child means the child must next step right, so we extend the child’s go-right value by one. A missing child counts as minus one, so a leaf gets zero and zero.');
  post.forEach((id, i) => {
    const l = t.left(id), r = t.right(id);
    L[id] = 1 + (l ? Rr[l] : -1);
    Rr[id] = 1 + (r ? L[r] : -1);
    const nb = Math.max(L[id], Rr[id]) > best;
    best = Math.max(best, L[id], Rr[id]);
    t.clearTones(); post.slice(0, i).forEach((x) => t.tone(x, 'done')); t.tone(id, 'active');
    t.badge(id, `${L[id]}/${Rr[id]}`);
    v.line(1, 2, 3).counter(`best ${best}`).eq(`left = 1 + ${l ? Rr[l] : -1} = ${L[id]} · right = 1 + ${r ? L[r] : -1} = ${Rr[id]}${nb ? ' ← best' : ''}`, nb ? 'ok' : undefined);
    if (i === 0) v.say('A leaf: zero and zero.');
    else if (nb && best >= 3) v.say(`A zigzag of ${words(best)} edges starts here.`);
    else v.hold(600);
  });
  t.clearTones();
  v.line(3).eq(`longest = ${best}`, 'ok').say(`The longest zigzag has ${words(best)} edges. One post-order pass, two numbers per node.`);
  v.answer(ans);

  recap(v, [{ name: 'Walk from every node', time: 'O(n · h)', space: 'O(h)' }, { name: '(left, right) per node', time: 'O(n)', space: 'O(h)' }], 'go-left = 1 + child’s go-right, and vice versa.', ['Paths that alternate direction → return one value per direction'], 'Missing child counts as −1.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-zigzag-path-in-a-binary-tree',
  statement: 'A ZigZag path in a binary tree starts at any node, chooses a direction (left or right), moves to that child, then switches direction every step. Its length is the number of nodes visited minus 1. Return the longest ZigZag path length in the tree.',
  examples: [{ input: 'root = [1,null,1,1,1,null,null,1,1,null,1,null,null,null,1]', output: '3' }, { input: 'root = [1,1,1,null,1,null,null,1,1,null,1]', output: '4' }, { input: 'root = [1]', output: '0' }],
  constraints: ['1 ≤ nodes ≤ 5 · 10⁴', '1 ≤ Node.val ≤ 100'],
  hints: ['Return two lengths: starting left and starting right.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Walk from every node', idea: 'Simulate both zigzags from each node.', time: 'O(n · h)', space: 'O(h)', bottleneck: 'Repeated walks.' },
    { id: 'optimal', kind: 'optimal', name: '(left, right) DP', idea: 'Post-order, two lengths per node.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'Two lengths per node, **swap directions** going up.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'longestZigZag', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [T], out: 3 }, { args: [[1, 1, 1, null, 1, null, null, 1, 1, null, 1]], out: 4 }, { args: [[1]], out: 0 }],
    gen: (r: Rng) => { let lv = randomTree(r, 16, 1, 9); while (!lv.length) lv = randomTree(r, 16, 1, 9); return [lv]; },
    ref: (lv: Level) => zig(lv),
  },
};

export default problem;
