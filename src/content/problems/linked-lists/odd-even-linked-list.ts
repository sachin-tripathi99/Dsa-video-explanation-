import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [1, 2, 3, 4, 5, 6, 7];

function video() {
  const v = new Video('odd-even-list', 'Odd Even Linked List');
  v.chapter('intro', 'The problem');
  v.list('l', A, { label: 'positions 1, 2, 3 … (not values)', prefix: 'n' });
  v.say('Group all nodes at odd positions first, then all nodes at even positions, keeping their relative order. Positions, not values: first, third, fifth, then second, fourth, sixth. In place, with O of one extra space.');

  v.chapter('brute', 'Brute force: collect values and rebuild', { cx: 'O(n)', code: ['odd = values at positions 1, 3, 5, …', 'even = values at positions 2, 4, …', 'build a new list: odd + even'] });
  v.eq('[1, 3, 5, 7] + [2, 4, 6]').say('We could copy the values into two arrays and build a new list. It uses O of n extra memory, which the problem forbids.');

  v.chapter('optimal', 'Optimal: weave two chains', { cx: 'O(n)', code: ['odd = head; even = head.next; evenHead = even', 'while even and even.next:', '  odd.next = even.next;  odd = odd.next', '  even.next = odd.next;  even = even.next', 'odd.next = evenHead'] });
  v.clear();
  const l = v.list('l', A, { label: 'odd chain (top) and even chain (bottom)', prefix: 'n', showNull: false });
  l.ids().forEach((id, i) => l.row(id, i % 2));
  let odd = 'n0';
  let even: string | null = 'n1';
  const evenHead = 'n1';
  l.ptr('odd', odd).ptr('even', even).tone('n1', 'pivot');
  v.line(0).say('Keep two pointers: odd at the first node, even at the second. Remember where the even chain starts.');
  let step = 0;
  while (even && l.nextOf(even)) {
    const nextOdd = l.nextOf(even)!;
    l.setNext(odd, nextOdd);
    odd = nextOdd;
    const nextEven = l.nextOf(odd);
    l.setNext(even, nextEven);
    even = nextEven;
    l.clearTones().tone('n1', 'pivot').tone(odd, 'ok');
    if (even) l.tone(even, 'active');
    l.ptr('odd', odd).ptr('even', even);
    v.line(2, 3).eq(`odd → ${l.val(odd)}${even ? `, even → ${l.val(even)}` : ''}`);
    if (step === 0) v.say('Each odd node links to the node after the next even node, and each even node links to the node after the next odd node. The two chains weave apart.');
    else v.hold(900);
    step++;
  }
  l.setNext(odd, evenHead);
  l.clearTones().tone(odd, 'ok').tone(evenHead, 'pivot');
  v.line(4).eq('attach the even chain after the last odd node', 'ok').say('Finally, attach the head of the even chain after the last odd node.');
  const order: string[] = [];
  let c: string | null = 'n0';
  while (c && order.length < A.length) {
    order.push(c);
    c = l.nextOf(c);
  }
  order.forEach((id) => l.row(id, 0));
  l.order(order).clearTones().noPtr();
  const out = order.map((id) => l.val(id) as number);
  v.eq(`[${out.join(', ')}]`, 'ok').say('One pass, only pointer changes, O of one extra space.');
  v.answer(out);
  recap(v, [{ name: 'Collect and rebuild', time: 'O(n)', space: 'O(n)' }, { name: 'Weave two chains', time: 'O(n)', space: 'O(1)' }], 'Splitting into two chains and joining them avoids copying.', ['Partition a list → build separate chains, then connect them', 'Remember the head of the second chain'], 'Partitioning a linked list means building separate chains and connecting them at the end.');
  return v.build();
}

const problem: Problem = {
  slug: 'odd-even-linked-list',
  statement: 'Given the head of a singly linked list, group all nodes at **odd positions** together followed by the nodes at **even positions** (the first node is odd), keeping the relative order within each group. Use O(1) extra space and O(n) time.',
  examples: [{ input: 'head = [1,2,3,4,5]', output: '[1,3,5,2,4]' }, { input: 'head = [2,1,3,5,6,4,7]', output: '[2,3,6,7,1,5,4]' }],
  constraints: ['0 ≤ n ≤ 10⁴'],
  hints: ['Positions, not values.', 'Build two chains while walking, then join them.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Collect and rebuild', idea: 'Copy odd-position and even-position values to two arrays and build a new list.', time: 'O(n)', space: 'O(n)', bottleneck: 'Uses O(n) extra memory.' },
    { id: 'optimal', kind: 'optimal', name: 'Weave two chains', idea: '`odd.next = even.next; odd = odd.next; even.next = odd.next; even = even.next` until even runs out; then `odd.next = evenHead`.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Losing the even head: save it before the loop.', 'Loop condition must check both `even` and `even.next`.'],
  takeaway: 'Partition a list by **building separate chains** and joining them.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'oddEvenList', params: ['ListNode'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 3, 4, 5]], out: [1, 3, 5, 2, 4] }, { args: [[2, 1, 3, 5, 6, 4, 7]], out: [2, 3, 6, 7, 1, 5, 4] }, { args: [[]], out: [] }, { args: [[1]], out: [1] }],
    gen: (r) => [r.ints(r.int(0, 12), -9, 9)],
    ref: (a: number[]) => [...a.filter((_, i) => i % 2 === 0), ...a.filter((_, i) => i % 2 === 1)],
  },
};

export default problem;
