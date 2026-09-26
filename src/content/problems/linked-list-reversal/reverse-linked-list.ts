import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { animateReverse } from '../../listviz';

const L = [1, 2, 3, 4, 5];

function video() {
  const v = new Video('reverse-linked-list', 'Reverse Linked List');
  v.chapter('intro', 'The problem');
  v.list('l', L, { label: 'head' });
  v.say('Reverse a singly linked list and return the new head.');

  v.chapter('brute', 'Brute force: copy the values out and write them back', { cx: 'O(n) · O(n) space', code: ['vals = all values in a stack', 'walk the list again, writing vals popped from the stack'] });
  v.clear();
  const l1 = v.list('l', L, { label: 'head' });
  const st = v.stack('st', [], { label: 'stack of values' });
  L.forEach((x, i) => { st.push(x); l1.clearTones().tone(l1.id(i), 'active'); v.line(0).hold(350); });
  l1.clearTones();
  v.eq('values reversed via a stack: O(n) extra memory', 'warn').say('Push every value onto a stack, then walk the list again and pop values back in. It works, but uses a stack as large as the list, and it rewrites values instead of reversing links.');

  v.chapter('better', 'Recursion', { cx: 'O(n) · O(n) stack', code: ['rev(node): if node is null or node.next is null: return node', '  h = rev(node.next)', '  node.next.next = node; node.next = null', '  return h'] });
  v.eq('elegant, but the call stack holds n frames', 'ok').say('Recursively: reverse everything after the head, then make the head’s old next node point back at the head. Short and elegant, but each node adds a call stack frame, so ten thousand nodes means ten thousand frames.');

  v.chapter('optimal', 'Optimal: iterative with three pointers', { cx: 'O(n) · O(1)', code: ['prev = null; cur = head', 'while cur:', '  next = cur.next; cur.next = prev', '  prev = cur; cur = next', 'return prev'] });
  v.clear();
  const l = v.list('l', L, { label: 'head' });
  animateReverse(v, l, l.ids(), { line: [2, 3], firstSay: 'Walk the list once, flipping each arrow. Save next, point cur back at prev, then step forward.' });
  l.ptr('head', l.ids()[0]);
  v.line(4).eq(`return prev → ${[...L].reverse().join(' → ')}`, 'ok').say('Cur has fallen off the end and prev holds the new head.');
  v.answer([...L].reverse());

  recap(v, [{ name: 'Stack of values', time: 'O(n)', space: 'O(n)' }, { name: 'Recursion', time: 'O(n)', space: 'O(n) stack' }, { name: 'Iterative three pointers', time: 'O(n)', space: 'O(1)' }], 'Save next, flip, advance.', ['Any reversal of links → prev / cur / next'], 'This three-pointer loop is the building block for every reversal problem.');
  return v.build();
}

const problem: Problem = {
  slug: 'reverse-linked-list',
  statement: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
  examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }, { input: 'head = [1,2]', output: '[2,1]' }, { input: 'head = []', output: '[]' }],
  constraints: ['0 ≤ n ≤ 5000'],
  hints: ['Keep track of the previous node.', 'Can you do it iteratively and recursively?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Stack of values', idea: 'Push values, then overwrite them in reverse order.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra stack; changes values not links.' },
    { id: 'better', kind: 'better', name: 'Recursion', idea: 'Reverse the rest, then attach head at the end.', time: 'O(n)', space: 'O(n) stack' },
    { id: 'optimal', kind: 'optimal', name: 'Iterative three pointers', idea: 'prev / cur / next; flip each link; return prev.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '**prev / cur / next**: save, flip, advance.',
  video,
  videoArgs: [L],
  judge: {
    type: 'fn', fn: 'reverseList', params: ['ListNode'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 3, 4, 5]], out: [5, 4, 3, 2, 1] }, { args: [[1, 2]], out: [2, 1] }, { args: [[]], out: [] }],
    gen: (r: Rng) => [r.ints(r.int(0, 9), -9, 9)],
    ref: (a: number[]) => [...a].reverse(),
  },
};

export default problem;
