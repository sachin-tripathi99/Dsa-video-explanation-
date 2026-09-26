import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

function video() {
  const v = new Video('fast-and-slow-pointers', 'Fast and slow pointers');
  v.chapter('intro', 'Two runners on one track');
  v.text('i', { title: 'Tortoise and hare', lines: ['slow moves 1 step, fast moves 2 steps', 'On a straight track, fast reaches the end when slow is halfway', 'On a circular track, fast laps slow and they meet'], shown: 3 });
  v.say('Two runners start together. One moves one step at a time, the other two. On a straight track, when the fast runner finishes, the slow one is exactly halfway. On a circular track, the fast runner eventually laps the slow one. Those two facts solve a family of linked list problems with no extra memory.');

  v.chapter('middle', 'Finding the middle in one pass', { code: ['slow = fast = head', 'while fast and fast.next:', '  slow = slow.next', '  fast = fast.next.next', 'return slow'] });
  v.clear();
  const M = [1, 2, 3, 4, 5, 6, 7];
  const l = v.list('l', M, { label: 'find the middle without knowing the length' });
  let s = 0;
  let f = 0;
  l.ptr('slow', l.id(0)).ptr('fast', l.id(0));
  v.line(0).say('A linked list does not know its length. Counting and then walking again takes two passes. With two pointers, one pass is enough.');
  while (f + 1 < M.length) {
    s += 1;
    f += 2;
    l.clearTones().ptr('slow', l.id(s)).ptr('fast', f < M.length ? l.id(f) : null).tone(l.id(s), 'active');
    v.line(2, 3).eq(`slow at ${M[s]}, fast at ${f < M.length ? M[f] : 'null'}`).hold(800);
  }
  l.tone(l.id(s), 'ok');
  v.line(4).eq(`fast reached the end → slow = ${M[s]} is the middle`, 'ok').say(`When fast can no longer take two steps, slow has taken exactly half as many. It points at ${words(M[s])}, the middle.`);

  v.chapter('cycle', 'Detecting a cycle', { code: ['slow = fast = head', 'while fast and fast.next:', '  slow = slow.next; fast = fast.next.next', '  if slow is fast: return true', 'return false'] });
  v.clear();
  const C = [3, 2, 0, -4, 7];
  const c = v.list('c', C, { label: 'the tail points back to node 2 → a cycle', showNull: false });
  c.setNext(c.id(4), c.id(1));
  const nxt = (i: number) => (i === 4 ? 1 : i + 1);
  s = 0;
  f = 0;
  c.ptr('slow', c.id(0)).ptr('fast', c.id(0));
  v.say('Now suppose the last node points back into the list, forming a cycle. Walking forever never finds the end. A visited set would detect it, but costs memory. Instead, run the tortoise and the hare.');
  let step = 0;
  do {
    s = nxt(s);
    f = nxt(nxt(f));
    step++;
    c.clearTones().ptr('slow', c.id(s)).ptr('fast', c.id(f)).tone(c.id(s), 'active').tone(c.id(f), s === f ? 'ok' : 'warn');
    v.line(2, 3).counter(`steps: ${step}`).eq(`slow at ${C[s]}, fast at ${C[f]}${s === f ? ' → same node!' : ''}`, s === f ? 'ok' : undefined);
    if (step === 1) v.say('If there is no cycle, fast simply falls off the end. If there is one, both pointers end up going round it.');
    else if (s === f) v.say(`They meet at node ${words(C[s])}. Once both are inside the loop, fast gains exactly one node on slow every step, so the gap closes one by one and they must meet, within one lap.`);
    else v.hold(800);
  } while (s !== f);
  c.tone(c.id(s), 'ok');

  v.chapter('start', 'Where does the cycle start?', { code: ['after they meet: p = head', 'while p is not slow: p = p.next; slow = slow.next', 'return p'] });
  v.clear();
  const c2 = v.list('c', C, { label: 'phase 2', showNull: false });
  c2.setNext(c2.id(4), c2.id(1));
  let p = 0;
  let q = s;
  c2.ptr('p', c2.id(p)).ptr('slow', c2.id(q));
  v.say('A neat fact: the distance from the head to the start of the cycle equals the distance from the meeting point forward to the start of the cycle, modulo the loop length. So reset one pointer to the head and move both one step at a time. They meet exactly at the cycle entrance.');
  while (p !== q) {
    p = nxt(p);
    q = nxt(q);
    c2.clearTones().ptr('p', c2.id(p)).ptr('slow', c2.id(q)).tone(c2.id(p), 'active');
    v.line(1).eq(`p at ${C[p]}, slow at ${C[q]}`).hold(800);
  }
  c2.tone(c2.id(p), 'ok');
  v.line(2).eq(`cycle starts at node ${C[p]}`, 'ok').say(`They meet at ${words(C[p])}, where the cycle begins.`);

  v.chapter('gap', 'A fixed gap: the n-th node from the end', { code: ['fast = head; move fast n steps', 'slow = head', 'move both until fast reaches the end', 'slow is n nodes from the end'] });
  v.clear();
  const G = [1, 2, 3, 4, 5, 6];
  const g = v.list('g', G, { label: 'find the 2nd node from the end' });
  g.ptr('fast', g.id(2)).ptr('slow', g.id(0)).tone(g.id(0), 'active').tone(g.id(2), 'warn');
  v.eq('fast starts 2 nodes ahead').say('A cousin of the same idea: to find the n-th node from the end, start fast n nodes ahead, then move both at the same speed. When fast falls off the end, slow is exactly n nodes behind it.');
  g.clearTones().ptr('fast', null).ptr('slow', g.id(4)).tone(g.id(4), 'ok');
  v.eq('fast = null → slow = 5, the 2nd from the end', 'ok');

  v.chapter('recap', 'Recap');
  v.clear();
  v.table('r', ['Question', 'Pointers'], [
    ['Middle of a list', 'slow +1, fast +2; slow is the middle'],
    ['Is there a cycle?', 'slow +1, fast +2; meeting ⇔ cycle'],
    ['Where does the cycle start?', 'after meeting, restart one at head; step both by 1'],
    ['n-th from the end', 'fast n ahead, then both +1'],
    ['Hidden sequences (happy number, duplicate number)', 'treat f(x) as “next”: Floyd works on any function'],
  ]);
  v.say('Fast and slow pointers find midpoints, cycles, and fixed offsets in one pass with constant memory. And they work on anything that behaves like a linked list, including sequences like x, f of x, f of f of x.');
  return v.build();
}

