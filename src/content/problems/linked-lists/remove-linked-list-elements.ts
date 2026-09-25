import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [6, 1, 6, 3, 6];
const VAL = 6;

function video() {
  const v = new Video('remove-list-elements', 'Remove Linked List Elements');
  v.chapter('intro', 'The problem');
  const l = v.list('l', A, { label: `remove every ${VAL}`, prefix: 'n' });
  l.ids().forEach((id) => l.val(id) === VAL && l.tone(id, 'bad'));
  v.say('Remove every node whose value equals val. Notice the very first node must be removed too, which is exactly the kind of case that causes bugs.');

  v.chapter('brute', 'Brute force: copy the survivors', { cx: 'O(n)', code: ['build a new list from nodes with value != val'] });
  v.eq('new nodes for [1, 3] → O(n) extra memory').say('One option is to build a new list of the survivors. It works, but allocates new nodes.');

  v.chapter('optimal', 'Optimal: dummy head + prev pointer', { cx: 'O(n)', code: ['dummy = Node(0, head); prev = dummy', 'while prev.next:', '  if prev.next.val == val: prev.next = prev.next.next', '  else: prev = prev.next', 'return dummy.next'] });
  v.clear();
  const d = v.list('d', [0, ...A], { label: 'dummy D in front of the list', prefix: 'n' });
  d.setVal('n0', 'D').tone('n0', 'pivot');
  let prev = 'n0';
  d.ptr('prev', prev);
  v.line(0).say('Put a dummy node in front. Now even the first real node has a previous node, so removing it is not a special case.');
  let first = true;
  for (;;) {
    const nx = d.nextOf(prev);
    if (!nx) break;
    d.clearTones().tone('n0', 'pivot').tone(nx, d.val(nx) === VAL ? 'bad' : 'cmp');
    if (d.val(nx) === VAL) {
      v.line(2).eq(`prev.next is ${VAL} → skip it`, 'bad');
      if (first) v.say('prev dot next is six. Skip it by pointing prev past it. prev stays where it is.');
      else v.hold(700);
      d.setNext(prev, d.nextOf(nx));
      d.removeNode(nx);
      d.ptr('prev', prev);
      v.hold(500);
    } else {
      v.line(3).eq(`${d.val(nx)} stays → prev moves`).hold(650);
      prev = nx;
      d.ptr('prev', prev);
    }
    first = false;
  }
  d.clearTones().tone('n0', 'pivot').noPtr();
  v.line(4).eq('return dummy.next → [1, 3]', 'ok').say('Return dummy dot next. One pass, no new nodes, and no special case for the head.');
  v.answer(A.filter((x) => x !== VAL));
  recap(v, [{ name: 'Copy survivors', time: 'O(n)', space: 'O(n)' }, { name: 'Dummy head + prev', time: 'O(n)', space: 'O(1)' }], 'The dummy node removes the head special case.', ['Head might be deleted → dummy node', 'Delete by re-pointing prev.next'], 'Whenever the head might change, reach for a dummy node.');
  return v.build();
}

const problem: Problem = {
  slug: 'remove-linked-list-elements',
  statement: 'Given the head of a linked list and an integer `val`, remove all nodes with `Node.val == val` and return the new head.',
  examples: [{ input: 'head = [1,2,6,3,4,5,6], val = 6', output: '[1,2,3,4,5]' }, { input: 'head = [], val = 1', output: '[]' }, { input: 'head = [7,7,7,7], val = 7', output: '[]' }],
  constraints: ['0 ≤ n ≤ 10⁴', '1 ≤ Node.val ≤ 50', '0 ≤ val ≤ 50'],
  hints: ['What if the head itself must be removed?', 'A dummy node in front makes every node have a predecessor.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Copy survivors to a new list', idea: 'Walk the list and append nodes with other values to a new list.', time: 'O(n)', space: 'O(n)', bottleneck: 'Allocates new nodes.' },
    { id: 'optimal', kind: 'optimal', name: 'Dummy head + prev', idea: 'With `prev` starting at a dummy node, unlink `prev.next` when it matches; otherwise advance `prev`.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'A **dummy head** turns "delete the head" into a normal delete.',
  video,
  videoArgs: [A, VAL],
  judge: {
    type: 'fn', fn: 'removeElements', params: ['ListNode', 'int'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 6, 3, 4, 5, 6], 6], out: [1, 2, 3, 4, 5] }, { args: [[], 1], out: [] }, { args: [[7, 7, 7, 7], 7], out: [] }],
    gen: (r) => [r.ints(r.int(0, 10), 1, 4), r.int(1, 4)],
    ref: (a: number[], val: number) => a.filter((x) => x !== val),
  },
};

export default problem;
