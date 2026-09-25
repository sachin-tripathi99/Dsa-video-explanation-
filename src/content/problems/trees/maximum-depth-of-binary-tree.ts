import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const T = [3, 9, 20, null, null, 15, 7];

function video() {
  const v = new Video('max-depth', 'Maximum Depth of Binary Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [3,9,20,null,null,15,7]' });
  v.say('Return the maximum depth: the number of nodes on the longest path from the root down to a leaf. Here it is three: three, twenty, fifteen.');

  v.chapter('better', 'Level by level (BFS)', { cx: 'O(n)', code: ['queue = [root]; depth = 0', 'while queue:', '  depth += 1', '  process every node of this level, enqueue children'] });
  v.clear().layout('row');
  const t = v.binaryTree('t', T, { label: 'levels' });
  const q = v.queue('q', [], { label: 'queue', ends: ['front', 'back'] });
  let level = ['t0'];
  let depth = 0;
  while (level.length) {
    depth++;
    q.clearAll();
    level.forEach((id) => q.push(t.val(id) as number));
    t.clearTones().tone(level, 'active');
    v.line(2, 3).counter(`depth: ${depth}`).eq(`level ${depth}: ${level.map((id) => t.val(id)).join(', ')}`);
    if (depth === 1) v.say('One way: breadth-first search. Process the tree one level at a time with a queue, and count the levels.');
    else v.hold(800);
    const next: string[] = [];
    level.forEach((id) => { const l = t.left(id); const r = t.right(id); if (l) next.push(l); if (r) next.push(r); });
    level = next;
  }
  v.eq(`${depth} levels`, 'ok').say('Three levels. This visits each node once: O of n time, with a queue as wide as the widest level.');

  v.chapter('optimal', 'Recursion: ask the children', { cx: 'O(n)', code: ['maxDepth(node):', '  if node is null: return 0', '  return 1 + max(maxDepth(left), maxDepth(right))'] });
  v.clear();
  const u = v.binaryTree('t', T, { label: 'each node returns its depth' });
  const post: string[] = [];
  const walk = (id: string | null) => { if (!id) return; walk(u.left(id)); walk(u.right(id)); post.push(id); };
  walk('t0');
  const d: Record<string, number> = {};
  v.say('The shortest solution is recursive. The depth of a tree is one, for the root, plus the larger depth of its two subtrees.');
  post.forEach((id, i) => {
    const l = u.left(id);
    const r = u.right(id);
    d[id] = 1 + Math.max(l ? d[l] : 0, r ? d[r] : 0);
    u.clearTones().tone(id, 'active');
    post.slice(0, i).forEach((x) => u.tone(x, 'done'));
    u.badge(id, d[id]);
    v.line(2).eq(`maxDepth(${u.val(id)}) = 1 + max(${l ? d[l] : 0}, ${r ? d[r] : 0}) = ${d[id]}`);
    if (i === 0) v.say('Nine has two null children, which return zero, so nine returns one.');
    else if (id === 't0') v.say(`The root combines one and two into three. Every node is visited once: O of n time, and O of h stack space.`);
    else v.hold(700);
  });
  u.clearTones().tone('t0', 'ok');
  v.answer(d.t0);
  recap(v, [{ name: 'BFS, count levels', time: 'O(n)', space: 'O(width)', kind: 'better' }, { name: 'Recursive DFS', time: 'O(n)', space: 'O(height)', kind: 'optimal' }], 'Both visit every node once; recursion is the shortest to write.', ['Tree answer from children → post-order recursion', 'Null returns the base value (0 here)'], 'The template: null returns a base value, then combine the children’s answers. You will write it a hundred times.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-depth-of-binary-tree',
  statement: 'Given the `root` of a binary tree, return its **maximum depth**: the number of nodes along the longest path from the root down to the farthest leaf.',
  examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3' }, { input: 'root = [1,null,2]', output: '2' }],
  constraints: ['0 ≤ number of nodes ≤ 10⁴', '-100 ≤ Node.val ≤ 100'],
  hints: ['What is the depth of an empty tree?', 'How does a node’s depth relate to its children’s depths?'],
  approaches: [
    { id: 'better', kind: 'better', name: 'BFS counting levels', idea: 'Process the tree level by level with a queue; the number of levels is the depth.', time: 'O(n)', space: 'O(width)' },
    { id: 'optimal', kind: 'optimal', name: 'Recursive DFS', idea: '`maxDepth(null) = 0`; otherwise `1 + max(maxDepth(left), maxDepth(right))`.', time: 'O(n)', space: 'O(h)' },
  ],
  takeaway: 'Tree answers usually come from **combining the children’s answers** (post-order).',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'maxDepth', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [[3, 9, 20, null, null, 15, 7]], out: 3 }, { args: [[1, null, 2]], out: 2 }, { args: [[]], out: 0 }],
    gen: (r) => [randTree(r)],
    ref: (lv: (number | null)[]) => depthOf(lv),
  },
};

function randTree(r: { int(a: number, b: number): number; chance(p: number): boolean }) {
  const n = r.int(0, 15);
  const out: (number | null)[] = [];
  let open = 1;
  for (let i = 0; i < n && open > 0; i++) {
    if (i > 0 && r.chance(0.25)) { out.push(null); open--; continue; }
    out.push(r.int(-9, 9));
    open += 1;
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
function depthOf(lv: (number | null)[]): number {
  if (!lv.length || lv[0] === null) return 0;
  const kids: [number, number][] = [[-1, -1]];
  const q = [0];
  let i = 1;
  while (q.length && i < lv.length) {
    const c = q.shift()!;
    if (i < lv.length && lv[i] !== null) { kids.push([-1, -1]); kids[c][0] = kids.length - 1; q.push(kids.length - 1); }
    i++;
    if (i < lv.length && lv[i] !== null) { kids.push([-1, -1]); kids[c][1] = kids.length - 1; q.push(kids.length - 1); }
    i++;
  }
  const d = (x: number): number => (x < 0 ? 0 : 1 + Math.max(d(kids[x][0]), d(kids[x][1])));
  return d(0);
}

export default problem;
