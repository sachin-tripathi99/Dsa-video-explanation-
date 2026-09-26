import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const L = [3, 2, 0, -4, 5, 8];
const POS = 2;

function video() {
  const v = new Video('linked-list-cycle-ii', 'Linked List Cycle II');
  const n = L.length;
  const nxt = (i: number) => (i + 1 < n ? i + 1 : POS);
  v.chapter('intro', 'The problem');
  const l0 = v.list('l', L, { label: `the tail links back to index ${POS}`, showNull: false });
  l0.setNext(l0.id(n - 1), l0.id(POS)).tone(l0.id(POS), 'ok');
  v.say('Return the node where the cycle begins, or null if there is no cycle. Here the cycle starts at the node with value zero.');

  v.chapter('brute', 'Brute force: first node seen twice', { cx: 'O(n) · O(n) space', code: ['seen = set()', 'for node along next: if node in seen: return node; seen.add(node)'] });
  v.eq('the first repeated node is the entrance, but a set costs O(n)', 'warn').say('Walking and storing nodes, the first node you meet again is the entrance. That needs a hash set.');

  v.chapter('optimal', "Optimal: Floyd's two phases", { cx: 'O(n) · O(1)', code: ['phase 1: slow +1, fast +2 until they meet (or fast hits null)', 'phase 2: p = head', 'while p is not slow: p = p.next; slow = slow.next', 'return p'] });
  v.clear();
  const l = v.list('l', L, { label: 'head', showNull: false });
  l.setNext(l.id(n - 1), l.id(POS));
  let s = 0;
  let f = 0;
  l.ptr('slow', l.id(0)).ptr('fast', l.id(0));
  v.say('Phase one is ordinary cycle detection.');
  do {
    s = nxt(s);
    f = nxt(nxt(f));
    l.clearTones().ptr('slow', l.id(s)).ptr('fast', l.id(f)).tone(l.id(s), s === f ? 'warn' : 'active');
    v.line(0).eq(`slow at ${L[s]}, fast at ${L[f]}${s === f ? ' → meet' : ''}`).hold(700);
  } while (s !== f);
  const a = POS;
  v.say(`They meet at ${words(L[s])}. Now the key fact: the head is ${words(a)} steps from the entrance, and walking ${words(a)} steps from the meeting point also lands on the entrance, possibly after extra laps. So start p at the head and move p and slow together, one step each.`);
  let p = 0;
  l.noPtr('fast').ptr('p', l.id(0));
  while (p !== s) {
    p = nxt(p);
    s = nxt(s);
    l.clearTones().ptr('p', l.id(p)).ptr('slow', l.id(s)).tone(l.id(p), 'active');
    v.line(2).eq(`p at ${L[p]}, slow at ${L[s]}${p === s ? ' → meet' : ''}`).hold(700);
  }
  l.tone(l.id(p), 'ok');
  v.line(3).eq(`cycle starts at index ${p} (value ${L[p]})`, 'ok').say(`They meet at ${words(L[p])}, the entrance of the cycle.`);
  v.answer(POS);

  recap(v, [{ name: 'Hash set', time: 'O(n)', space: 'O(n)' }, { name: "Floyd's two phases", time: 'O(n)', space: 'O(1)' }], 'Head-to-entrance distance = meeting-point-to-entrance distance (mod loop).', ['Cycle entrance → Floyd phase 2'], 'Phase two of Floyd’s algorithm turns a meeting point into the cycle’s entrance.');
  return v.build();
}

const problem: Problem = {
  slug: 'linked-list-cycle-ii',
  statement: 'Given the `head` of a linked list, return the node where the cycle begins. If there is no cycle, return `null`. Do not modify the list.',
  examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'node at index 1' }, { input: 'head = [1,2], pos = 0', output: 'node at index 0' }, { input: 'head = [1], pos = -1', output: 'no cycle' }],
  constraints: ['0 ≤ n ≤ 10⁴'],
  hints: ['First detect the cycle with fast/slow.', 'Then restart one pointer from the head.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Hash set', idea: 'Return the first node that appears twice.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra memory.' },
    { id: 'optimal', kind: 'optimal', name: "Floyd's two phases", idea: 'Meet inside the cycle; then step a head pointer and the meeting pointer together until they meet.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Floyd phase 2: **restart one pointer at head**, meet at the entrance.',
  video,
  videoArgs: [[L, POS]],
  judge: {
    type: 'fn', fn: 'detectCycle', params: ['ListNode@cycle'], ret: 'ListNode@ref',
    tests: [{ args: [[[3, 2, 0, -4], 1]], out: 1 }, { args: [[[1, 2], 0]], out: 0 }, { args: [[[1], -1]], out: -1 }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 8), -5, 5); return [[a, r.chance(0.6) ? r.int(0, a.length - 1) : -1]]; },
    ref: (x: [number[], number]) => x[1],
  },
};

export default problem;
