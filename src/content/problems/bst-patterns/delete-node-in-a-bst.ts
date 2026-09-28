import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, toLevel, randomBst, type Level, type TNode } from '../../treeutil';
import { parentOf } from '../../treevid';

const T: Level = [5, 3, 6, 2, 4, null, 7];
const KEY = 3;
function del(lv: Level, key: number) { const go = (n: TNode | null, k: number): TNode | null => { if (!n) return null; if (k < n.v) n.l = go(n.l, k); else if (k > n.v) n.r = go(n.r, k); else { if (!n.l) return n.r; if (!n.r) return n.l; let s = n.r; while (s.l) s = s.l; n.v = s.v; n.r = go(n.r, s.v); } return n; }; return toLevel(go(build(lv), key)); }

function video() {
  const v = new Video('delete-node-bst', 'Delete Node in a BST');
  v.chapter('intro', 'The problem');
  const t0 = v.binaryTree('t', T, { label: `delete key = ${KEY}` });
  t0.tone('t1', 'bad');
  v.say(`Delete the node with value ${words(KEY)} and return the root. The tree must still be a valid binary search tree afterwards.`);

  v.chapter('cases', 'Three cases');
  v.clear();
  v.table('c', ['Node to delete has…', 'Do this'], [
    ['no children', 'just remove it'],
    ['one child', 'replace it with that child'],
    ['two children', 'copy in its in-order successor (smallest in the right subtree), then delete the successor'],
  ]);
  v.say('Finding the node is an ordinary BST search. Removing it has three cases. A leaf just disappears. A node with one child is replaced by that child. A node with two children is the interesting one: replace its value with the next bigger value, its in-order successor, which is the leftmost node of its right subtree. That successor has no left child, so deleting it falls into one of the easy cases.');

  v.chapter('brute', 'Brute force: rebuild from the sorted values', { cx: 'O(n)', code: ['vals = in-order values without key', 'build a balanced BST from vals'] });
  v.eq('touches every node to delete one', 'warn').say('One could collect the sorted values without the key and rebuild a balanced tree. Valid, but it touches every node to delete a single one.');

  v.chapter('optimal', 'Search down, then fix locally', { cx: 'O(h)', code: ['key < node: recurse left', 'key > node: recurse right', 'found: one side empty → return the other', '  succ = leftmost(right); node.val = succ.val', '  node.right = delete(right, succ.val)'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: `delete ${KEY}` });
  let cur: string | null = t.root();
  const path: string[] = [];
  while (cur && t.val(cur) !== KEY) {
    path.push(cur);
    t.clearTones(); path.forEach((x) => t.tone(x, 'path'));
    const val = t.val(cur) as number;
    v.line(KEY < val ? 0 : 1).eq(`${KEY} ${KEY < val ? '<' : '>'} ${val} → go ${KEY < val ? 'left' : 'right'}`).say(`${words(KEY)} is smaller than ${words(val)}: search the left subtree.`);
    cur = KEY < val ? t.left(cur) : t.right(cur);
  }
  const node = cur!;
  t.clearTones(); path.forEach((x) => t.tone(x, 'path')); t.tone(node, 'bad');
  v.line(2).eq(`found ${KEY}: it has two children`, 'bad').say(`Found ${words(KEY)}. It has two children, two and four, so we cannot just unlink it.`);
  let s = t.right(node)!;
  while (t.left(s)) s = t.left(s)!;
  t.tone(s, 'ok');
  v.line(3).eq(`successor = leftmost of right subtree = ${t.val(s)}`, 'ok').say(`Its in-order successor is the smallest value in its right subtree: go right once, then left as far as possible. Here that is ${words(t.val(s) as number)}.`);
  const sv = t.val(s) as number;
  t.setVal(node, sv);
  t.tone(node, 'ok');
  v.line(3).eq(`copy ${sv} into the node`).say(`Copy ${words(sv)} into the node we are deleting. Everything on its left is still smaller than ${words(sv)}, and everything left on its right is bigger, so the BST rule still holds.`);
  const sp = parentOf(t, s)!;
  const side = t.left(sp) === s ? 0 : 1;
  const sr = t.right(s);
  t.setKid(s, 1, null);
  t.setKid(sp, side, sr);
  t.remove(s);
  t.clearTones().tone(node, 'ok');
  v.line(4).eq(`delete the old ${sv} (a leaf) from the right subtree`, 'ok').say(`Finally delete the original ${words(sv)} from the right subtree. It had no left child, so it is an easy case: here, a leaf that simply disappears.`);
  v.eq(`[${del(T, KEY).map((x) => (x === null ? 'null' : x)).join(',')}] · O(h)`, 'ok').say('The whole operation walks down one path and back: O of the height.');
  v.answer(del(T, KEY));

  recap(v, [{ name: 'Rebuild from sorted values', time: 'O(n)', space: 'O(n)' }, { name: 'Search + local fix', time: 'O(h)', space: 'O(h)' }], 'Two children → copy the successor, delete it from the right subtree.', ['Remove from a BST → leaf / one child / two children (successor)'], 'The successor has no left child, so its deletion is always easy.');
  return v.build();
}

function randCase(r: Rng) { const lv = randomBst(r, 12, 1, 40); const vals = lv.filter((x): x is number => x !== null); const key = r.chance(0.8) && vals.length ? r.pick(vals) : r.int(1, 40); return [lv, key]; }

const problem: Problem = {
  slug: 'delete-node-in-a-bst',
  statement: 'Given a root node reference of a BST and a `key`, delete the node with the given key and return the (possibly updated) root. If the key is not present, return the tree unchanged. Any valid BST result is accepted.',
  examples: [{ input: 'root = [5,3,6,2,4,null,7], key = 3', output: '[5,4,6,2,null,null,7]' }, { input: 'root = [5,3,6,2,4,null,7], key = 0', output: '[5,3,6,2,4,null,7]' }, { input: 'root = [], key = 0', output: '[]' }],
  constraints: ['0 ≤ nodes ≤ 10⁴', 'unique values'],
  hints: ['Handle leaf, one child and two children separately.', 'Two children: use the in-order successor.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Rebuild', idea: 'Collect the in-order values without key; build a balanced BST.', time: 'O(n)', space: 'O(n)', bottleneck: 'Touches every node.' },
    { id: 'optimal', kind: 'optimal', name: 'Recursive delete', idea: 'Search; unlink for 0/1 child; copy successor and delete it for 2 children.', time: 'O(h)', space: 'O(h)' },
  ],
  takeaway: 'Two children → **successor** swap.',
  video,
  videoArgs: [T, KEY],
  judge: {
    type: 'fn', fn: 'deleteNode', params: ['TreeNode', 'int'], ret: 'TreeNode', cmp: { checker: 'sameBstSet' },
    tests: [{ args: [T, 3], out: del(T, 3) }, { args: [T, 0], out: T }, { args: [[], 0], out: [] }, { args: [[5, 3, 6, 2, 4, null, 7], 5], out: del(T, 5) }],
    gen: (r: Rng) => randCase(r),
    ref: (lv: Level, k: number) => del(lv, k),
  },
};

export default problem;
