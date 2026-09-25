import type { Lesson } from '../../types';
import { Video } from '../../helpers';

function video() {
  const v = new Video('queues', 'Queues and deques');
  v.chapter('intro', 'A queue at a ticket counter');
  const q = v.queue('q', [], { label: 'queue', ends: ['front', 'back'] });
  v.say('A queue is the line at a ticket counter. People join at the back and are served from the front. First in, first out: FIFO.');
  ['Ann', 'Bo', 'Cy'].forEach((x, i) => {
    q.push(x).clearTones().tone(q.size - 1, 'active');
    v.eq(`enqueue(${x}) at the back`);
    if (i === 0) v.say('Ann joins, then Bo, then Cy.');
    else v.hold(550);
  });
  q.clearTones().tone(0, 'ok');
  v.eq('dequeue() → Ann', 'ok').say('The front, Ann, is served first.');
  q.shift();
  v.hold(500);

  v.chapter('why', 'Why not just a list?', { code: ['list.pop(0)  → shifts every element: O(n)'] });
  v.clear();
  const a = v.array('a', ['Bo', 'Cy', 'Di', 'Ed'], { label: 'array-backed list' });
  a.tone(0, 'bad');
  v.line(0).say('If you use a plain array and remove from the front, every remaining element shifts left. That is O of n per dequeue. We need something smarter.');
  a.remove(0).clearTones().toneRange(0, 2, 'warn');
  v.eq('every element moved one slot left', 'bad').hold(800);

  v.chapter('ring', 'Circular buffer: O(1) at both ends', { code: ['enqueue: a[(head + size) % cap] = x; size++', 'dequeue: x = a[head]; head = (head + 1) % cap; size−−'] });
  v.clear();
  const cap = 5;
  const ring = v.array('ring', Array(cap).fill(null), { label: 'fixed array used as a ring (capacity 5)' });
  const vv = v.vars('v', { head: 0, size: 0 });
  let head = 0;
  let size = 0;
  const ops: [string, number?][] = [['e', 1], ['e', 2], ['e', 3], ['d'], ['d'], ['e', 4], ['e', 5], ['e', 6]];
  ops.forEach(([op, x], i) => {
    if (op === 'e') {
      const pos = (head + size) % cap;
      ring.set(pos, x!).clearTones().tone(pos, 'active');
      size++;
      v.line(0).eq(`enqueue ${x} at index (head + size) % 5 = ${pos}`);
    } else {
      ring.clearTones().tone(head, 'bad');
      v.line(1).eq(`dequeue ${ring.get(head)} from head = ${head}`, 'bad').hold(400);
      ring.set(head, null);
      head = (head + 1) % cap;
      size--;
    }
    ring.ptr('head', size ? head : null);
    vv.set({ head, size });
    if (i === 0) v.say('A circular buffer avoids shifting. Keep a head index and a size. New items go at head plus size, wrapping around with modulo.');
    else if (i === 3) v.say('Dequeue just moves head forward. Nothing shifts.');
    else if (i === 7) v.say('And when we reach the end of the array, the next item wraps around to index zero. Both operations are O of one.');
    else v.hold(600);
  });

  v.chapter('deque', 'Deque: a double-ended queue');
  v.clear();
  const d = v.queue('d', [3, 5, 7], { label: 'deque', ends: ['front', 'back'] });
  d.pushFront(1);
  d.clearTones().tone(0, 'active');
  v.eq('pushFront(1)').say('A deque, pronounced "deck", allows adding and removing at both ends in O of one.');
  d.push(9).clearTones().tone(d.size - 1, 'active');
  v.eq('pushBack(9)').hold(600);
  d.pop();
  d.shift();
  d.clearTones();
  v.eq('popBack(), popFront()').say('It can act as a queue, a stack, or both. It is the engine behind breadth-first search and the sliding window maximum.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.table('t', ['Language', 'Queue / deque', 'Operations'], [
    ['Java', 'ArrayDeque<Integer> q', 'offer / poll / peek · offerFirst / pollLast'],
    ['Python', 'collections.deque', 'append / popleft / q[0] · appendleft / pop'],
    ['C++', 'queue<int> / deque<int>', 'push / pop / front · push_front / pop_back'],
  ]);
  v.say('Use ArrayDeque in Java, collections dot deque in Python, and queue or deque in C plus plus. Queues process things in arrival order: tasks, requests, and level by level exploration in BFS.');
  return v.build();
}

