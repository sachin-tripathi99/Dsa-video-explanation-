import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, inorder, randomBst } from '../../treeutil';

const T = [5, 3, 6, 2, 4, null, null, 1];
const K = 3;

function video() {
  const v = new Video('kth-smallest-bst', 'Kth Smallest Element in a BST');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'BST' });
  v.say(`Return the ${K === 3 ? 'third' : `k-th`} smallest value in the BST, counting from one.`);

  v.chapter('brute', 'In-order everything, then index', { cx: 'O(n)', code: ['vals = inorder(root)', 'return vals[k − 1]'] });
  const io = inorder(build(T));
  v.array('io', io, { label: 'full in-order list' }).tone(K - 1, 'ok');
  v.line(1).eq(`vals[${K - 1}] = ${io[K - 1]}`, 'ok').say('In-order traversal lists the values in sorted order, so the answer is just index k minus one. But it walks the whole tree and stores everything, even when k is small.');

  v.chapter('optimal', 'Iterative in-order, stop at k', { cx: 'O(h + k)', code: ['stack = []; node = root', 'loop:', '  while node: push node; node = node.left', '  node = pop(); k −= 1', '  if k == 0: return node.val', '  node = node.right'] });
  v.clear().layout('row');
  const t = v.binaryTree('t', T, { label: 'in-order with an explicit stack' });
  const st = v.stack('st', [], { label: 'stack', ends: ['top', ''] });
  const stack: string[] = [];
  let node: string | null = 't0';
  let k = K;
  let visited: string[] = [];
  let firstPush = true;
  for (;;) {
    while (node) {
      stack.push(node);
      st.push(t.val(node) as number).clearTones().toneTop('active');
      t.clearTones().tone(visited, 'done').tone(node, 'active');
      v.line(2);
      if (firstPush) {
        v.say('Go as far left as possible, pushing every node on the way. The top of the stack is then the smallest unvisited value.');
        firstPush = false;
      } else v.hold(450);
      node = t.left(node);
    }
    const cur = stack.pop()!;
    st.pop();
    k--;
    visited.push(cur);
    t.clearTones().tone(visited, 'done').tone(cur, k === 0 ? 'ok' : 'pivot');
    v.line(3).counter(`visited: ${K - k}`).eq(`pop ${t.val(cur)} → ${K - k === 1 ? '1st' : K - k === 2 ? '2nd' : `${K - k}rd`} smallest`, k === 0 ? 'ok' : 'none');
    if (k === 0) {
      v.line(4).say(`That is the ${words(K)}rd smallest, ${words(t.val(cur) as number)}. We stop immediately, having visited only k nodes plus one path down.`.replace('threerd', 'third'));
      v.answer(t.val(cur));
      break;
    }
    if (K - k === 1) v.say('Pop gives the smallest value. Count it, then continue into its right subtree.');
    else v.hold(700);
    node = t.right(cur);
    visited = [...visited];
  }
  recap(v, [{ name: 'Full in-order list', time: 'O(n)', space: 'O(n)' }, { name: 'Iterative in-order, stop early', time: 'O(h + k)', space: 'O(h)' }], 'Stopping at the k-th visit avoids walking the whole tree.', ['BST in-order = sorted order', 'Iterative in-order with a stack lets you stop early'], 'The iterative in-order traversal is worth memorising: it is also the core of the BST iterator.');
  return v.build();
}

const problem: Problem = {
  slug: 'kth-smallest-element-in-a-bst',
  statement: 'Given the `root` of a BST and an integer `k`, return the **k-th smallest** value (1-indexed) among all node values.',
  examples: [{ input: 'root = [3,1,4,null,2], k = 1', output: '1' }, { input: 'root = [5,3,6,2,4,null,null,1], k = 3', output: '3' }],
  constraints: ['1 ≤ k ≤ n ≤ 10⁴'],
  hints: ['In-order traversal of a BST is sorted.', 'Can you stop the traversal as soon as you have visited k nodes?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Full in-order list', idea: 'Collect all values in-order and return index k − 1.', time: 'O(n)', space: 'O(n)', bottleneck: 'Visits and stores every node even for small k.' },
    { id: 'optimal', kind: 'optimal', name: 'Iterative in-order, stop early', idea: 'Use a stack: push the left spine, pop (count it), move to the right child. Return when the count reaches k.', time: 'O(h + k)', space: 'O(h)' },
  ],
  takeaway: '**In-order = sorted** in a BST; an explicit stack lets you **stop early**.',
  video,
  videoArgs: [T, K],
  judge: {
    type: 'fn', fn: 'kthSmallest', params: ['TreeNode', 'int'], ret: 'int',
    tests: [{ args: [[3, 1, 4, null, 2], 1], out: 1 }, { args: [[5, 3, 6, 2, 4, null, null, 1], 3], out: 3 }],
    gen: (r) => { const lv = randomBst(r); const n = lv.filter((x) => x !== null).length; return [lv, r.int(1, n)]; },
    ref: (lv: (number | null)[], k: number) => inorder(build(lv))[k - 1],
  },
};

export default problem;
