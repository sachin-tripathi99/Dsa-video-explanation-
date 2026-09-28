import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { orderIds } from '../../treevid';

const T: Level = [0, 0, null, 0, null, 0, null, null, 0];
function cams(lv: Level) { let c = 0; const f = (n: TNode | null): number => { if (!n) return 2; const l = f(n.l), r = f(n.r); if (l === 0 || r === 0) { c++; return 1; } return l === 1 || r === 1 ? 2 : 0; }; if (f(build(lv)) === 0) c++; return c; }

function video() {
  const v = new Video('binary-tree-cameras', 'Binary Tree Cameras');
  const ans = cams(T);
  const NAMES = ['needs cover', 'camera', 'covered'];
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'a camera watches its parent, itself and its children' });
  v.say('Install cameras on nodes. A camera watches its own node, its parent and its children. What is the fewest cameras that watch every node?');
  v.eq(`answer: ${ans}`);

  v.chapter('brute', 'Brute force: try every set of camera nodes', { cx: 'O(2ⁿ · n)', code: ['for each subset of nodes:', '  if every node is watched: best = min(best, size)'] });
  v.eq('2ⁿ subsets', 'bad').say('Trying every subset of nodes works only for tiny trees.');

  v.chapter('better', 'Better: tree DP with three states', { cx: 'O(n)', code: ['each node returns the min cameras for three cases:', '  it has a camera / covered without one / not yet covered'] });
  v.eq('3 numbers per node', 'warn').say('A tuple DP works: each subtree reports the cheapest solution in each of three situations, and the parent combines them. It is linear, but fiddly.');

  v.chapter('optimal', 'Optimal: greedy from the leaves up', { cx: 'O(n) time, O(h) space', code: ['null → covered', 'a child needs cover → put a camera here', 'a child has a camera → this node is covered', 'otherwise → this node needs cover (let the parent handle it)', 'root still needs cover → one more camera'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'green = camera · blue = covered · red = needs cover' });
  const post = orderIds(t, 'post');
  const st: Record<string, number> = {};
  let c = 0;
  v.line(0).say('Leaves are the worst place for a camera: a camera on a leaf’s parent covers the leaf, the parent, and more. So work upwards and only place a camera when a child would otherwise be left uncovered.');
  post.forEach((id, i) => {
    const l = t.left(id), r = t.right(id);
    const ls = l ? st[l] : 2, rs = r ? st[r] : 2;
    let s: number, line: number;
    if (ls === 0 || rs === 0) { s = 1; c++; line = 1; } else if (ls === 1 || rs === 1) { s = 2; line = 2; } else { s = 0; line = 3; }
    st[id] = s;
    t.tone(id, s === 1 ? 'ok' : s === 2 ? 'cmp' : 'bad');
    t.badge(id, s === 1 ? '📷' : null);
    v.line(line).counter(`cameras: ${c}`).eq(`node ${i + 1}: children [${NAMES[ls]}, ${NAMES[rs]}] → ${NAMES[s]}`, s === 1 ? 'ok' : undefined);
    if (i === 0) v.say('The bottom leaf: its children are missing, which count as covered. Nobody watches the leaf yet, so it needs cover, and we leave that to its parent.');
    else if (i === 1) v.say('Its parent sees a child that needs cover: put a camera here. It covers the leaf, itself and its own parent.');
    else if (i === 2) v.say('The next node up has a child with a camera, so it is already covered, and needs nothing.');
    else if (i === 3) v.say('The node above has a covered child, but no child camera: it is not covered yet. It needs cover from its parent.');
    else if (i === post.length - 1 && s === 1) v.say('The root has a child that needs cover, so the root gets the second camera.');
    else v.hold(800);
  });
  const root = post[post.length - 1];
  if (st[root] === 0) { c++; t.tone(root, 'ok').badge(root, '📷'); v.line(4).counter(`cameras: ${c}`).eq('the root still needs cover → one more camera', 'warn').say('The root has no parent to rely on, so if it still needs cover, it gets a camera itself.'); }
  v.eq(`cameras = ${c}`, 'ok').say(`${words(c)[0].toUpperCase()}${words(c).slice(1)} cameras watch every node. One post-order pass decides every node.`);
  v.answer(ans);

  recap(v, [{ name: 'All subsets', time: 'O(2ⁿ · n)', space: 'O(n)' }, { name: '3-state tree DP', time: 'O(n)', space: 'O(h)' }, { name: 'Greedy post-order', time: 'O(n)', space: 'O(h)' }], 'Cameras on the parents of uncovered nodes, bottom up.', ['Minimum covering set on a tree → post-order states'], 'Check the root at the end.');
  return v.build();
}

const problem: Problem = {
  slug: 'binary-tree-cameras',
  statement: 'Cameras are installed on nodes of a binary tree. Each camera monitors its parent, itself and its immediate children. Return the minimum number of cameras needed to monitor all nodes.',
  examples: [{ input: 'root = [0,0,null,0,0]', output: '1' }, { input: 'root = [0,0,null,0,null,0,null,null,0]', output: '2' }],
  constraints: ['1 ≤ nodes ≤ 1000', 'Node.val == 0'],
  hints: ['Never put a camera on a leaf.', 'Three states: needs cover, has camera, covered.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All subsets', idea: 'Try every set of camera nodes.', time: 'O(2ⁿ · n)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: '3-state DP', idea: 'Min cameras for camera / covered / uncovered per subtree.', time: 'O(n)', space: 'O(h)', bottleneck: 'More bookkeeping.' },
    { id: 'optimal', kind: 'optimal', name: 'Greedy post-order', idea: 'Place a camera only when a child needs cover.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'Bottom-up: **camera on the parent** of an uncovered node.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'minCameraCover', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [[0, 0, null, 0, 0]], out: 1 }, { args: [T], out: 2 }, { args: [[0]], out: 1 }],
    gen: (r: Rng) => { let lv = randomTree(r, 13, 0, 0); while (!lv.length) lv = randomTree(r, 13, 0, 0); return [lv]; },
    ref: (lv: Level) => cams(lv),
  },
};

export default problem;
