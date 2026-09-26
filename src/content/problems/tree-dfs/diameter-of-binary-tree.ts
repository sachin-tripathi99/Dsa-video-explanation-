import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { orderIds } from '../../treevid';

const T: Level = [1, 2, null, 3, 4, 5, null, null, 6];
function diam(lv: Level) { let best = 0; const h = (n: TNode | null): number => { if (!n) return 0; const a = h(n.l), b = h(n.r); best = Math.max(best, a + b); return 1 + Math.max(a, b); }; h(build(lv)); return best; }

function video() {
  const v = new Video('diameter-of-binary-tree', 'Diameter of Binary Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [1,2,null,3,4,5,null,null,6]' });
  v.say('The diameter is the number of edges on the longest path between any two nodes. The path does not have to pass through the root.');
  v.eq(`answer: ${diam(T)} (5 → 3 → 2 → 4 → 6)`);

  v.chapter('brute', 'Brute force: at every node, compute both heights from scratch', { cx: 'O(n²) worst', code: ['for each node:', '  best = max(best, height(left) + height(right))', 'height() walks the whole subtree every time'] });
  v.eq('height is recomputed for every ancestor', 'warn').say('The longest path that bends at a node has length height of left plus height of right. Computing those heights from scratch at every node repeats a lot of work: quadratic on a long chain.');

  v.chapter('optimal', 'One post-order pass: return height, record the best bend', { cx: 'O(n)', code: ['height(node):', '  if not node: return 0', '  a = height(left); b = height(right)', '  best = max(best, a + b)       # path bending here', '  return 1 + max(a, b)          # only one branch goes up'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'badge = height returned to the parent' });
  const h: Record<string, number> = {};
  let best = 0, bestAt = '';
  const post = orderIds(t, 'post');
  const finalAt = (() => { const hh: Record<string, number> = {}; let b = -1, at = ''; post.forEach((id) => { const l = t.left(id), r = t.right(id); const x = l ? hh[l] : 0, y = r ? hh[r] : 0; if (x + y > b) { b = x + y; at = id; } hh[id] = 1 + Math.max(x, y); }); return at; })();
  let told = 0;
  post.forEach((id, i) => {
    const l = t.left(id), r = t.right(id);
    const a = l ? h[l] : 0, b = r ? h[r] : 0;
    const nb = a + b > best;
    if (nb) { best = a + b; bestAt = id; }
    h[id] = 1 + Math.max(a, b);
    t.clearTones(); post.slice(0, i).forEach((x) => t.tone(x, 'done')); t.tone(id, 'active');
    t.badge(id, h[id]);
    v.line(3, 4).counter(`best: ${best}`).eq(`node ${t.val(id)}: bend = ${a} + ${b} = ${a + b}${nb ? ' ← best' : ''} · return ${h[id]}`, nb ? 'ok' : undefined);
    if (told === 0) { v.say('Each call returns the height of its subtree, but on the way it also checks the longest path that bends at this node: left height plus right height. Leaves return one and bend zero.'); told++; }
    else if (id === finalAt && told === 1) { v.say(`At node ${words(t.val(id) as number)}, the left side is ${words(a)} deep and the right side ${words(b)}: a path of ${words(a + b)} edges bends here, the longest in the tree.`); told++; }
    else if (id === 't0') { v.say(`The root has only a left child. The path bending at the root is just ${words(a + b)} edges, shorter than the one found lower down. That is why a separate best variable is needed: a node returns only one branch to its parent, but the diameter may join two branches somewhere below.`); }
    else v.hold(600);
  });
  t.clearTones();
  v.eq(`diameter = ${best}`, 'ok').hold(700);
  v.answer(diam(T));

  recap(v, [{ name: 'Heights at every node', time: 'O(n²)', space: 'O(h)' }, { name: 'One pass + global best', time: 'O(n)', space: 'O(h)' }], 'Return 1 + max(a, b); record a + b.', ['Longest path between any two nodes → return one branch, record the bend'], 'Return one thing to the parent, record another on the side.');
  return v.build();
}

const problem: Problem = {
  slug: 'diameter-of-binary-tree',
  statement: 'Given the `root` of a binary tree, return the length of the diameter of the tree: the number of edges on the longest path between any two nodes. The path may or may not pass through the root.',
  examples: [{ input: 'root = [1,2,3,4,5]', output: '3' }, { input: 'root = [1,2]', output: '1' }],
  constraints: ['1 ≤ nodes ≤ 10⁴'],
  hints: ['The longest path bends at some node.', 'Its length there is height(left) + height(right).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Heights at every node', idea: 'For each node, compute both subtree heights from scratch.', time: 'O(n²)', space: 'O(h)', bottleneck: 'Repeated height computations.' },
    { id: 'optimal', kind: 'optimal', name: 'One pass', idea: 'Post-order returning height; best = max(best, a + b).', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: '**Return** height, **record** the bend.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'diameterOfBinaryTree', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [[1, 2, 3, 4, 5]], out: 3 }, { args: [[1, 2]], out: 1 }, { args: [T], out: 4 }],
    gen: (r: Rng) => { let lv = randomTree(r, 14); while (!lv.length) lv = randomTree(r, 14); return [lv]; },
    ref: (lv: Level) => diam(lv),
  },
};

export default problem;
