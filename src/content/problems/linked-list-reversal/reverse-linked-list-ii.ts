import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { animateReverse } from '../../listviz';

const L = [1, 2, 3, 4, 5, 6];
const LEFT = 2;
const RIGHT = 5;
const rev = (a: number[], l: number, r: number) => [...a.slice(0, l - 1), ...a.slice(l - 1, r).reverse(), ...a.slice(r)];

function video() {
  const v = new Video('reverse-linked-list-ii', 'Reverse Linked List II');
  v.chapter('intro', 'The problem');
  const l0 = v.list('l', L, { label: `left = ${LEFT}, right = ${RIGHT} (1-indexed)` });
  for (let i = LEFT - 1; i < RIGHT; i++) l0.tone(l0.id(i), 'active');
  v.say(`Reverse only the nodes from position ${words(LEFT)} to position ${words(RIGHT)}, counting from one, in a single pass.`);
  v.eq(`→ [${rev(L, LEFT, RIGHT).join(', ')}]`);

  v.chapter('brute', 'Brute force: values into an array', { cx: 'O(n) · O(n)', code: ['copy values to an array', 'reverse the slice left−1 .. right−1', 'write the values back'] });
  v.eq('extra array and value rewriting', 'warn').say('Copying values into an array, reversing the slice, and writing them back works, but uses extra memory and does not reverse links.');

  v.chapter('optimal', 'Optimal: reverse the piece and reconnect', { cx: 'O(n) · O(1)', code: ['dummy.next = head; before = dummy', 'move before left − 1 steps', 'reverse right − left + 1 nodes, prev starting at the node after them', 'before.next = the piece’s new front'] });
  v.clear();
  const l = v.list('l', ['D', ...L], { label: 'dummy D in front' });
  const ids = l.ids();
  l.ptr('before', ids[0]);
  v.line(0).say('Put a dummy node in front, so that even left equal to one has a node before it.');
  for (let k = 1; k < LEFT; k++) { l.ptr('before', ids[k]); v.line(1).eq(`before → ${L[k - 1]}`).hold(600); }
  const before = ids[LEFT - 1];
  const piece = ids.slice(LEFT, RIGHT + 1);
  const after = RIGHT + 1 < ids.length ? ids[RIGHT + 1] : null;
  l.tone(before, 'cmp');
  if (after) l.tone(after, 'cmp');
  v.say(`Before stops on ${LEFT > 1 ? words(L[LEFT - 2]) : "the dummy"}, the node in front of the piece. The node after the piece is ${after ? words(L[RIGHT]) : 'null'}.`);
  l.noPtr('before');
  animateReverse(v, l, piece, { before, after, line: [2], perStep: 650, firstSay: `Reverse the piece with prev starting at ${after ? words(L[RIGHT]) : 'null'}, so the piece’s first node, ${words(L[LEFT - 1])}, ends up pointing at it.` });
  l.tone(before, 'cmp');
  if (after) l.tone(after, 'cmp');
  v.line(3).eq(`before.next = ${L[RIGHT - 1]} → [${rev(L, LEFT, RIGHT).join(', ')}]`, 'ok').say(`Finally point before at ${words(L[RIGHT - 1])}, the piece’s new front. One pass, constant memory.`);
  v.answer(rev(L, LEFT, RIGHT));

  recap(v, [{ name: 'Array of values', time: 'O(n)', space: 'O(n)' }, { name: 'Reverse and reconnect', time: 'O(n)', space: 'O(1)' }], 'Remember the neighbours of the piece; prev starts at the node after it.', ['Reverse a sublist → dummy + before + reversal + reconnect'], 'The only new work compared with a full reversal is reconnecting the two ends.');
  return v.build();
}

const problem: Problem = {
  slug: 'reverse-linked-list-ii',
  statement: 'Given the `head` of a singly linked list and two integers `left <= right`, reverse the nodes of the list from position `left` to position `right` (1-indexed), and return the reversed list.',
  examples: [{ input: 'head = [1,2,3,4,5], left = 2, right = 4', output: '[1,4,3,2,5]' }, { input: 'head = [5], left = 1, right = 1', output: '[5]' }],
  constraints: ['1 ≤ n ≤ 500', '1 ≤ left ≤ right ≤ n'],
  hints: ['Find the node before position left.', 'Reverse the piece and reconnect both ends.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Array of values', idea: 'Copy values, reverse the slice, write back.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra memory.' },
    { id: 'optimal', kind: 'optimal', name: 'Reverse and reconnect', idea: 'Dummy; walk before; reverse right − left + 1 nodes with prev = node after; before.next = new front.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Sublist reversal = **reverse + reconnect**, with a dummy head.',
  video,
  videoArgs: [L, LEFT, RIGHT],
  judge: {
    type: 'fn', fn: 'reverseBetween', params: ['ListNode', 'int', 'int'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 3, 4, 5], 2, 4], out: [1, 4, 3, 2, 5] }, { args: [[5], 1, 1], out: [5] }, { args: [[3, 5], 1, 2], out: [5, 3] }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 9), 1, 9); const lft = r.int(1, a.length); return [a, lft, r.int(lft, a.length)]; },
    ref: (a: number[], l: number, rr: number) => rev(a, l, rr),
  },
};

export default problem;
