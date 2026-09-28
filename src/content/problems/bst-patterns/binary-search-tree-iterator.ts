import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, inorder, randomBst, type Level } from '../../treeutil';

const T: Level = [7, 3, 15, null, null, 9, 20];

function video() {
  const v = new Video('bst-iterator', 'Binary Search Tree Iterator');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [7,3,15,null,null,9,20]' });
  v.say('Design an iterator over a BST that returns the values in increasing order: next returns the next smallest value, hasNext says whether one is left. Aim for average constant time per call and memory proportional to the height.');

  v.chapter('brute', 'Flatten the whole tree first', { cx: 'O(1) per call · O(n) memory', code: ['constructor: vals = in-order(root); i = 0', 'next(): return vals[i++]', 'hasNext(): i < len(vals)'] });
  v.eq('O(n) memory, and all the work happens up front', 'warn').say('The easy way: do a full in-order traversal in the constructor and store every value. Calls are instant, but the memory is O of n, and we pay for the whole traversal even if only a few values are ever requested.');

  v.chapter('optimal', 'Controlled in-order with a stack of the left spine', { cx: 'O(1) amortised · O(h) memory', code: ['pushLeft(n): push n and all its left children', 'constructor: pushLeft(root)', 'next(): n = pop(); pushLeft(n.right); return n', 'hasNext(): stack not empty'] });
  v.clear().layout('row');
  const t = v.binaryTree('t', T, { label: 'purple = on the stack' });
  const st = v.stack('s', [], { label: 'stack' });
  const out = v.array('o', [], { label: 'returned' });
  v.weight('t', 1.6).weight('s', 0.8).weight('o', 1);
  const S: string[] = [];
  const done: string[] = [];
  const paint = (cur?: string) => { t.clearTones(); done.forEach((x) => t.tone(x, 'done')); S.forEach((x) => t.tone(x, 'path')); if (cur) t.tone(cur, 'ok'); };
  const pushLeft = (id: string | null) => { while (id) { S.push(id); st.push(t.val(id) as number); id = t.left(id); } };
  pushLeft(t.root());
  paint();
  v.line(0, 1).eq('constructor: push 7, 3').say('The constructor pushes the left spine: seven, then three. The top of the stack is always the next smallest value, and the stack never holds more than one path: O of h memory.');
  let told = 0;
  while (S.length) {
    const id = S.pop()!;
    st.pop();
    done.push(id);
    out.push(t.val(id) as number);
    const r = t.right(id);
    pushLeft(r);
    paint(id);
    v.line(2).eq(`next() → ${t.val(id)}${r ? `; push left spine of ${t.val(r)}` : ''}`, 'ok');
    if (told === 0) { v.say('next pops three and returns it. Three has no right child, so nothing new is pushed.'); told++; }
    else if (told === 1 && r) { v.say(`next pops ${words(t.val(id) as number)}. Its right subtree holds the next values, so push that subtree’s left spine: ${words(t.val(r) as number)}, then its left child. The smallest of them is on top.`); told++; }
    else v.hold(700);
  }
  v.line(3).eq('stack empty → hasNext() = false', 'ok').say('Each node is pushed once and popped once over the whole iteration, so n calls cost O of n in total: constant time on average, even though a single call can push a whole spine.');
  v.answer([null, ...inorder(build(T)).map((x) => x), false]);

  recap(v, [{ name: 'Flatten up front', time: 'O(n) init, O(1) per call', space: 'O(n)' }, { name: 'Left-spine stack', time: 'O(1) amortised', space: 'O(h)' }], 'Pop, then push the left spine of the right child.', ['Lazy sorted iteration of a BST → left-spine stack'], 'An iterative in-order traversal, paused between calls.');
  return v.build();
}

function gen(r: Rng) { let lv = randomBst(r, 12, 0, 50); while (!lv.length) lv = randomBst(r, 12, 0, 50); const n = inorder(build(lv)).length; const ops = ['BSTIterator']; const args: unknown[][] = [lv as unknown[]]; let taken = 0; for (let k = 0; k < n * 2 + 1; k++) { if (taken < n && r.chance(0.6)) { ops.push('next'); args.push([]); taken++; } else { ops.push('hasNext'); args.push([]); } } return { ops, args: args.map((a, i) => (i === 0 ? [a] : a)) }; }

const problem: Problem = {
  slug: 'binary-search-tree-iterator',
  statement: 'Implement `BSTIterator`, which iterates over the in-order traversal of a BST: `BSTIterator(TreeNode root)` initialises it; `boolean hasNext()` returns whether a next number exists; `int next()` moves to and returns the next number. `next()` is only called when valid.',
  examples: [{ input: '["BSTIterator","next","next","hasNext","next","hasNext","next","hasNext","next","hasNext"]\n[[[7,3,15,null,null,9,20]],[],[],[],[],[],[],[],[],[]]', output: '[null,3,7,true,9,true,15,true,20,false]' }],
  constraints: ['1 ≤ nodes ≤ 10⁵', 'up to 10⁵ calls'],
  hints: ['Simulate an in-order traversal with an explicit stack, one step per call.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Flatten', idea: 'Store the full in-order list.', time: 'O(1) per call', space: 'O(n)', bottleneck: 'Memory; upfront work.' },
    { id: 'optimal', kind: 'optimal', name: 'Left-spine stack', idea: 'Pop the top; push the left spine of its right child.', time: 'O(1) amortised', space: 'O(h)' },
  ],
  takeaway: '**Pause** an iterative in-order traversal between calls.',
  video,
  videoArgs: [],
  judge: {
    type: 'design', cls: 'BSTIterator', ctor: ['TreeNode'],
    methods: { next: { params: [], ret: 'int' }, hasNext: { params: [], ret: 'boolean' } },
    tests: [{ ops: ['BSTIterator', 'next', 'next', 'hasNext', 'next', 'hasNext', 'next', 'hasNext', 'next', 'hasNext'], args: [[T], [], [], [], [], [], [], [], [], []], out: [null, 3, 7, true, 9, true, 15, true, 20, false] }],
    gen: (r: Rng) => gen(r),
    ref: (ops, args) => { const vals = inorder(build(args[0][0] as Level)); let i = 0; return ops.map((op) => (op === 'BSTIterator' ? null : op === 'next' ? vals[i++] : i < vals.length)); },
  },
};

export default problem;
