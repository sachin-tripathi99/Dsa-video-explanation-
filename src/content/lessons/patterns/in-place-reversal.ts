import type { Lesson } from '../../types';
import { Video } from '../../helpers';
import { animateReverse } from '../../listviz';

function video() {
  const v = new Video('in-place-reversal', 'In-place linked list reversal');
  v.chapter('intro', 'Turning the arrows around');
  v.list('l', [1, 2, 3, 4, 5], { label: 'reverse this list without creating nodes' });
  v.say('Reversing a linked list does not move any values. It turns every arrow around. The trick is to never lose the rest of the list while you flip one pointer, and that takes exactly three pointers.');

  v.chapter('three', 'prev, cur, next', { code: ['prev = null; cur = head', 'while cur:', '  next = cur.next      # remember the rest', '  cur.next = prev      # flip the arrow', '  prev = cur; cur = next', 'return prev           # new head'] });
  v.clear();
  const l = v.list('l', [1, 2, 3, 4, 5], { label: 'head' });
  v.say('Keep prev, the already reversed part, cur, the node being flipped, and next, the rest of the list. Save next first, then point cur back at prev, then step both forward.');
  animateReverse(v, l, l.ids(), { line: [2, 3, 4], firstSay: 'Cur is one. Save next, two. Point one back at prev, which is null: one becomes the new tail. Then prev becomes one and cur becomes two.' });
  l.ptr('head', l.ids()[0]);
  v.line(5).eq('prev is the new head: 5 → 4 → 3 → 2 → 1', 'ok').say('When cur runs off the end, prev is sitting on the old tail, which is the new head. Linear time, constant extra space.');

  v.chapter('sub', 'Reversing just a part', { code: ['walk to before = node before position left', 'reverse the nodes left..right with prev = the node after them', 'before.next = the old right node'] });
  v.clear();
  const s = v.list('s', [1, 2, 3, 4, 5, 6], { label: 'reverse positions 2..5' });
  const ids = s.ids();
  s.tone(ids[0], 'cmp').tone(ids[5], 'cmp');
  v.eq('keep 1 and 6 fixed: they reconnect the reversed piece').say('Often only a piece must be reversed. Remember the node just before the piece and the node just after it. Reverse the piece with prev starting at the node after it, so the piece’s first node ends up pointing outwards correctly, then connect the node before to the piece’s new front.');
  animateReverse(v, s, ids.slice(1, 5), { before: ids[0], after: ids[5], line: [1], perStep: 650 });
  s.tone(ids[0], 'cmp').tone(ids[5], 'cmp');
  v.line(2).eq('1 → 5 → 4 → 3 → 2 → 6', 'ok').say('The piece is reversed and stitched back in. A dummy node in front makes this work even when the piece starts at the head.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.table('r', ['Problem', 'Idea'], [
    ['Reverse a list', 'prev / cur / next, return prev'],
    ['Reverse a sublist', 'remember before and after; reverse; reconnect'],
    ['Reverse in groups of k', 'repeat the sublist reversal every k nodes'],
    ['Swap pairs', 'groups of 2'],
    ['Palindrome / twin sums / reorder', 'find middle, reverse second half'],
  ]);
  v.say('Three pointers reverse any chain. Everything else is bookkeeping: remembering the neighbours of the piece you reverse, and using a dummy head so the head is not a special case.');
  return v.build();
}

const body = String.raw`
## The idea

Reversal flips every \`next\` pointer. To avoid losing the rest of the list, keep three pointers: \`prev\` (reversed part), \`cur\` (node being flipped) and \`next\` (the rest).

> Real-life picture: a conga line where everyone turns around. Before letting go of the person in front, you must know who they are, or the rest of the line is lost.

\`\`\`java
ListNode prev = null, cur = head;
while (cur != null) {
    ListNode next = cur.next;   // remember the rest
    cur.next = prev;            // flip
    prev = cur;
    cur = next;
}
return prev;                    // new head
\`\`\`

\`\`\`python
prev, cur = None, head
while cur:
    nxt = cur.next              # remember the rest
    cur.next = prev             # flip
    prev, cur = cur, nxt
return prev                     # new head
\`\`\`

\`\`\`cpp
ListNode *prev = nullptr, *cur = head;
while (cur) {
    ListNode* next = cur->next; // remember the rest
    cur->next = prev;           // flip
    prev = cur;
    cur = next;
}
return prev;                    // new head
\`\`\`

## Recursive version

\`reverse(head)\`: if \`head\` or \`head.next\` is null return \`head\`; \`newHead = reverse(head.next)\`; \`head.next.next = head\`; \`head.next = null\`; return \`newHead\`. Elegant, but uses O(n) stack.

## Reversing a sublist

1. Use a dummy node; walk \`before\` to the node just before the piece.
2. Reverse the piece, starting with \`prev = node after the piece\`.
3. \`before.next = old last node of the piece\`.

## Pitfalls

- Losing the rest of the list by flipping before saving \`next\`.
- Forgetting that the old head's \`next\` must become \`null\` (or the node after the piece), otherwise you create a cycle.
- Returning \`head\` instead of \`prev\`.
`;

const lesson: Lesson = {
  slug: 'in-place-reversal',
  video,
  body,
  quiz: [
    { q: 'Why save next before flipping cur.next?', options: ['Style', 'After flipping, cur.next no longer leads to the rest of the list', 'To save memory', 'For recursion'], answer: 1, why: 'The only link to the remaining nodes would be lost.' },
    { q: 'After the loop, which pointer is the new head?', options: ['head', 'cur', 'prev', 'next'], answer: 2, why: 'cur is null; prev stopped on the old tail.' },
    { q: 'Space of the iterative reversal?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], answer: 1, why: 'Three pointers.' },
    { q: 'Reversing positions left..right: what should prev start as?', options: ['null', 'the node after the piece', 'head', 'the dummy'], answer: 1, why: 'Then the piece’s first node ends up pointing to the remainder.' },
  ],
};

export default lesson;
