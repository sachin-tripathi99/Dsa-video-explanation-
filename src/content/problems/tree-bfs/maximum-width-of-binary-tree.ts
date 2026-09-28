import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { levelScene } from '../../treevid';

const T: Level = [1, 3, 2, 5, null, null, 9, 6, null, 7];
function mw(lv: Level) { const r = build(lv); if (!r) return 0; let q: [TNode, number][] = [[r, 0]]; let best = 0; while (q.length) { const base = q[0][1]; best = Math.max(best, q[q.length - 1][1] - base + 1); const nq: [TNode, number][] = []; for (const [n, p] of q) { const i = p - base; if (n.l) nq.push([n.l, 2 * i]); if (n.r) nq.push([n.r, 2 * i + 1]); } q = nq; } return best; }

function video() {
  const v = new Video('maximum-width', 'Maximum Width of Binary Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [1,3,2,5,null,null,9,6,null,7]' });
  v.say('The width of a level is the distance between its leftmost and rightmost nodes, counting the empty spots between them as if the tree were complete. Return the maximum width over all levels.');
  v.eq(`answer: ${mw(T)}`);

  v.chapter('brute', 'Brute force: BFS that keeps null placeholders', { cx: 'O(2^h)', code: ['BFS where a null child is still enqueued as a placeholder', 'width = span between first and last real node', 'stop when a level has no real nodes'] });
  v.eq('placeholders double every level: exponential on a deep, thin tree', 'bad').say('To count the gaps literally, we could enqueue nulls as placeholders so the queue looks like a complete tree. But placeholders have placeholder children, so the queue doubles every level: exponential for a deep, thin tree.');

  v.chapter('optimal', 'Number the positions like a heap', { cx: 'O(n)', code: ['root has position 0', 'left child = 2p, right child = 2p + 1', 'width of a level = last position − first position + 1', 'normalise: p −= first position on the level'] });
  const pos: Record<string, number> = {};
  let best = 0;
  let told = 0;
  const t = levelScene(v, T, 'badge = position within the level', (vals, d, ids, tt) => {
    if (d === 0) pos[ids[0]] = 0;
    const base = pos[ids[0]];
    ids.forEach((id) => { tt.badge(id, pos[id] - base); });
    const width = pos[ids[ids.length - 1]] - base + 1;
    const nb = width > best;
    best = Math.max(best, width);
    ids.forEach((id) => { const p = pos[id] - base; const l = tt.left(id), r = tt.right(id); if (l) pos[l] = 2 * p; if (r) pos[r] = 2 * p + 1; });
    let say: string | undefined;
    if (told === 0) { say = 'Give every node a position, as if it were stored in an array heap: the left child of position p is two p, the right child is two p plus one. Missing nodes simply leave gaps in the numbering.'; told++; }
    else if (d === 2) say = `On level three, five is at position zero and nine at position three. The width is three minus zero plus one: four, counting the two empty spots between them.`;
    else if (d === 3) say = `Six sits at position zero and seven at position six, so this level is seven wide. Before computing children, subtract the level’s first position. Otherwise positions double every level and overflow after about sixty levels.`;
    return { eq: `level ${d}: positions ${ids.map((id) => pos[id] - base).join(', ')} → width ${width}${nb ? ' ← best' : ''}`, ok: nb, say };
  }, [1, 2, 3]);
  void t;
  v.eq(`maximum width = ${best}`, 'ok').hold(800);
  v.answer(mw(T));

  recap(v, [{ name: 'BFS with placeholders', time: 'O(2^h)', space: 'O(2^h)' }, { name: 'Heap positions', time: 'O(n)', space: 'O(width)' }], 'Positions 2p and 2p + 1; normalise per level.', ['Gaps count → index nodes like an array heap'], 'Numbering nodes turns missing nodes into arithmetic.');
  void words;
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-width-of-binary-tree',
  statement: 'Given the `root` of a binary tree, return the maximum width of the tree. The width of a level is the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between them are also counted as if the tree were complete.',
  examples: [{ input: 'root = [1,3,2,5,3,null,9]', output: '4' }, { input: 'root = [1,3,2,5,null,null,9,6,null,7]', output: '7' }, { input: 'root = [1,3,2,5]', output: '2' }],
  constraints: ['1 ≤ nodes ≤ 3000', 'the answer fits in a 32-bit integer'],
  hints: ['Number nodes like a heap: 2p and 2p + 1.', 'Normalise positions per level.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Null placeholders', idea: 'BFS enqueuing nulls to mimic a complete tree.', time: 'O(2^h)', space: 'O(2^h)', bottleneck: 'Placeholders double per level.' },
    { id: 'optimal', kind: 'optimal', name: 'Heap positions', idea: 'BFS with (node, position); width = last − first + 1; subtract the first position.', time: 'O(n)', space: 'O(width)' },
  ],
  pitfalls: ['Positions overflow without per-level normalisation.'],
  takeaway: 'Index nodes **like a heap**.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'widthOfBinaryTree', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [[1, 3, 2, 5, 3, null, 9]], out: 4 }, { args: [T], out: 7 }, { args: [[1, 3, 2, 5]], out: 2 }],
    gen: (r: Rng) => { let lv = randomTree(r, 12); while (!lv.length) lv = randomTree(r, 12); return [lv]; },
    ref: (lv: Level) => mw(lv),
  },
};

export default problem;