const body = String.raw`
## The idea

A **queue** processes items in arrival order: **first in, first out (FIFO)**. Add at the **back** (enqueue), remove from the **front** (dequeue).

> Real-life picture: a line at a ticket counter, a printer's job list, customer-support tickets.

A **deque** (double-ended queue) supports adding and removing at **both** ends.

## Costs

| Operation | Queue / deque |
|---|---|
| enqueue / push back | O(1) |
| dequeue / pop front | O(1) |
| peek front / back | O(1) |
| push front, pop back (deque) | O(1) |
| access by index | O(1) for ring buffers (\`ArrayDeque\` has no index API), O(n) for linked lists |

Never use \`list.pop(0)\` (Python) or \`ArrayList.remove(0)\` (Java) as a queue: they are O(n).

## In your language

\`\`\`java
Deque<Integer> q = new ArrayDeque<>();
q.offer(1);            // enqueue (back)
int front = q.peek();
int x = q.poll();      // dequeue (front), null if empty
q.offerFirst(0);       // deque: add front
q.pollLast();          // deque: remove back
\`\`\`

\`\`\`python
from collections import deque
q = deque()
q.append(1)            # enqueue (back)
front = q[0]
x = q.popleft()        # dequeue (front)
q.appendleft(0)        # add front
q.pop()                # remove back
\`\`\`

\`\`\`cpp
queue<int> q;
q.push(1);             // enqueue
int front = q.front();
q.pop();               // dequeue (returns void)
deque<int> d;
d.push_front(0); d.push_back(2); d.pop_front(); d.pop_back();
\`\`\`

## Circular buffers

A fixed array with a \`head\` index and a \`size\`. Enqueue writes at \`(head + size) % capacity\`; dequeue advances \`head = (head + 1) % capacity\`. Nothing ever shifts. This is how \`ArrayDeque\` works, and it's exactly [Design Circular Queue](#/problem/design-circular-queue).

## When to reach for a queue

- **Arrival order matters:** scheduling, simulations, rate limiting ([Number of Recent Calls](#/problem/number-of-recent-calls)).
- **Breadth-first search:** explore level by level ([Tree BFS](#/learn/tree-bfs), [Graph BFS](#/learn/graph-traversal)).
- **Sliding window with extremes:** a deque keeps window candidates in order ([Monotonic queue](#/learn/monotonic-queue)).
- **Round-robin:** take from the front, do some work, push back if unfinished ([Time Needed to Buy Tickets](#/problem/time-needed-to-buy-tickets)).
`;

const lesson: Lesson = {
  slug: 'queues-and-deques',
  video,
  body,
  quiz: [
    { q: 'enqueue 1, enqueue 2, dequeue, enqueue 3, dequeue. What remains?', options: ['[1]', '[2]', '[3]', '[2, 3]'], answer: 2, why: '1 and then 2 leave from the front; 3 remains.' },
    { q: 'Why is `pop(0)` on a Python list a bad queue?', options: ['It is not allowed', 'It shifts every remaining element: O(n)', 'It removes the last element', 'It sorts the list'], answer: 1, why: 'Use collections.deque for O(1) removal at the front.' },
    { q: 'In a circular buffer with capacity 5, head = 3 and size = 4. Where does the next enqueue go?', options: ['index 7', 'index 2', 'index 0', 'index 4'], answer: 1, why: '(3 + 4) % 5 = 2.' },
    { q: 'Which algorithm is built on a queue?', options: ['Depth-first search', 'Breadth-first search', 'Binary search', 'Quick sort'], answer: 1, why: 'BFS processes nodes in the order they were discovered.' },
  ],
};

export default lesson;