const body = String.raw`
## The idea

Move two pointers through a sequence at different speeds (usually 1 and 2 steps). Without extra memory you can find the **middle**, detect a **cycle**, and find where the cycle **starts**.

> Real-life picture: two runners on a track. On a straight track the fast one finishes when the slow one is halfway; on a circular track the fast one laps the slow one.

## Middle of a list

\`\`\`java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;            // second middle for even length
\`\`\`

\`\`\`python
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
return slow             # second middle for even length
\`\`\`

\`\`\`cpp
ListNode *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
}
return slow;            // second middle for even length
\`\`\`

## Floyd's cycle detection

Phase 1: move slow by 1 and fast by 2; if they meet, there is a cycle (fast closes the gap by 1 each step, so it cannot jump over slow).

Phase 2: reset one pointer to the head and move both by 1; they meet at the cycle entrance. Why: if the head is \`a\` steps from the entrance and they met \`b\` steps into a loop of length \`L\`, then \`2(a + b) = a + b + kL\`, so \`a = kL − b\`: walking \`a\` steps from the meeting point lands on the entrance.

## Fixed gap

Start \`fast\` \`n\` nodes ahead; when it reaches the end, \`slow\` is \`n\` from the end. A dummy head makes deleting that node easy even when it is the head.

## Beyond linked lists

Anything with a "next" function works: \`x → sum of squared digits\` (Happy Number), \`i → nums[i]\` (Find the Duplicate Number).

## Pitfalls

- Check \`fast && fast.next\` before \`fast.next.next\`.
- Even-length lists have two middles; know which one the problem wants (start fast at \`head.next\` for the first middle).
`;

const lesson: Lesson = {
  slug: 'fast-and-slow-pointers',
  video,
  body,
  quiz: [
    { q: 'Why must fast and slow meet if there is a cycle?', options: ['Luck', 'Inside the loop, fast gains exactly one node per step, so the gap shrinks to zero', 'Fast is faster than light', 'They only meet at the head'], answer: 1, why: 'A gap that shrinks by 1 each step must hit 0.' },
    { q: 'After they meet, how do you find the cycle start?', options: ['Count the loop length only', 'Move one pointer to head; step both by 1 until they meet', 'Reverse the list', 'Use a hash set'], answer: 1, why: 'a = kL − b: both reach the entrance together.' },
    { q: 'Remove the n-th node from the end in one pass:', options: ['Two passes are required', 'Start fast n ahead, then advance both until fast ends', 'Reverse twice', 'Recursion only'], answer: 1, why: 'The fixed gap puts slow right where you need it.' },
    { q: 'Extra space of Floyd’s algorithm?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2, why: 'Just two pointers.' },
  ],
};

export default lesson;
