import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const L1 = [2, 4, 3];
const L2 = [5, 6, 4];

function video() {
  const v = new Video('add-two-numbers', 'Add Two Numbers');
  v.chapter('intro', 'The problem');
  v.list('a', L1, { label: 'l1 = 342 (digits stored in reverse)', prefix: 'a' });
  v.list('b', L2, { label: 'l2 = 465 (digits stored in reverse)', prefix: 'b' });
  v.say('Two numbers are stored as linked lists of digits, in reverse order: the ones digit comes first. Add them and return the sum as a list in the same format. Three four two plus four six five is eight zero seven.');

  v.chapter('brute', 'Brute force: convert to integers', { cx: 'O(n)', code: ['x = number(l1); y = number(l2)', 'return digits of x + y'] });
  v.eq('lists can have 100 digits → overflows 64-bit integers', 'bad').say('Converting the lists into integers overflows as soon as they have more than about eighteen digits. Lists here can have a hundred.');

  v.chapter('optimal', 'Optimal: school addition with a carry', { cx: 'O(max(n, m))', code: ['dummy = Node(); tail = dummy; carry = 0', 'while l1 or l2 or carry:', '  s = carry + (l1.val) + (l2.val)', '  tail.next = Node(s % 10); carry = s / 10', '  advance l1, l2, tail'] });
  v.clear();
  const a = v.list('a', L1, { label: 'l1', prefix: 'a' });
  const b = v.list('b', L2, { label: 'l2', prefix: 'b' });
  const r = v.list('r', [], { label: 'result', prefix: 'r' });
  const vv = v.vars('v', { carry: 0 });
  v.say('The reversed order is a gift: the ones digits come first, exactly where school addition starts.');
  let carry = 0;
  const out: number[] = [];
  const n = Math.max(L1.length, L2.length);
  for (let i = 0; i < n || carry; i++) {
    const x = L1[i] ?? 0;
    const y = L2[i] ?? 0;
    const s = x + y + carry;
    out.push(s % 10);
    a.clearTones();
    b.clearTones();
    if (i < L1.length) a.ptr('l1', `a${i}`).tone(`a${i}`, 'active');
    else a.noPtr();
    if (i < L2.length) b.ptr('l2', `b${i}`).tone(`b${i}`, 'active');
    else b.noPtr();
    r.add(`r${i}`, s % 10);
    if (i > 0) r.setNext(`r${i - 1}`, `r${i}`);
    r.clearTones().tone(`r${i}`, 'ok');
    const newCarry = Math.floor(s / 10);
    vv.set({ carry: newCarry });
    v.line(2, 3).eq(`${x} + ${y} + carry ${carry} = ${s} → write ${s % 10}, carry ${newCarry}`, newCarry ? 'warn' : 'ok');
    if (i === 0) v.say(`Two plus five is seven. Write seven, carry zero.`);
    else if (i === 1) v.say('Four plus six is ten. Write zero and carry one to the next digit.');
    else if (i === 2) v.say('Three plus four plus the carry is eight.');
    else v.hold(700);
    carry = newCarry;
  }
  a.noPtr();
  b.noPtr();
  v.eq(`[${out.join(', ')}] = 807`, 'ok').note('keep looping while there is a carry').say('The result is seven, zero, eight: eight hundred and seven. Keep looping while either list has digits or a carry remains, so nine nine plus one correctly becomes zero zero one.');
  v.answer(out);
  recap(v, [{ name: 'Convert to integers', time: 'O(n)', space: 'O(1)', kind: 'brute' }, { name: 'Digit-by-digit with carry', time: 'O(max(n, m))', space: 'O(1) extra', kind: 'optimal' }], 'Converting overflows; adding digit by digit works for any length.', ['Big numbers → digit arithmetic with a carry', 'Loop while l1 or l2 or carry'], 'Just like plus one, but with two lists: simulate school addition.');
  return v.build();
}

const problem: Problem = {
  slug: 'add-two-numbers',
  statement: 'Two non-negative integers are stored in linked lists in **reverse order**, one digit per node. Add them and return the sum as a linked list in the same format. Neither number has leading zeros, except the number 0 itself.',
  examples: [{ input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', why: '342 + 465 = 807' }, { input: 'l1 = [0], l2 = [0]', output: '[0]' }, { input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]', output: '[8,9,9,9,0,0,0,1]' }],
  constraints: ['1 ≤ list length ≤ 100', '0 ≤ Node.val ≤ 9'],
  hints: ['Why is reverse order convenient?', 'Keep a carry; don’t forget a final carry.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Convert to integers', idea: 'Read each list into a number, add, split the sum into digits.', time: 'O(n)', space: 'O(n)', bottleneck: 'Overflows 64-bit integers for long lists (Python’s big ints hide the problem).' },
    { id: 'optimal', kind: 'optimal', name: 'School addition with a carry', idea: 'Walk both lists together; each step writes `(x + y + carry) % 10` and keeps `carry = sum / 10`; continue while either list or the carry remains.', time: 'O(max(n, m))', space: 'O(1) extra (output aside)' },
  ],
  pitfalls: ['Dropping the final carry (e.g. 5 + 5 = 10 needs a new node).', 'Stopping when one list ends instead of when both have ended.'],
  takeaway: 'Numbers too big for built-in types → **digit-by-digit arithmetic with a carry**.',
  video,
  videoArgs: [L1, L2],
  judge: {
    type: 'fn', fn: 'addTwoNumbers', params: ['ListNode', 'ListNode'], ret: 'ListNode',
    tests: [
      { args: [[2, 4, 3], [5, 6, 4]], out: [7, 0, 8] }, { args: [[0], [0]], out: [0] }, { args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], out: [8, 9, 9, 9, 0, 0, 0, 1] },
      { args: [[1, ...Array(29).fill(0), 1], [5, 6, 4]], out: [6, 6, 4, ...Array(27).fill(0), 1], big: true },
    ],
    gen: (r) => { const mk = () => { const d = r.ints(r.int(1, 7), 0, 9); if (d.length > 1 && d[d.length - 1] === 0) d[d.length - 1] = 1; return d; }; return [mk(), mk()]; },
    ref: (a: number[], b: number[]) => { const out: number[] = []; let c = 0; for (let i = 0; i < Math.max(a.length, b.length) || c; i++) { const s = (a[i] ?? 0) + (b[i] ?? 0) + c; out.push(s % 10); c = Math.floor(s / 10); } return out; },
  },
};

export default problem;
