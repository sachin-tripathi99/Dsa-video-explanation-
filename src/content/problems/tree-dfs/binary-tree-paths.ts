import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';

const T: Level = [1, 2, 3, null, 5, 6];
function paths(lv: Level) { const out: string[] = []; const go = (n: TNode | null, p: number[]) => { if (!n) return; p.push(n.v); if (!n.l && !n.r) out.push(p.join('->')); go(n.l, p); go(n.r, p); p.pop(); }; go(build(lv), []); return out; }

function video() {
  const v = new Video('binary-tree-paths', 'Binary Tree Paths');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [1,2,3,null,5,6]' });
  v.say('Return every root-to-leaf path as a string like one arrow two arrow five.');
  v.eq(paths(T).join('   '));

  v.chapter('brute', 'Copy the path string at every node', { cx: 'O(n · h)', code: ['dfs(node, s):', '  s = s + "->" + node.val     # new string each call', '  if leaf: record s', '  dfs(left, s); dfs(right, s)'] });
  v.eq('each call builds a fresh string of length up to h', 'warn').say('Passing a new string to each call is simple and correct. Every call copies a string of length up to the height, so the total work is n times h.');

  v.chapter('optimal', 'One shared path, backtracking', { cx: 'O(n · h) output, O(h) working space', code: ['dfs(node):', '  path.append(node.val)', '  if leaf: record "->".join(path)', '  dfs(left); dfs(right)', '  path.pop()     # un-choose'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'purple = shared path list' });
  const pa = v.array('p', [], { label: 'path' });
  const path: string[] = [];
  const out: string[] = [];
  let told = 0;
  const go = (id: string | null) => {
    if (!id) return;
    path.push(id);
    pa.push(t.val(id) as number);
    t.clearTones(); path.forEach((x) => t.tone(x, 'path')); t.tone(id, 'active');
    const leaf = !t.left(id) && !t.right(id);
    if (leaf) {
      out.push(path.map((x) => t.val(x)).join('->'));
      path.forEach((x) => t.tone(x, 'ok'));
      v.line(2).counter(`paths: ${out.length}`).eq(`leaf → record "${out[out.length - 1]}"`, 'ok');
      if (told === 0) { v.say(`Five is a leaf. Join the shared path into a string: one, two, five. Only at leaves do we build a string.`); told++; } else v.hold(700);
    } else { v.line(1).eq(`append ${t.val(id)}`).hold(450); }
    go(t.left(id));
    go(t.right(id));
    path.pop();
    pa.pop();
    t.clearTones(); path.forEach((x) => t.tone(x, 'path'));
    v.line(4).eq(`pop ${t.val(id)}`);
    if (told === 1 && leaf) { v.say('Returning, pop five off the shared path. The same list is reused for every branch: this is backtracking.'); told++; } else v.hold(300);
  };
  go(t.root());
  v.eq(out.join('   '), 'ok').hold(900);
  v.answer(paths(T));

  recap(v, [{ name: 'New string per call', time: 'O(n · h)', space: 'O(n · h)' }, { name: 'Shared path + backtracking', time: 'O(n · h) for the output', space: 'O(h)' }], 'Append, recurse, pop; build strings only at leaves.', ['All root-to-leaf paths → DFS with a shared path'], 'Build strings only when you record them.');
  return v.build();
}

const problem: Problem = {
  slug: 'binary-tree-paths',
  statement: 'Given the `root` of a binary tree, return all root-to-leaf paths in any order, formatted like `"1->2->5"`.',
  examples: [{ input: 'root = [1,2,3,null,5]', output: '["1->2->5","1->3"]' }, { input: 'root = [1]', output: '["1"]' }],
  constraints: ['1 ≤ nodes ≤ 100'],
  hints: ['DFS with the current path.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'New string per call', idea: 'Pass s + "->" + val down.', time: 'O(n · h)', space: 'O(n · h)', bottleneck: 'Copies at every node.' },
    { id: 'optimal', kind: 'optimal', name: 'Shared path', idea: 'Append/pop a shared list; join at leaves.', time: 'O(n · h)', space: 'O(h)' },
  ],
  takeaway: '**Append, recurse, pop**.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'binaryTreePaths', params: ['TreeNode'], ret: 'List<String>', cmp: 'sorted',
    tests: [{ args: [[1, 2, 3, null, 5]], out: ['1->2->5', '1->3'] }, { args: [[1]], out: ['1'] }, { args: [T], out: paths(T) }],
    gen: (r: Rng) => { let lv = randomTree(r, 12); while (!lv.length) lv = randomTree(r, 12); return [lv]; },
    ref: (lv: Level) => paths(lv),
  },
};

export default problem;
