import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { levelScene } from '../../treevid';

const T: Level = [1, 2, 3, null, 4, null, 5];
const X = 4, Y = 5;
function cousins(lv: Level, x: number, y: number) { const info = new Map<number, [number, number | null]>(); const go = (n: TNode | null, d: number, p: number | null) => { if (!n) return; info.set(n.v, [d, p]); go(n.l, d + 1, n.v); go(n.r, d + 1, n.v); }; go(build(lv), 0, null); const a = info.get(x), b = info.get(y); return !!a && !!b && a[0] === b[0] && a[1] !== b[1]; }

function video() {
  const v = new Video('cousins-in-binary-tree', 'Cousins in Binary Tree');
  v.chapter('intro', 'The problem');
  const t0 = v.binaryTree('t', T, { label: `x = ${X}, y = ${Y}` });
  const idOf = (x: number) => Object.entries(t0.p.nodes).find(([, n]) => n.v === x)![0];
  t0.tone([idOf(X), idOf(Y)], 'cmp');
  v.say('Two nodes are cousins if they are on the same level but have different parents. Values are unique.');
  v.eq(`cousins(${X}, ${Y}) = ${cousins(T, X, Y)}`);

  v.chapter('brute', 'Two searches: depth and parent of each', { cx: 'O(n)', code: ['(dx, px) = find(x); (dy, py) = find(y)   # two DFS passes', 'return dx == dy and px != py'] });
  v.eq('two full searches', 'warn').say('Search for x and record its depth and parent, then do the same for y. Two passes over the tree.');

  v.chapter('optimal', 'One BFS: check each level as it is formed', { cx: 'O(n), stops early', code: ['for each level:', '  a pair of siblings that are x and y → false', '  both x and y on this level → true', '  only one of them → false (different depths)'] });
  let result = false;
  levelScene(v, T, 'look at x and y level by level', (vals, d, ids, t) => {
    const hasX = vals.includes(X), hasY = vals.includes(Y);
    if (hasX || hasY) {
      ids.filter((id) => t.val(id) === X || t.val(id) === Y).forEach((id) => t.tone(id, 'ok'));
      if (hasX && hasY) {
        const px = Object.keys(t.p.nodes).find((pid) => t.p.nodes[pid].kids.some((k) => k && t.val(k) === X));
        const py = Object.keys(t.p.nodes).find((pid) => t.p.nodes[pid].kids.some((k) => k && t.val(k) === Y));
        result = px !== py;
        return { eq: `level ${d}: both ${X} and ${Y}; parents ${t.val(px!)} and ${t.val(py!)} → ${result}`, ok: result, stop: true, say: `Both appear on level ${words(d)}. Their parents are ${words(t.val(px!) as number)} and ${words(t.val(py!) as number)}, which differ: they are cousins. When processing a parent, we can also check directly whether its two children are exactly x and y; that would mean siblings, not cousins.` };
      }
      return { eq: `level ${d}: only one of them → false`, stop: true };
    }
    return { eq: `level ${d}: neither x nor y`, say: d === 0 ? 'Walk the tree level by level. As soon as one of the two appears, we can decide.' : undefined };
  }, [0, 1, 2, 3]);
  v.answer(cousins(T, X, Y));

  recap(v, [{ name: 'Two searches', time: 'O(n)', space: 'O(h)' }, { name: 'One BFS', time: 'O(n), early stop', space: 'O(width)' }], 'Same level, different parents.', ['Same-depth relationships → BFS level check'], 'Levels are exactly what BFS hands you.');
  return v.build();
}

function randCase(r: Rng) { for (;;) { const lv = randomTree(r, 12); const seen = new Set<number>(); const uniq = lv.map((x) => { if (x === null) return null; let y = x; while (seen.has(y)) y++; seen.add(y); return y; }); const vals = uniq.filter((x): x is number => x !== null); if (vals.length >= 2) { const [a, b] = r.shuffle(vals).slice(0, 2); return [uniq, a, b]; } } }

const problem: Problem = {
  slug: 'cousins-in-binary-tree',
  statement: 'Given the `root` of a binary tree with unique values and the values of two different nodes `x` and `y`, return `true` if they are cousins: same depth, different parents.',
  examples: [{ input: 'root = [1,2,3,4], x = 4, y = 3', output: 'false' }, { input: 'root = [1,2,3,null,4,null,5], x = 5, y = 4', output: 'true' }, { input: 'root = [1,2,3,null,4], x = 2, y = 3', output: 'false' }],
  constraints: ['2 ≤ nodes ≤ 100', 'unique values', 'x ≠ y, both exist'],
  hints: ['Depth and parent are all you need.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Two searches', idea: 'Find depth and parent of x and of y separately.', time: 'O(n)', space: 'O(h)', bottleneck: 'Two passes.' },
    { id: 'optimal', kind: 'optimal', name: 'One BFS', idea: 'Per level: siblings → false; both present → true; one → false.', time: 'O(n)', space: 'O(width)' },
  ],
  takeaway: '**Same level, different parents**.',
  video,
  videoArgs: [T, X, Y],
  judge: {
    type: 'fn', fn: 'isCousins', params: ['TreeNode', 'int', 'int'], ret: 'boolean',
    tests: [{ args: [[1, 2, 3, 4], 4, 3], out: false }, { args: [T, 5, 4], out: true }, { args: [[1, 2, 3, null, 4], 2, 3], out: false }],
    gen: (r: Rng) => randCase(r),
    ref: (lv: Level, x: number, y: number) => cousins(lv, x, y),
  },
};

export default problem;
