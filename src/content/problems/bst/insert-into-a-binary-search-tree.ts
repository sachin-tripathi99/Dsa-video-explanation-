import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';
import { bstInsert, build, randomBst, toLevel } from '../../treeutil';

const T = [4, 2, 7, 1, 3];
const X = 5;

function video() {
  const v = new Video('insert-bst', 'Insert into a Binary Search Tree');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'BST' });
  v.say(`Insert ${words(X)} into the BST and return the root. Any valid BST is accepted, but the simplest answer adds a new leaf.`);

  v.chapter('better', 'Recursive insert', { cx: 'O(h)', code: ['insert(node, x):', '  if node is null: return new Node(x)', '  if x < node.val: node.left = insert(node.left, x)', '  else: node.right = insert(node.right, x)', '  return node'] });
  v.eq('walk down, attach a new leaf where you fall off').say('Walk down exactly as if searching for the value. The place where the search falls off the tree is where the new leaf belongs.');

  v.chapter('optimal', 'Iterative insert', { cx: 'O(h)', code: ['cur = root', 'loop:', '  side = left if x < cur.val else right', '  if cur.side is null: cur.side = new Node(x); return root', '  cur = cur.side'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: `inserting ${X}` });
  let id = 't0';
  const path: string[] = [];
  for (;;) {
    const val = t.val(id) as number;
    const goLeft = X < val;
    t.clearTones().tone(path, 'path').tone(id, 'active').ptr('cur', id);
    const next = goLeft ? t.left(id) : t.right(id);
    v.line(2).eq(`${X} ${goLeft ? '<' : '>'} ${val} → ${goLeft ? 'left' : 'right'}${next ? '' : ' is empty'}`);
    if (!next) {
      v.say(`${words(X)} is ${goLeft ? 'smaller' : 'bigger'} than ${words(val)}, and ${words(val)} has no ${goLeft ? 'left' : 'right'} child. That is the spot.`);
      const nid = t.add(id, X, goLeft ? 0 : 1, 'new');
      t.clearTones().tone(path, 'path').tone(nid, 'ok').noPtr();
      v.line(3).eq(`attach ${X} as the ${goLeft ? 'left' : 'right'} child of ${val}`, 'ok').say('Attach the new node there. The iterative version uses no stack: O of h time, O of one space.');
      break;
    }
    v.say(`${words(X)} is ${goLeft ? 'smaller' : 'bigger'} than ${words(val)}: go ${goLeft ? 'left' : 'right'}.`);
    path.push(id);
    id = next;
  }
  v.answer(toLevel(bstInsert(build(T), X)));
  recap(v, [{ name: 'Recursive insert', time: 'O(h)', space: 'O(h)', kind: 'better' }, { name: 'Iterative insert', time: 'O(h)', space: 'O(1)', kind: 'optimal' }], 'Insert = search until you fall off, then attach a leaf.', ['New values in a BST always become leaves (with this method)'], 'Insertion is just a search that stops at a null child.');
  return v.build();
}

const problem: Problem = {
  slug: 'insert-into-a-binary-search-tree',
  statement: 'Given the `root` of a BST and a value `val` that is not in the tree, insert `val` and return the root. Any valid BST result is accepted.',
  examples: [{ input: 'root = [4,2,7,1,3], val = 5', output: '[4,2,7,1,3,5]' }, { input: 'root = [40,20,60,10,30,50,70], val = 25', output: '[40,20,60,10,30,50,70,null,null,25]' }],
  constraints: ['0 ≤ nodes ≤ 10⁴', 'val not already in the tree'],
  hints: ['Search for val. Where does the search end?'],
  approaches: [
    { id: 'better', kind: 'better', name: 'Recursive insert', idea: 'Recurse left or right; when you reach null, return a new node, which the parent links in.', time: 'O(h)', space: 'O(h)' },
    { id: 'optimal', kind: 'optimal', name: 'Iterative insert', idea: 'Walk down with a pointer; when the chosen child is null, attach the new node there.', time: 'O(h)', space: 'O(1)' },
  ],
  pitfalls: ['Empty tree: return the new node as the root.'],
  takeaway: 'Insert = **search until null**, then attach a leaf.',
  video,
  videoArgs: [T, X],
  judge: {
    type: 'fn', fn: 'insertIntoBST', params: ['TreeNode', 'int'], ret: 'TreeNode', cmp: { checker: 'sameBstSet' },
    tests: [{ args: [[4, 2, 7, 1, 3], 5], out: [4, 2, 7, 1, 3, 5] }, { args: [[40, 20, 60, 10, 30, 50, 70], 25], out: [40, 20, 60, 10, 30, 50, 70, null, null, 25] }, { args: [[], 5], out: [5] }],
    gen: (r) => { const lv = randomBst(r, 10, 1, 60); const used = new Set(lv.filter((x) => x !== null)); let x = r.int(1, 60); while (used.has(x)) x = r.int(1, 60); return [lv, x]; },
    ref: (lv: (number | null)[], x: number) => toLevel(bstInsert(build(lv), x)),
  },
};

export default problem;
