import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const L = [1, 2, 3, 4, 5, 6];

function video() {
  const v = new Video('middle-of-list', 'Middle of the Linked List');
  v.chapter('intro', 'The problem');
  v.list('l', L, { label: 'head' });
  v.say('Return the middle node of a linked list. If there are two middle nodes, return the second one.');
  v.eq(`${L.length} nodes → two middles (${L[L.length / 2 - 1]} and ${L[L.length / 2]}) → return ${L[L.length / 2]}`);

  v.chapter('brute', 'Brute force: count, then walk', { cx: 'O(n), two passes', code: ['n = length of the list', 'walk n / 2 steps from head'] });
  v.eq('two passes over the list', 'warn').say('Count the nodes in one pass, then walk halfway in a second. Linear, but it touches the list twice. Copying nodes into an array would need extra memory.');

  v.chapter('optimal', 'Optimal: slow and fast pointers', { cx: 'O(n), one pass · O(1)', code: ['slow = fast = head', 'while fast and fast.next:', '  slow = slow.next', '  fast = fast.next.next', 'return slow'] });
  v.clear();
  const l = v.list('l', L, { label: 'head' });
  let s = 0;
  let f = 0;
  l.ptr('slow', l.id(0)).ptr('fast', l.id(0));
  v.line(0).say('Move slow one node and fast two nodes at a time. When fast runs out of room, slow is halfway.');
  while (f < L.length && f + 1 < L.length) {
    s++;
    f += 2;
    l.clearTones().tone(l.id(s), 'active').ptr('slow', l.id(s)).ptr('fast', f < L.length ? l.id(f) : null);
    v.line(2, 3).eq(`slow → ${L[s]}, fast → ${f < L.length ? L[f] : 'null'}`).hold(800);
  }
  l.tone(l.id(s), 'ok');
  v.line(4).eq(`return node ${L[s]}`, 'ok').say(`Fast has stepped past the end, so slow, at ${words(L[s])}, is the second middle. The loop condition, fast and fast dot next, is what picks the second middle for even lengths.`);
  v.answer(L.slice(s));

  recap(v, [{ name: 'Count, then walk', time: 'O(n)', space: 'O(1)' }, { name: 'Slow / fast pointers', time: 'O(n), one pass', space: 'O(1)' }], 'Fast moves twice as far: when it ends, slow is halfway.', ['Middle of a list in one pass → slow / fast'], 'The fast pointer measures the length while the slow pointer marks the halfway point.');
  return v.build();
}

const problem: Problem = {
  slug: 'middle-of-the-linked-list',
  statement: 'Given the `head` of a singly linked list, return the middle node. If there are two middle nodes, return the **second** one.',
  examples: [{ input: 'head = [1,2,3,4,5]', output: '[3,4,5]' }, { input: 'head = [1,2,3,4,5,6]', output: '[4,5,6]' }],
  constraints: ['1 ≤ n ≤ 100'],
  hints: ['One pointer moves twice as fast as the other.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count, then walk', idea: 'Count n, then advance n / 2 steps.', time: 'O(n)', space: 'O(1)', bottleneck: 'Two passes.' },
    { id: 'optimal', kind: 'optimal', name: 'Slow / fast pointers', idea: 'Advance slow by 1 and fast by 2 while fast and fast.next exist.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '**Fast ends, slow is halfway.**',
  video,
  videoArgs: [L],
  judge: {
    type: 'fn', fn: 'middleNode', params: ['ListNode'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 3, 4, 5]], out: [3, 4, 5] }, { args: [[1, 2, 3, 4, 5, 6]], out: [4, 5, 6] }, { args: [[1]], out: [1] }],
    gen: (r: Rng) => [r.ints(r.int(1, 10), 1, 9)],
    ref: (a: number[]) => a.slice(Math.floor(a.length / 2)),
  },
};

export default problem;
