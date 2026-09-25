import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const L1 = [1, 2, 4];
const L2 = [1, 3, 4];

function video() {
  const v = new Video('merge-two-lists', 'Merge Two Sorted Lists');
  v.chapter('intro', 'The problem');
  const l = v.list('l', L1, { label: 'list1 (top) and list2 (bottom)', prefix: 'a', showNull: false });
  L2.forEach((x, i) => l.add(`b${i}`, x, undefined, i + 1 < L2.length ? `b${i + 1}` : null).row(`b${i}`, 1));
  l.ptr('list1', 'a0').ptr('list2', 'b0');
  v.say('Two sorted linked lists. Merge them into one sorted list by splicing their nodes together, and return its head.');

  v.chapter('brute', 'Brute force: collect, sort, rebuild', { cx: 'O((n+m) log(n+m))', code: ['vals = all values from both lists', 'sort(vals)', 'build a new list from vals'] });
  v.eq('[1, 2, 4] + [1, 3, 4] → sort → [1, 1, 2, 3, 4, 4]').say('The lazy way copies every value into an array, sorts it, and builds brand new nodes. It ignores that both lists were already sorted, and uses extra memory.');

  v.chapter('optimal', 'Optimal: splice with a dummy head', { cx: 'O(n+m)', code: ['dummy = Node(); tail = dummy', 'while l1 and l2:', '  take the smaller head: tail.next = it; advance it', '  tail = tail.next', 'tail.next = l1 or l2   (leftovers)', 'return dummy.next'] });
  v.clear();
  const m = v.list('m', [0], { label: 'splicing: dummy D, then the merged chain', prefix: 'd', showNull: false });
  m.setVal('d0', 'D').tone('d0', 'pivot');
  L1.forEach((x, i) => m.add(`a${i}`, x, undefined, i + 1 < L1.length ? `a${i + 1}` : null).row(`a${i}`, 1));
  L2.forEach((x, i) => m.add(`b${i}`, x, undefined, i + 1 < L2.length ? `b${i + 1}` : null).row(`b${i}`, 2));
  m.setNext('d0', null);
  let p1: number | null = 0;
  let p2: number | null = 0;
  let tail = 'd0';
  const order = ['d0'];
  m.ptr('tail', tail).ptr('l1', 'a0').ptr('l2', 'b0');
  v.line(0).say('Create a dummy node, so we never have to special-case the head of the result. tail marks the end of the merged chain.');
  let step = 0;
  while (p1 !== null && p2 !== null) {
    const takeA = L1[p1] <= L2[p2];
    const id = takeA ? `a${p1}` : `b${p2}`;
    m.setNext(tail, id);
    m.row(id, 0);
    order.push(id);
    m.clearTones().tone('d0', 'pivot').tone(order.slice(1), 'ok').tone(id, 'active');
    tail = id;
    if (takeA) p1 = p1 + 1 < L1.length ? p1 + 1 : null;
    else p2 = p2 + 1 < L2.length ? p2 + 1 : null;
    m.ptr('tail', tail).ptr('l1', p1 === null ? null : `a${p1}`).ptr('l2', p2 === null ? null : `b${p2}`);
    m.order([...order, ...m.ids().filter((x) => !order.includes(x))]);
    v.line(2).eq(takeA ? `${L1[order.filter((x) => x.startsWith('a')).length - 1]} from list1 is smaller or equal → take it` : `${L2[order.filter((x) => x.startsWith('b')).length - 1]} from list2 is smaller → take it`);
    if (step === 0) v.say('Compare the two heads: one and one. Take the one from list one, on ties. Attach it after tail and advance list one.');
    else if (step === 1) v.say('Now two against one: one from list two is smaller, so it goes next.');
    else v.hold(800);
    step++;
  }
  const rest = p1 !== null ? L1.slice(p1).map((_, k) => `a${(p1 as number) + k}`) : L2.slice(p2 as number).map((_, k) => `b${(p2 as number) + k}`);
  m.setNext(tail, rest[0]);
  rest.forEach((id) => {
    m.row(id, 0);
    order.push(id);
  });
  m.clearTones().tone('d0', 'pivot').tone(order.slice(1), 'ok');
  m.ptr('tail', null).ptr('l1', null).ptr('l2', null);
  v.line(4).eq('one list is empty → attach the rest of the other', 'ok').say('When one list runs out, the rest of the other is already sorted, so attach it in one step.');
  m.order(order).ptr('head', order[1]).noPtr('tail', 'l1', 'l2');
  v.line(5).eq('return dummy.next', 'ok').say('Return dummy dot next. No new nodes were created: we only re-pointed next pointers. O of n plus m time and O of one extra space.');
  v.answer([...L1, ...L2].sort((x, y) => x - y));

  recap(v, [{ name: 'Collect, sort, rebuild', time: 'O((n+m) log(n+m))', space: 'O(n+m)' }, { name: 'Splice with a dummy head', time: 'O(n+m)', space: 'O(1)' }], 'Splicing reuses the existing nodes and the existing order.', ['Two sorted sequences → merge with two pointers', 'Building a new list → dummy head + tail pointer'], 'Dummy head plus a tail pointer is the standard way to build a list. And this merge is the same merge as in merge sort.');
  return v.build();
}

const problem: Problem = {
  slug: 'merge-two-sorted-lists',
  statement: 'Given the heads of two **sorted** linked lists `list1` and `list2`, merge them into one sorted list by **splicing** their nodes together, and return its head.',
  examples: [{ input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' }, { input: 'list1 = [], list2 = []', output: '[]' }, { input: 'list1 = [], list2 = [0]', output: '[0]' }],
  constraints: ['0 ≤ list lengths ≤ 50', '-100 ≤ Node.val ≤ 100', 'both lists sorted in non-decreasing order'],
  hints: ['This is the merge step of merge sort.', 'A dummy head avoids special-casing the first node.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Collect, sort, rebuild', idea: 'Copy all values into an array, sort, and build a new list.', time: 'O((n+m) log(n+m))', space: 'O(n+m)', bottleneck: 'Ignores the existing order and allocates new nodes.' },
    { id: 'optimal', kind: 'optimal', name: 'Iterative splice with a dummy head', idea: 'Keep `tail`; repeatedly attach the smaller of the two heads and advance that list; finally attach whichever list remains. (A recursive version also works in O(n+m) time but O(n+m) stack.)', time: 'O(n+m)', space: 'O(1)' },
  ],
  pitfalls: ['Forgetting to attach the leftover list.', 'Returning `dummy` instead of `dummy.next`.'],
  takeaway: 'Build lists with a **dummy head and a tail pointer**; merge sorted sequences with **two pointers**.',
  video,
  videoArgs: [L1, L2],
  judge: {
    type: 'fn', fn: 'mergeTwoLists', params: ['ListNode', 'ListNode'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 4], [1, 3, 4]], out: [1, 1, 2, 3, 4, 4] }, { args: [[], []], out: [] }, { args: [[], [0]], out: [0] }],
    gen: (r) => [r.ints(r.int(0, 8), -10, 10).sort((a, b) => a - b), r.ints(r.int(0, 8), -10, 10).sort((a, b) => a - b)],
    ref: (a: number[], b: number[]) => [...a, ...b].sort((x, y) => x - y),
  },
};

export default problem;
