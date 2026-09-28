import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { levelScene } from '../../treevid';

const T: Level = [1, 2, 3, null, 5, null, 4, 7];
function rsv(lv: Level) { const out: number[] = []; const go = (n: TNode | null, d: number) => { if (!n) return; if (d === out.length) out.push(n.v); go(n.r, d + 1); go(n.l, d + 1); }; go(build(lv), 0); return out; }

function video() {
  const v = new Video('right-side-view', 'Binary Tree Right Side View');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [1,2,3,null,5,null,4,7]' });
  v.say('Imagine standing to the right of the tree. Return the values you can see, from top to bottom: the rightmost node of every level. Careful: the rightmost node is not always a right child.');
  v.eq(`[${rsv(T).join(', ')}]`);

  v.chapter('brute', 'BFS: keep the last node of each level', { cx: 'O(n) · O(width)', code: ['for each level (size snapshot):', '  pop size nodes, pushing children', '  the last popped node is visible'] });
  levelScene(v, T, 'the last node of each level is visible', (vals, d, ids, t) => {
    t.tone(ids[ids.length - 1], 'ok');
    const say = d === 3 ? 'On the last level, seven is the only node, and it is a left child of five. Anyone who only follows right pointers would miss it: the view is about levels, not directions.' : d === 0 ? 'Process level by level; the last node popped on each level is the one visible from the right.' : undefined;
    return { eq: `level ${d}: [${vals.join(', ')}] → see ${vals[vals.length - 1]}`, ok: true, say };
  }, [0, 1, 2]);
  v.eq(`[${rsv(T).join(', ')}]`, 'ok').say('BFS works in linear time, but its queue can hold a whole level: up to half the nodes of a wide tree.');

  v.chapter('optimal', 'DFS right-first: the first node at each new depth', { cx: 'O(n) · O(h)', code: ['dfs(node, depth):', '  if depth == len(view): view.append(node.val)   # first visit of this depth', '  dfs(right, depth + 1); dfs(left, depth + 1)'] });
  v.clear().layout('row');
  const t = v.binaryTree('t', T, { label: 'visit right child first' });
  const view = v.array('o', [], { label: 'view' });
  const got: number[] = [];
  let told = 0;
  const go = (id: string | null, d: number, path: string[]) => {
    if (!id) return;
    path.push(id);
    t.clearTones(); path.forEach((x) => t.tone(x, 'path'));
    const fresh = d === got.length;
    if (fresh) { got.push(t.val(id) as number); view.push(t.val(id) as number); t.tone(id, 'ok'); } else t.tone(id, 'active');
    v.line(1).eq(fresh ? `depth ${d} seen for the first time → ${t.val(id)} is visible` : `depth ${d} already has a view → skip ${t.val(id)}`, fresh ? 'ok' : undefined);
    if (told === 0) { v.say('A DFS that always goes right before left reaches every depth first through its rightmost node. So the first node we meet at each new depth is the visible one.'); told++; }
    else if (!fresh && told === 1) { v.say(`Depth ${words(d)} was already filled by a node further right, so ${words(t.val(id) as number)} is hidden behind it.`); told++; }
    else if (fresh && d === 3) v.say('Depth three is reached for the first time through seven, on the left side. It is visible: nothing further right exists at that depth.');
    else v.hold(550);
    go(t.right(id), d + 1, path);
    go(t.left(id), d + 1, path);
    path.pop();
  };
  go(t.root(), 0, []);
  t.clearTones();
  v.eq(`[${got.join(', ')}] · O(h) extra space`, 'ok').hold(900);
  v.answer(rsv(T));

  recap(v, [{ name: 'BFS, last of each level', time: 'O(n)', space: 'O(width)' }, { name: 'DFS right-first', time: 'O(n)', space: 'O(h)' }], 'First node at each new depth in a right-first DFS.', ['Visible from one side → last per level (BFS) or first per depth (DFS)'], 'Depth-indexed answers can use DFS as well as BFS.');
  return v.build();
}

const problem: Problem = {
  slug: 'binary-tree-right-side-view',
  statement: 'Given the `root` of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see, ordered from top to bottom.',
  examples: [{ input: 'root = [1,2,3,null,5,null,4]', output: '[1,3,4]' }, { input: 'root = [1,2,3,4,null,null,null,5]', output: '[1,3,4,5]' }, { input: 'root = []', output: '[]' }],
  constraints: ['0 ≤ nodes ≤ 100'],
  hints: ['The rightmost node of each level.', 'A left child can be visible.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'BFS last per level', idea: 'Level order; record the last node of each level.', time: 'O(n)', space: 'O(width)', bottleneck: 'Queue holds whole levels.' },
    { id: 'optimal', kind: 'optimal', name: 'DFS right-first', idea: 'Record a node when its depth is seen for the first time.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'Rightmost **per level**, not right children.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'rightSideView', params: ['TreeNode'], ret: 'List<Integer>',
    tests: [{ args: [[1, 2, 3, null, 5, null, 4]], out: [1, 3, 4] }, { args: [[1, 2, 3, 4, null, null, null, 5]], out: [1, 3, 4, 5] }, { args: [[]], out: [] }, { args: [T], out: rsv(T) }],
    gen: (r: Rng) => [randomTree(r)],
    ref: (lv: Level) => rsv(lv),
  },
};

export default problem;
