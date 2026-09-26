import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const L = [1, 2, 3, 4, 5];
const K = 7;
const rot = (a: number[], k: number) => { if (!a.length) return []; const s = k % a.length; return [...a.slice(a.length - s), ...a.slice(0, a.length - s)]; };

function video() {
  const v = new Video('rotate-list', 'Rotate List');
  const n = L.length;
  const s = K % n;
  v.chapter('intro', 'The problem');
  v.list('l', L, { label: `rotate right by k = ${K}` });
  v.say(`Rotate the list to the right by k places: each step, the last node moves to the front. Here k is ${words(K)}.`);
  v.eq(`${K} rotations of a ${n}-node list = ${K} mod ${n} = ${s} → [${rot(L, K).join(', ')}]`, 'ok').say(`Rotating by the length brings the list back to where it started, so only k mod n matters: ${words(K)} mod ${words(n)} is ${words(s)}.`);

  v.chapter('brute', 'Brute force: move the tail to the front k times', { cx: 'O(n · k)', code: ['repeat k times:', '  walk to the second-to-last node; move the tail to the front'] });
  v.eq('each rotation walks the whole list; k can be 2 · 10⁹', 'bad').say('Moving one node at a time walks the list k times. With k up to two billion, that never finishes.');

  v.chapter('optimal', 'Optimal: close the ring, cut in the right place', { cx: 'O(n) · O(1)', code: ['n = length; tail = last node', 'k %= n; if k == 0: return head', 'tail.next = head          # make a ring', 'newTail = node n − k − 1; newHead = newTail.next', 'newTail.next = null'] });
  v.clear();
  const l = v.list('l', L, { label: 'head', showNull: false });
  const ids = l.ids();
  l.ptr('tail', ids[n - 1]);
  v.line(0).eq(`n = ${n}, k % n = ${s}`).say(`One pass finds the length, ${words(n)}, and the tail. Reduce k to ${words(s)}.`);
  l.setNext(ids[n - 1], ids[0]).tone(ids[n - 1], 'active').tone(ids[0], 'active');
  v.line(2).eq('tail.next = head → a ring').say('Now join the tail to the head, making a ring. A rotation is just choosing a different place to cut the ring.');
  const nt = n - s - 1;
  l.clearTones().noPtr().ptr('newTail', ids[nt]).ptr('newHead', ids[nt + 1]).tone(ids[nt], 'warn').tone(ids[nt + 1], 'ok');
  v.line(3).eq(`new tail = node ${n - s} from the start (value ${L[nt]}), new head = ${L[nt + 1]}`).say(`The new head is the node ${words(s)} places from the end, value ${words(L[nt + 1])}. The node before it, ${words(L[nt])}, becomes the new tail.`);
  l.setNext(ids[nt], null);
  l.order([...ids.slice(nt + 1), ...ids.slice(0, nt + 1)]).clearTones().ptr('head', ids[nt + 1]).noPtr('newHead', 'newTail');
  v.line(4).eq(`[${rot(L, K).join(', ')}]`, 'ok').say('Cut the ring after the new tail, and the rotation is done, in two passes at most, no matter how large k is.');
  v.answer(rot(L, K));

  recap(v, [{ name: 'Rotate one step k times', time: 'O(n · k)', space: 'O(1)' }, { name: 'Ring + cut', time: 'O(n)', space: 'O(1)' }], 'Reduce k mod n; close the ring; cut n − k nodes in.', ['Rotation by k → k mod n, then one cut'], 'Always reduce k modulo the length, and think of rotation as re-cutting a ring.');
  return v.build();
}

const problem: Problem = {
  slug: 'rotate-list',
  statement: 'Given the `head` of a linked list, rotate the list to the right by `k` places.',
  examples: [{ input: 'head = [1,2,3,4,5], k = 2', output: '[4,5,1,2,3]' }, { input: 'head = [0,1,2], k = 4', output: '[2,0,1]' }],
  constraints: ['0 ≤ n ≤ 500', '0 ≤ k ≤ 2 · 10⁹'],
  hints: ['Rotating by n does nothing.', 'Link the tail to the head, then cut.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Rotate one step at a time', idea: 'Move the tail to the front, k % n times (k times without the reduction).', time: 'O(n · k)', space: 'O(1)', bottleneck: 'Walks the list per rotation.' },
    { id: 'optimal', kind: 'optimal', name: 'Ring + cut', idea: 'Find n and the tail; k %= n; tail.next = head; the new tail is n − k − 1 steps from head; cut after it.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Empty list or k % n == 0: return head unchanged.'],
  takeaway: 'Rotation = **k mod n**, then **re-cut the ring**.',
  video,
  videoArgs: [L, K],
  judge: {
    type: 'fn', fn: 'rotateRight', params: ['ListNode', 'int'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 3, 4, 5], 2], out: [4, 5, 1, 2, 3] }, { args: [[0, 1, 2], 4], out: [2, 0, 1] }, { args: [[], 3], out: [] }, { args: [[1, 2], 2000000000], out: [1, 2] }],
    gen: (r: Rng) => [r.ints(r.int(0, 8), 0, 9), r.int(0, 20)],
    ref: (a: number[], k: number) => rot(a, k),
  },
};

export default problem;
