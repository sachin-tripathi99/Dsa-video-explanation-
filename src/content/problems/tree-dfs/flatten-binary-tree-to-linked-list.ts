import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';

const T: Level = [1, 2, 5, 3, 4, null, 6];
function flat(lv: Level) { const out: number[] = []; const go = (n: TNode | null) => { if (!n) return; out.push(n.v); go(n.l); go(n.r); }; go(build(lv)); const lvl: (number | null)[] = []; out.forEach((x, i) => { if (i) lvl.push(null); lvl.push(x); }); return lvl; }

function video() {
  const v = new Video('flatten-binary-tree', 'Flatten Binary Tree to Linked List');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [1,2,5,3,4,null,6]' });
  v.say('Flatten the tree in place into a “linked list” that uses right pointers only, in pre-order: one, two, three, four, five, six. Every left pointer becomes null.');

  v.chapter('brute', 'Brute force: record the pre-order, then relink', { cx: 'O(n) time · O(n) space', code: ['nodes = preorder list of nodes', 'for i: nodes[i].left = null; nodes[i].right = nodes[i+1]'] });
  v.eq('needs an extra list of all n nodes', 'warn').say('Easy: store the nodes in pre-order in a list, then link each node to the next. But that needs O of n extra memory.');

  v.chapter('optimal', 'In place: splice each left subtree in', { cx: 'O(n) time · O(1) space', code: ['cur = root', 'while cur:', '  if cur.left:', '    pre = rightmost node of cur.left', '    pre.right = cur.right', '    cur.right = cur.left; cur.left = null', '  cur = cur.right'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'splice: left subtree moves to the right' });
  let cur: string | null = t.root();
  let told = 0;
  v.say('A Morris-like trick. Walk down the right spine. Whenever the current node has a left subtree, find that subtree’s rightmost node. Everything currently on the right should come after it in pre-order, so hang the right subtree there, then move the whole left subtree over to the right.');
  while (cur) {
    const l = t.left(cur);
    t.clearTones().tone(cur, 'active'); t.ptr('cur', cur);
    if (l) {
      let pre = l;
      while (t.right(pre)) pre = t.right(pre)!;
      t.tone(pre, 'cmp');
      v.line(3).eq(`cur ${t.val(cur)}: rightmost of left subtree = ${t.val(pre)}`);
      if (told === 0) { v.say(`At ${words(t.val(cur) as number)}, the left subtree’s rightmost node is ${words(t.val(pre) as number)}. In pre-order, ${words(t.val(pre) as number)} comes right before ${words(t.val(cur) as number)}’s right subtree.`); } else v.hold(600);
      const r = t.right(cur);
      t.setKid(pre, 1, r);
      t.setKid(cur, 1, l);
      t.setKid(cur, 0, null);
      t.clearTones().tone(cur, 'active').tone(pre, 'ok');
      v.line(4, 5).eq(`${t.val(pre)}.right = ${r ? t.val(r) : 'null'}; ${t.val(cur)}.right = ${t.val(l)}; ${t.val(cur)}.left = null`, 'ok');
      if (told === 0) { v.say(`So attach ${r ? words(t.val(r) as number) : 'nothing'} to the right of ${words(t.val(pre) as number)}, move ${words(t.val(l) as number)}’s subtree to ${words(t.val(cur) as number)}’s right, and clear the left pointer.`); told++; } else v.hold(800);
    } else {
      v.line(6).eq(`cur ${t.val(cur)}: no left child → move right`).hold(500);
    }
    cur = t.right(cur);
  }
  t.clearTones(); t.noPtr();
  v.eq('1 → 2 → 3 → 4 → 5 → 6', 'ok').say('The tree is now a right-leaning chain in pre-order. Each edge is walked a constant number of times, and no extra memory is used.');
  v.answer(flat(T));

  recap(v, [{ name: 'Pre-order list + relink', time: 'O(n)', space: 'O(n)' }, { name: 'In-place splicing', time: 'O(n)', space: 'O(1)' }], 'Rightmost of left subtree gets the right subtree; left moves right.', ['Restructure a tree in place → splice using predecessors'], 'The rightmost node of the left subtree is the pre-order predecessor of the right subtree.');
  return v.build();
}

const problem: Problem = {
  slug: 'flatten-binary-tree-to-linked-list',
  statement: 'Given the `root` of a binary tree, flatten the tree into a "linked list" in place: use the right child pointer as next and set every left pointer to null, in pre-order.',
  examples: [{ input: 'root = [1,2,5,3,4,null,6]', output: '[1,null,2,null,3,null,4,null,5,null,6]' }, { input: 'root = []', output: '[]' }, { input: 'root = [0]', output: '[0]' }],
  constraints: ['0 ≤ nodes ≤ 2000'],
  hints: ['Pre-order predecessor of the right subtree = rightmost node of the left subtree.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'List + relink', idea: 'Collect nodes in pre-order, then link them.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra list.' },
    { id: 'optimal', kind: 'optimal', name: 'In-place splicing', idea: 'For each node with a left child: rightmost(left).right = right; right = left; left = null.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '**Splice** the left subtree between a node and its right subtree.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'flatten', params: ['TreeNode'], ret: 'void', inplace: 0,
    tests: [{ args: [T], out: flat(T) }, { args: [[]], out: [] }, { args: [[0]], out: [0] }],
    gen: (r: Rng) => [randomTree(r, 12)],
    ref: (lv: Level) => flat(lv),
  },
};

export default problem;
