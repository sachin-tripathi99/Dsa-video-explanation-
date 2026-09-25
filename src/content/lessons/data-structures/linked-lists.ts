import type { Lesson } from '../../types';
import { Video } from '../../helpers';

function video() {
  const v = new Video('linked-lists', 'Linked lists');
  v.chapter('intro', 'A train of carriages');
  const l = v.list('l', [3, 8, 5, 1], { label: 'a singly linked list', prefix: 'n' });
  l.ptr('head', 'n0');
  v.say('A linked list is like a train. Each carriage, a node, holds a value and a coupling to the next carriage. The first node is the head. The last one points to null.');
  v.eq('node = { value, next }');
  v.say('Unlike an array, the nodes do not sit side by side in memory. Each one only knows where the next one is.');

  v.chapter('traverse', 'Walking the list: O(n)', { code: ['cur = head', 'while cur != null:', '  visit(cur.val)', '  cur = cur.next'] });
  const ids = l.ids();
  for (let i = 0; i <= ids.length; i++) {
    const id = i < ids.length ? ids[i] : null;
    l.clearTones().ptr('cur', id);
    if (id) l.tone(id, 'active');
    for (let k = 0; k < i; k++) l.tone(ids[k], 'done');
    v.line(id ? 2 : 1).counter(`steps: ${i}`);
    if (i === 0) v.say('To reach anything, start at the head and follow next pointers one by one.');
    else if (i === ids.length) v.eq('cur = null → stop').say('When cur becomes null, we have walked off the end. There is no index: getting to the k-th node takes k steps, so access is O of n.');
    else v.hold(550);
  }
  l.noPtr('cur').clearTones();

  v.chapter('insert', 'Insert after a node: O(1)', { code: ['node = new Node(7)', 'node.next = prev.next', 'prev.next = node'] });
  l.ptr('prev', 'n1').tone('n1', 'active');
  v.line(0).say('Now the superpower. To insert seven after the node with eight, create the new node…');
  l.add('x', 7, 2, 'n2').tone('x', 'ok');
  l.setNext('n1', 'n1');
  l.setNext('n1', 'n2');
  v.line(1).eq('new.next = prev.next (points at 5)').say('…point it at eight’s next node, five…');
  l.setNext('n1', 'x');
  v.line(2).eq('prev.next = new').say('…then point eight at the new node. Two pointer changes, no shifting: O of one, once you are at the right place.');
  l.clearTones().noPtr('prev');

  v.chapter('delete', 'Delete: bypass the node', { code: ['prev.next = prev.next.next'] });
  l.ptr('prev', 'x').tone('x', 'active').tone('n2', 'bad');
  v.line(0).say('Deleting is even simpler: make the previous node skip over the one we remove.');
  l.setNext('x', 'n3');
  v.eq('7.next = 1 (5 is bypassed)', 'warn').hold(900);
  l.removeNode('n2');
  l.clearTones().noPtr('prev');
  v.say('Nothing points to five any more, so it is gone. Also O of one.');

  v.chapter('dummy', 'The dummy node trick', { code: ['dummy = Node(0, head)', 'prev = dummy', '… edit the list …', 'return dummy.next'] });
  v.clear();
  const d = v.list('d', [0, 3, 8], { label: 'dummy → list', prefix: 'd' });
  d.setVal('d0', 'D').tone('d0', 'pivot').ptr('dummy', 'd0').ptr('head', 'd1');
  v.line(0).say('Operations on the head are special cases: deleting the head, or inserting before it. A dummy node placed in front of the head removes those special cases.');
  d.setNext('d0', 'd2').tone('d1', 'bad');
  v.line(2).eq('delete the old head = dummy.next = head.next');
  v.say('Now deleting the head is just "dummy dot next equals head dot next", exactly like any other node. At the end, return dummy dot next. You will use this trick constantly.');

  v.chapter('recap', 'Arrays vs linked lists');
  v.clear();
  v.table('cmp', ['Operation', 'Array', 'Linked list'], [
    ['Access k-th element', 'O(1)', 'O(k)'],
    ['Insert / delete at front', 'O(n)', 'O(1)'],
    ['Insert / delete after a known node', 'O(n)', 'O(1)'],
    ['Search by value', 'O(n)', 'O(n)'],
    ['Memory', 'compact', 'extra pointer per node'],
  ]);
  v.say('Arrays win at random access. Linked lists win at inserting and deleting once you are at the right spot. In interviews, list problems are mostly about careful pointer surgery. Draw the boxes and arrows, just like here, before you code.');
  return v.build();
}

