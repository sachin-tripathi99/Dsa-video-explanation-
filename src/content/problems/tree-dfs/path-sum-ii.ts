import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';

const T: Level = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1];
const S = 22;
function ps2(lv: Level, s: number) { const out: number[][] = []; const p: number[] = []; const go = (n: TNode | null, r: number) => { if (!n) return; p.push(n.v); r -= n.v; if (!n.l && !n.r && r === 0) out.push([...p]); go(n.l, r); go(n.r, r); p.pop(); }; go(build(lv), s); return out; }

function video() {
  const v = new Video('path-sum-ii', 'Path Sum II');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: `targetSum = ${S}` });
  v.say(`Return every root-to-leaf path whose values add up to ${words(S)}, as lists of values.`);
  v.eq(ps2(T, S).map((p) => `[${p}]`).join('  '));

  v.chapter('brute', 'Brute force: collect all paths, then filter', { cx: 'O(n · h)', code: ['collect every root-to-leaf path (copied lists)', 'keep those whose sum == target'] });
  v.eq('copies every path, even hopeless ones', 'warn').say('Collect every root-to-leaf path as a copied list, then keep the ones with the right sum. It copies paths that were never going to match.');

  v.chapter('optimal', 'Backtracking with a running remainder', { cx: 'O(n · h) worst (copies of answers)', code: ['dfs(node, remain):', '  path.append(node.val); remain −= node.val', '  if leaf and remain == 0: record a copy of path', '  dfs(left, remain); dfs(right, remain)', '  path.pop()'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'badge = remaining after this node' });
  const path: string[] = [];
  const out: number[][] = [];
  let told = 0;
  const go = (id: string | null, rem: number) => {
    if (!id) return;
    path.push(id);
    rem -= t.val(id) as number;
    t.badge(id, rem);
    t.clearTones(); path.forEach((x) => t.tone(x, 'path')); t.tone(id, 'active');
    const leaf = !t.left(id) && !t.right(id);
    if (leaf && rem === 0) {
      out.push(path.map((x) => t.val(x) as number));
      path.forEach((x) => t.tone(x, 'ok'));
      v.line(2).counter(`found: ${out.length}`).eq(`leaf, remain 0 → record [${out[out.length - 1]}]`, 'ok');
      if (told < 2) { v.say(told === 0 ? 'A leaf with nothing left to find: record a copy of the path. Copy it, because the path list keeps changing after this.' : 'Another leaf that hits the target exactly: record this path too.'); told++; } else v.hold(700);
    } else if (leaf) { t.tone(id, 'bad'); v.line(2).eq(`leaf, remain ${rem} → no`, 'bad').hold(500); }
    else v.line(1).eq(`${t.val(id)}: remain ${rem}`).hold(400);
    go(t.left(id), rem);
    go(t.right(id), rem);
    path.pop();
  };
  go(t.root(), S);
  t.clearTones();
  v.eq(out.map((p) => `[${p}]`).join('  '), 'ok').say(`${words(out.length)} paths. The recursion itself is linear; the extra cost is only in copying the paths we actually record.`);
  v.answer(ps2(T, S));

  recap(v, [{ name: 'Collect all + filter', time: 'O(n · h)', space: 'O(n · h)' }, { name: 'Backtracking + remainder', time: 'O(n + output)', space: 'O(h)' }], 'Append, subtract, recurse, pop; copy only matches.', ['All root-to-leaf paths with a property → backtracking with running state'], 'Path Sum plus Binary Tree Paths: carry the remainder, share the path.');
  return v.build();
}

const problem: Problem = {
  slug: 'path-sum-ii',
  statement: 'Given the `root` of a binary tree and an integer `targetSum`, return all root-to-leaf paths where the sum of the node values equals `targetSum`. Each path is a list of node values.',
  examples: [{ input: 'root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22', output: '[[5,4,11,2],[5,8,4,5]]' }, { input: 'root = [1,2,3], targetSum = 5', output: '[]' }],
  constraints: ['0 ≤ nodes ≤ 5000', '−1000 ≤ Node.val ≤ 1000'],
  hints: ['Combine Path Sum with backtracking.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Collect all + filter', idea: 'Copy every root-to-leaf path; keep matching sums.', time: 'O(n · h)', space: 'O(n · h)', bottleneck: 'Copies non-matching paths.' },
    { id: 'optimal', kind: 'optimal', name: 'Backtracking', idea: 'Shared path, running remainder; copy only matches.', time: 'O(n + output)', space: 'O(h)' },
  ],
  takeaway: 'Share the path, **copy only matches**.',
  video,
  videoArgs: [T, S],
  judge: {
    type: 'fn', fn: 'pathSum', params: ['TreeNode', 'int'], ret: 'List<List<Integer>>', cmp: 'sorted',
    tests: [{ args: [T, S], out: ps2(T, S) }, { args: [[1, 2, 3], 5], out: [] }, { args: [[1, 2], 0], out: [] }],
    gen: (r: Rng) => [randomTree(r, 12, -2, 4), r.int(-2, 10)],
    ref: (lv: Level, s: number) => ps2(lv, s),
  },
};

export default problem;
