import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, toLevel, type Level, type TNode } from '../../treeutil';

const R: Level = [3, 4, 5, 1, 2];
const S: Level = [4, 1, 2];
function ser(n: TNode | null): string { return n ? `,${n.v}${ser(n.l)}${ser(n.r)}` : ',#'; }
function isSub(a: Level, b: Level) { return ser(build(a)).includes(ser(build(b))); }

function video() {
  const v = new Video('subtree-of-another-tree', 'Subtree of Another Tree');
  v.chapter('intro', 'The problem');
  v.layout('row');
  v.binaryTree('r', R, { label: 'root' });
  v.binaryTree('s', S, { label: 'subRoot', prefix: 's' });
  v.say('Does the big tree contain a node whose entire subtree is identical to the small tree, in structure and values? It must match all the way down, including the leaves.');
  v.eq(`answer: ${isSub(R, S)}`);

  v.chapter('brute', 'Brute force: same-tree check at every node', { cx: 'O(m · n)', code: ['isSubtree(r, s):', '  if sameTree(r, s): true', '  return isSubtree(r.left, s) or isSubtree(r.right, s)'] });
  v.clear().layout('row');
  const r = v.binaryTree('r', R, { label: 'root' });
  const s = v.binaryTree('s', S, { label: 'subRoot', prefix: 's' });
  v.say('The direct way: at every node of the big tree, run Same Tree against the small tree.');
  const ids = Object.keys(r.p.nodes);
  for (const id of ['t0', 't1']) {
    r.clearTones();
    const same = id === 't1';
    r.tone(id, same ? 'ok' : 'bad');
    if (same) { r.tone(['t3', 't4'], 'ok'); s.tone(Object.keys(s.p.nodes), 'ok'); }
    v.eq(`sameTree(node ${r.val(id)}, subRoot) → ${same}`, same ? 'ok' : 'bad').hold(900);
  }
  void ids;
  v.eq('m nodes × up to n comparisons each', 'warn').say('Found it at node four. But in the worst case, like a long chain of equal values, each of the m starting nodes compares up to n nodes: m times n.');

  v.chapter('optimal', 'Serialise both trees, then string search', { cx: 'O(m + n) with KMP', code: ['ser(node) = "," + val + ser(left) + ser(right), or ",#" for null', 'return ser(sub) is a substring of ser(root)   # KMP'] });
  v.clear();
  const sr = ser(build(R)), ss = ser(build(S));
  const tokR = sr.split(',').slice(1), tokS = ss.split(',').slice(1);
  const a = v.array('a', tokR, { label: 'ser(root)' });
  const b = v.array('b', tokS, { label: 'ser(subRoot)' });
  v.say('Write each tree as a preorder list that also records null children. Two trees are identical exactly when these lists are identical, and a subtree is a contiguous run in its tree’s list. So the question becomes: is one list a substring of the other?');
  const at = sr.indexOf(ss);
  const startTok = sr.slice(0, at).split(',').length - 1;
  a.win(startTok, startTok + tokS.length - 1, 'ok', 'match');
  b.tone(tokS.map((_, i) => i), 'ok');
  v.eq(`"${ss}" found inside "${sr}"`, 'ok').say(`The small tree’s list appears inside the big tree’s list, starting at four. The null markers matter: without them, different shapes could produce the same list. And the leading comma keeps a value like two from matching inside twelve. With KMP, the search is linear in the total size.`);
  void toLevel;
  v.answer(isSub(R, S));

  recap(v, [{ name: 'Same-tree at every node', time: 'O(m · n)', space: 'O(h)' }, { name: 'Serialise + KMP', time: 'O(m + n)', space: 'O(m + n)' }], 'Preorder with null markers turns subtree matching into substring search.', ['Tree equality / containment → serialise with null markers'], 'Serialisation turns tree problems into string problems.');
  return v.build();
}

function randPair(r: Rng) { const a = randomTree(r, 10, 1, 3); let lvA = a.length ? a : [1]; let b: Level; if (r.chance(0.5)) { const nodes: TNode[] = []; const collect = (n: TNode | null) => { if (!n) return; nodes.push(n); collect(n.l); collect(n.r); }; collect(build(lvA)); b = toLevel(nodes[r.int(0, nodes.length - 1)]); } else { b = randomTree(r, 4, 1, 3); if (!b.length) b = [1]; } return [lvA, b]; }

const problem: Problem = {
  slug: 'subtree-of-another-tree',
  statement: 'Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values as `subRoot`. A subtree consists of a node and all of its descendants.',
  examples: [{ input: 'root = [3,4,5,1,2], subRoot = [4,1,2]', output: 'true' }, { input: 'root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]', output: 'false' }],
  constraints: ['1 ≤ nodes in root ≤ 2000', '1 ≤ nodes in subRoot ≤ 1000'],
  hints: ['Reuse Same Tree at every node.', 'Or serialise both trees with null markers.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Same-tree everywhere', idea: 'Run sameTree(node, subRoot) at every node.', time: 'O(m · n)', space: 'O(h)', bottleneck: 'Repeated comparisons.' },
    { id: 'optimal', kind: 'optimal', name: 'Serialise + KMP', idea: 'Preorder strings with null markers and separators; substring search with KMP.', time: 'O(m + n)', space: 'O(m + n)' },
  ],
  pitfalls: ['Include null markers and a separator before each value.'],
  takeaway: '**Serialise**, then search.',
  video,
  videoArgs: [R, S],
  judge: {
    type: 'fn', fn: 'isSubtree', params: ['TreeNode', 'TreeNode'], ret: 'boolean',
    tests: [{ args: [R, S], out: true }, { args: [[3, 4, 5, 1, 2, null, null, null, null, 0], S], out: false }, { args: [[12], [2]], out: false }, { args: [[1, 1], [1]], out: true }],
    gen: (r: Rng) => randPair(r),
    ref: (a: Level, b: Level) => isSub(a, b),
  },
};

export default problem;
