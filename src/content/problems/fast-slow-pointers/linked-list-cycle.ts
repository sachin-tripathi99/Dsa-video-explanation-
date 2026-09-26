import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const L = [3, 2, 0, -4];
const POS = 1;

function video() {
  const v = new Video('linked-list-cycle', 'Linked List Cycle');
  const n = L.length;
  const nxt = (i: number) => (i + 1 < n ? i + 1 : POS);
  v.chapter('intro', 'The problem');
  const l0 = v.list('l', L, { label: `tail links back to index ${POS}`, showNull: false });
  l0.setNext(l0.id(n - 1), l0.id(POS));
  v.say('Does this linked list contain a cycle, a node you can reach again by following next pointers? Here the tail points back to the node with value two.');

  v.chapter('brute', 'Brute force: remember visited nodes', { cx: 'O(n) · O(n) space', code: ['seen = set()', 'while node: if node in seen: return true; seen.add(node); node = node.next', 'return false'] });
  v.clear();
  const lb = v.list('l', L, { label: 'hash set of visited nodes', showNull: false });
  lb.setNext(lb.id(n - 1), lb.id(POS));
  const seen = v.map('seen', { set: true, label: 'seen' });
  let i = 0;
  const vis = new Set<number>();
  for (;;) {
    lb.clearTones().ptr('node', lb.id(i));
    if (vis.has(i)) { lb.tone(lb.id(i), 'bad'); seen.tone(`#${i}`, 'bad'); v.line(1).eq(`node ${L[i]} already seen → cycle`, 'ok'); break; }
    vis.add(i);
    seen.put(`#${i}`, L[i]);
    lb.tone(lb.id(i), 'active');
    v.line(1).hold(500);
    i = nxt(i);
  }
  v.say('Storing each visited node in a hash set finds the repeat, but it costs memory for every node.');

  v.chapter('optimal', "Optimal: Floyd's tortoise and hare", { cx: 'O(n) · O(1)', code: ['slow = fast = head', 'while fast and fast.next:', '  slow = slow.next; fast = fast.next.next', '  if slow is fast: return true', 'return false'] });
  v.clear();
  const l = v.list('l', L, { label: 'head', showNull: false });
  l.setNext(l.id(n - 1), l.id(POS));
  let s = 0;
  let f = 0;
  l.ptr('slow', l.id(0)).ptr('fast', l.id(0));
  v.say('Two pointers, one step and two steps. Without a cycle, fast reaches null. With a cycle, fast catches up with slow from behind.');
  let k = 0;
  do {
    s = nxt(s);
    f = nxt(nxt(f));
    k++;
    l.clearTones().ptr('slow', l.id(s)).ptr('fast', l.id(f)).tone(l.id(s), s === f ? 'ok' : 'active').tone(l.id(f), s === f ? 'ok' : 'warn');
    v.line(2, 3).eq(`slow at ${L[s]}, fast at ${L[f]}${s === f ? ' → meet' : ''}`, s === f ? 'ok' : undefined);
    if (s === f) v.say(`After ${words(k)} steps they meet at ${words(L[s])}. There is a cycle.`);
    else v.hold(800);
  } while (s !== f);
  v.answer(true);

  recap(v, [{ name: 'Hash set of nodes', time: 'O(n)', space: 'O(n)' }, { name: "Floyd's algorithm", time: 'O(n)', space: 'O(1)' }], 'A faster runner laps a slower one only on a loop.', ['Cycle detection with O(1) memory → Floyd'], 'Floyd’s algorithm replaces a visited set with a second pointer.');
  return v.build();
}

const problem: Problem = {
  slug: 'linked-list-cycle',
  statement: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it: some node can be reached again by continuously following `next`. Return `true` if there is a cycle, otherwise `false`. (Internally, `pos` is the index the tail connects to, or −1.)',
  examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true' }, { input: 'head = [1,2], pos = 0', output: 'true' }, { input: 'head = [1], pos = -1', output: 'false' }],
  constraints: ['0 ≤ n ≤ 10⁴', 'pos is −1 or a valid index'],
  hints: ['Can you solve it with O(1) memory?', 'Two pointers at different speeds.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Hash set of nodes', idea: 'Return true when a node repeats.', time: 'O(n)', space: 'O(n)', bottleneck: 'Stores every node.' },
    { id: 'optimal', kind: 'optimal', name: "Floyd's cycle detection", idea: 'slow += 1, fast += 2; meeting means a cycle, fast reaching null means none.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Cycle ⇔ **fast meets slow**.',
  video,
  videoArgs: [[L, POS]],
  judge: {
    type: 'fn', fn: 'hasCycle', params: ['ListNode@cycle'], ret: 'boolean',
    tests: [{ args: [[[3, 2, 0, -4], 1]], out: true }, { args: [[[1, 2], 0]], out: true }, { args: [[[1], -1]], out: false }, { args: [[[], -1]], out: false }],
    gen: (r: Rng) => { const a = r.ints(r.int(0, 8), -5, 5); return [[a, a.length && r.chance(0.5) ? r.int(0, a.length - 1) : -1]]; },
    ref: (x: [number[], number]) => x[1] >= 0,
  },
};

export default problem;
