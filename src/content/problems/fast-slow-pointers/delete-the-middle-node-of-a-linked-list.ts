import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const L = [1, 3, 4, 7, 1, 2, 6];

function video() {
  const v = new Video('delete-middle-node', 'Delete the Middle Node of a Linked List');
  const mid = Math.floor(L.length / 2);
  v.chapter('intro', 'The problem');
  const l0 = v.list('l', L, { label: `n = ${L.length} · middle index ⌊n / 2⌋ = ${mid}` });
  l0.tone(l0.id(mid), 'bad');
  v.say(`Delete the middle node, the one at index n over two rounded down, and return the head. Here that is index ${words(mid)}, value ${words(L[mid])}.`);

  v.chapter('brute', 'Brute force: count, then walk', { cx: 'O(n), two passes', code: ['n = length', 'walk to index n/2 − 1 and unlink the next node'] });
  v.eq('two passes', 'warn');

  v.chapter('optimal', 'Optimal: slow stops one node early', { cx: 'O(n), one pass', code: ['if head.next is null: return null', 'slow = head; fast = head.next.next', 'while fast and fast.next: slow = slow.next; fast = fast.next.next', 'slow.next = slow.next.next'] });
  v.clear();
  const l = v.list('l', L, { label: 'head' });
  let s = 0;
  let f = 2;
  l.ptr('slow', l.id(s)).ptr('fast', l.id(f));
  v.line(1).say('To delete a node we need the node before it. Give fast a head start of two, so that slow finishes one node before the middle.');
  while (f < L.length && f + 1 < L.length) {
    s++;
    f += 2;
    l.clearTones().ptr('slow', l.id(s)).ptr('fast', f < L.length ? l.id(f) : null).tone(l.id(s), 'active');
    v.line(2).hold(700);
  }
  l.tone(l.id(s + 1), 'bad');
  v.eq(`slow stops at ${L[s]}, just before the middle ${L[s + 1]}`).say(`Slow stops at ${words(L[s])}, right before the middle, ${words(L[s + 1])}.`);
  const after = s + 2 < L.length ? l.id(s + 2) : null;
  l.removeNode(l.id(s + 1)).setNext(l.id(s), after).clearTones().tone(l.id(s), 'ok');
  const out = L.filter((_, i) => i !== mid);
  v.line(3).eq(`[${out.join(', ')}]`, 'ok').say('Unlink it by pointing slow’s next past it. A single node list simply becomes empty.');
  v.answer(out);

  recap(v, [{ name: 'Count, then walk', time: 'O(n)', space: 'O(1)' }, { name: 'Slow / fast with a head start', time: 'O(n), one pass', space: 'O(1)' }], 'Start fast two ahead so slow lands before the middle.', ['Delete the middle → stop one node early'], 'Adjust the fast pointer’s head start to land slow exactly where you need it.');
  return v.build();
}

const problem: Problem = {
  slug: 'delete-the-middle-node-of-a-linked-list',
  statement: 'You are given the `head` of a linked list. Delete the **middle node** and return the head. The middle node of a list of size `n` is the ⌊n / 2⌋-th node (0-indexed).',
  examples: [{ input: 'head = [1,3,4,7,1,2,6]', output: '[1,3,4,1,2,6]' }, { input: 'head = [1,2,3,4]', output: '[1,2,4]' }, { input: 'head = [2,1]', output: '[2]' }],
  constraints: ['1 ≤ n ≤ 10⁵'],
  hints: ['You need the node before the middle.', 'Give the fast pointer a head start.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count, then walk', idea: 'Count n; walk to n/2 − 1; unlink.', time: 'O(n)', space: 'O(1)', bottleneck: 'Two passes.' },
    { id: 'optimal', kind: 'optimal', name: 'Slow / fast with a head start', idea: 'slow = head, fast = head.next.next; advance; then slow.next = slow.next.next.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['A single-node list returns null.'],
  takeaway: 'Head start of 2 → slow stops **before** the middle.',
  video,
  videoArgs: [L],
  judge: {
    type: 'fn', fn: 'deleteMiddle', params: ['ListNode'], ret: 'ListNode',
    tests: [{ args: [[1, 3, 4, 7, 1, 2, 6]], out: [1, 3, 4, 1, 2, 6] }, { args: [[1, 2, 3, 4]], out: [1, 2, 4] }, { args: [[2, 1]], out: [2] }, { args: [[5]], out: [] }],
    gen: (r: Rng) => [r.ints(r.int(1, 9), 1, 9)],
    ref: (a: number[]) => a.filter((_, i) => i !== Math.floor(a.length / 2)),
  },
};

export default problem;
