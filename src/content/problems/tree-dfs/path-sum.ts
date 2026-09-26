import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';

const T: Level = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1];
const S = 22;
function has(lv: Level, s: number) { const go = (n: TNode | null, r: number): boolean => { if (!n) return false; r -= n.v; if (!n.l && !n.r) return r === 0; return go(n.l, r) || go(n.r, r); }; return go(build(lv), s); }

function video() {
  const v = new Video('path-sum', 'Path Sum');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: `targetSum = ${S}` });
  v.say(`Is there a path from the root down to a leaf whose values add up to ${words(S)}? A leaf is a node with no children.`);
  v.eq(`answer: ${has(T, S)} (5 → 4 → 11 → 2)`);

  v.chapter('brute', 'Brute force: list every root-to-leaf path, then sum', { cx: 'O(n · h)', code: ['collect every root-to-leaf path as a list', 'for each path: if sum(path) == target: true'] });
  v.eq('copies a path of length h for every leaf', 'warn').say('We could write down every root-to-leaf path and add each one up. Copying paths costs up to the height for each leaf.');

  v.chapter('optimal', 'Pass the remaining sum down', { cx: 'O(n) · O(h) stack', code: ['has(node, remain):', '  if not node: return false', '  remain −= node.val', '  if node is a leaf: return remain == 0', '  return has(left, remain) or has(right, remain)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'badge = remaining sum after this node' });
  const path: string[] = [];
  const told = { first: false, leafBad: false, ok: false };
  let found = false;
  const go = (id: string | null, rem: number): boolean => {
    if (!id || found) return false;
    const val = t.val(id) as number;
    rem -= val;
    path.push(id);
    t.badge(id, rem);
    t.clearTones(); path.forEach((x) => t.tone(x, 'path')); t.tone(id, 'active');
    const leaf = !t.left(id) && !t.right(id);
    v.line(2).eq(`${rem + val} − ${val} = ${rem}${leaf ? ' (leaf)' : ''}`);
    if (!told.first) { v.say(`Instead of storing paths, pass the remaining amount down. At the root, twenty-two minus five leaves seventeen to find below.`); told.first = true; }
    else if (leaf && rem !== 0 && !told.leafBad) { t.tone(id, 'bad'); v.line(3).eq(`leaf ${val}: remain ${rem} ≠ 0 → false`, 'bad').say(`Seven is a leaf, and ${words(rem)} is still missing. Not a match. Back up and try the other branch.`); told.leafBad = true; }
    else if (leaf && rem === 0) { path.forEach((x) => t.tone(x, 'ok')); v.line(3).eq(`leaf ${val}: remain 0 → true`, 'ok').say('Two is a leaf and the remaining amount is exactly zero. Found it: return true all the way up; the or short-circuits, so nothing else is explored.'); found = true; path.pop(); return true; }
    else v.hold(500);
    const ok = leaf ? rem === 0 : go(t.left(id), rem) || go(t.right(id), rem);
    path.pop();
    return ok;
  };
  go(t.root(), S);
  v.eq('true', 'ok').say('Each node is visited at most once: O of n time, O of h space for the recursion.');
  v.answer(has(T, S));

  recap(v, [{ name: 'List all paths', time: 'O(n · h)', space: 'O(n · h)' }, { name: 'Pass remaining sum down', time: 'O(n)', space: 'O(h)' }], 'Subtract on the way down; check at leaves.', ['Root-to-leaf condition → pass state down (pre-order)'], 'Carry what you still need, not the whole path.');
  return v.build();
}

const problem: Problem = {
  slug: 'path-sum',
  statement: 'Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.',
  examples: [{ input: 'root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22', output: 'true' }, { input: 'root = [1,2,3], targetSum = 5', output: 'false' }, { input: 'root = [], targetSum = 0', output: 'false' }],
  constraints: ['0 ≤ nodes ≤ 5000', '−1000 ≤ Node.val ≤ 1000'],
  hints: ['Subtract as you go down.', 'Only check at leaves.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'List all paths', idea: 'Collect every root-to-leaf path, then sum each.', time: 'O(n · h)', space: 'O(n · h)', bottleneck: 'Copies paths.' },
    { id: 'optimal', kind: 'optimal', name: 'Remaining sum', idea: 'has(node, remain − val); at a leaf check remain == 0.', time: 'O(n)', space: 'O(h)' },
  ],
  pitfalls: ['An empty tree has no path, even for target 0.', 'Only leaves end a path.'],
  takeaway: '**Pass the remainder down**.',
  video,
  videoArgs: [T, S],
  judge: {
    type: 'fn', fn: 'hasPathSum', params: ['TreeNode', 'int'], ret: 'boolean',
    tests: [{ args: [T, 22], out: true }, { args: [[1, 2, 3], 5], out: false }, { args: [[], 0], out: false }, { args: [[1, 2], 1], out: false }],
    gen: (r: Rng) => { const lv = randomTree(r, 10, -3, 5); return [lv, r.int(-4, 12)]; },
    ref: (lv: Level, s: number) => has(lv, s),
  },
};

export default problem;