const body = String.raw`
## The idea

A **linked list** is a chain of **nodes**. Each node stores a value and a pointer to the next node. The first node is the **head**; the last node's \`next\` is \`null\`.

> Real-life picture: a train. Each carriage is coupled to the next. To reach carriage 10 you walk through carriages 1–9, but adding or removing a carriage only means changing two couplings.

\`\`\`java
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
\`\`\`

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
\`\`\`

\`\`\`cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* n) : val(x), next(n) {}
};
\`\`\`

## Core operations

\`\`\`java
// traverse
for (ListNode cur = head; cur != null; cur = cur.next) { /* use cur.val */ }

// insert x after node prev
prev.next = new ListNode(x, prev.next);

// delete the node after prev
prev.next = prev.next.next;

// dummy node: no special case for the head
ListNode dummy = new ListNode(0, head);
ListNode prev = dummy;
// ... edit ...
return dummy.next;
\`\`\`

\`\`\`python
cur = head
while cur:                      # traverse
    cur = cur.next

prev.next = ListNode(x, prev.next)   # insert after prev
prev.next = prev.next.next           # delete after prev

dummy = ListNode(0, head)            # dummy node
prev = dummy
# ... edit ...
return dummy.next
\`\`\`

\`\`\`cpp
for (ListNode* cur = head; cur; cur = cur->next) { /* use cur->val */ }
prev->next = new ListNode(x, prev->next);   // insert after prev
prev->next = prev->next->next;              // delete after prev (free it in real code)
ListNode dummy(0, head);                    // dummy node on the stack
ListNode* p = &dummy;
return dummy.next;
\`\`\`

## Costs

| Operation | Singly linked list |
|---|---|
| Access k-th node | O(k) |
| Insert/delete at head | O(1) |
| Insert/delete after a known node | O(1) |
| Insert at tail | O(n), or O(1) if you keep a tail pointer |
| Search | O(n) |

A **doubly linked list** also stores \`prev\`, so a node can be removed in O(1) given only the node itself. It powers [LRU Cache](#/problem/lru-cache). Java's \`LinkedList\`, Python's \`collections.deque\` and C++'s \`std::list\` are doubly linked.

## Techniques you will use again and again

1. **Dummy (sentinel) head**: removes edge cases when the head might change.
2. **Two pointers at different speeds**: find the middle, detect cycles ([Fast and slow pointers](#/learn/fast-slow-pointers)).
3. **Gap of k between two pointers**: find the k-th node from the end.
4. **Reversal with prev / cur / next**: [In-place reversal](#/learn/linked-list-reversal).
5. **Splicing**: build a new order by re-pointing \`next\` rather than creating nodes (merge, partition, odd-even).

## Pitfalls

- **Losing the rest of the list:** save \`cur.next\` before you overwrite it.
- **Null pointer errors:** check \`cur != null\` (and \`cur.next != null\` when you read two ahead).
- **Forgetting to terminate:** the new tail's \`next\` must be \`null\`, or you create a cycle.
- Draw boxes and arrows for a 3-node example before coding. Every time.
`;

const lesson: Lesson = {
  slug: 'linked-lists',
  video,
  body,
  quiz: [
    { q: 'Getting the k-th node of a singly linked list costs…', options: ['O(1)', 'O(log k)', 'O(k)', 'O(n²)'], answer: 2, why: 'You must follow k next pointers from the head.' },
    { q: 'Inserting a node right after a node you already hold costs…', options: ['O(1)', 'O(n)', 'O(log n)', 'depends on the value'], answer: 0, why: 'Two pointer updates, no shifting.' },
    { q: 'What problem does a dummy head node solve?', options: ['It makes the list sorted', 'It removes special cases when the real head is removed or replaced', 'It makes access O(1)', 'It prevents cycles'], answer: 1, why: 'Every real node, including the head, now has a previous node.' },
    { q: 'Before setting `cur.next = prev` while reversing, you must…', options: ['free cur', 'save cur.next, or you lose the rest of the list', 'sort the list', 'nothing'], answer: 1, why: 'Overwriting next without saving it disconnects the remaining nodes.' },
  ],
};

export default lesson;
