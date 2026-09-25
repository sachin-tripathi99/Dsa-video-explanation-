import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [1, 1, 2, 3, 3];

function video() {
  const v = new Video('dedupe-list', 'Remove Duplicates from Sorted List');
  v.chapter('intro', 'The problem');
  const l = v.list('l', A, { label: 'sorted list', prefix: 'n' });
  v.say('The list is sorted, so duplicates sit next to each other. Delete the extra copies so each value appears once.');

  v.chapter('brute', 'Brute force: rebuild with a set', { cx: 'O(n)', code: ['seen = set(); build a new list of unseen values'] });
  v.eq('works for any order, but allocates new nodes and a set').say('A set of seen values works even for unsorted lists, but it builds new nodes and uses extra memory. Sorting gives us something better.');

  v.chapter('optimal', 'Optimal: skip equal neighbours in place', { cx: 'O(n)', code: ['cur = head', 'while cur and cur.next:', '  if cur.next.val == cur.val: cur.next = cur.next.next', '  else: cur = cur.next'] });
  let cur = 'n0';
  l.ptr('cur', cur);
  let first = true;
  const alive = new Set(l.ids());
  while (true) {
    const nx = l.nextOf(cur);
    if (!nx) break;
    l.clearTones().tone(cur, 'active').tone(nx, 'cmp');
    if (l.val(nx) === l.val(cur)) {
      l.tone(nx, 'bad');
      v.line(2).eq(`next is also ${l.val(cur)} → unlink it`, 'bad');
      if (first) v.say('cur is one and the next node is also one. Unlink the next node by pointing cur past it. cur stays, because the new next could be another one.');
      else v.hold(800);
      l.setNext(cur, l.nextOf(nx));
      l.removeNode(nx);
      alive.delete(nx);
      l.ptr('cur', cur);
      v.hold(600);
    } else {
      v.line(3).eq(`${l.val(nx)} ≠ ${l.val(cur)} → move on`);
      v.hold(first ? 900 : 600);
      cur = nx;
      l.ptr('cur', cur);
    }
    first = false;
  }
  l.clearTones().noPtr();
  v.eq(`[${l.ids().map((id) => l.val(id)).join(', ')}]`, 'ok').say('One pass, no extra memory. Sorted input made duplicates neighbours, so we only compare each node with the next.');
  v.answer([...new Set(A)]);
  recap(v, [{ name: 'Set + rebuild', time: 'O(n)', space: 'O(n)' }, { name: 'Skip equal neighbours', time: 'O(n)', space: 'O(1)' }], 'Sorted order puts duplicates side by side.', ['Sorted input → duplicates are adjacent', 'Deleting: only advance when you did not delete'], 'Only move forward when you did not just delete; the new neighbour might be another duplicate.');
  return v.build();
}

const problem: Problem = {
  slug: 'remove-duplicates-from-sorted-list',
  statement: 'Given the head of a **sorted** linked list, delete all duplicates so each element appears only once. Return the (still sorted) list.',
  examples: [{ input: 'head = [1,1,2]', output: '[1,2]' }, { input: 'head = [1,1,2,3,3]', output: '[1,2,3]' }],
  constraints: ['0 ≤ n ≤ 300', '-100 ≤ Node.val ≤ 100', 'sorted ascending'],
  hints: ['Duplicates are next to each other.', 'Compare cur with cur.next.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Set + rebuild', idea: 'Walk the list, append values not yet seen to a new list.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra set and new nodes; doesn’t use the sorted order.' },
    { id: 'optimal', kind: 'optimal', name: 'Unlink equal neighbours', idea: 'If `cur.next.val == cur.val`, set `cur.next = cur.next.next`; otherwise advance `cur`.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Sorted input makes duplicates **adjacent**; compare each node with its next.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'deleteDuplicates', params: ['ListNode'], ret: 'ListNode',
    tests: [{ args: [[1, 1, 2]], out: [1, 2] }, { args: [[1, 1, 2, 3, 3]], out: [1, 2, 3] }, { args: [[]], out: [] }, { args: [[5, 5, 5]], out: [5] }],
    gen: (r) => [r.ints(r.int(0, 12), -3, 3).sort((a, b) => a - b)],
    ref: (a: number[]) => [...new Set(a)],
  },
};

export default problem;
