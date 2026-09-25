import type { Lesson } from '../../types';
import { Video } from '../../helpers';

function video() {
  const v = new Video('stacks', 'Stacks (LIFO)');
  v.chapter('intro', 'A stack of plates');
  v.layout('row');
  const s = v.stack('s', [], { label: 'stack', ends: ['top', ''] });
  v.say('A stack is a pile of plates. You can only put a plate on top, and only take the top plate. The last plate in is the first one out: LIFO.');
  ['A', 'B', 'C'].forEach((x, i) => {
    s.push(x).clearTones().toneTop('active');
    v.eq(`push(${x})`).counter(`size ${i + 1}`);
    if (i === 0) v.say('Push A, then B, then C.');
    else v.hold(600);
  });
  s.clearTones().toneTop('warn');
  v.eq('peek() → C (look without removing)').say('Peek looks at the top without removing it: C.');
  s.pop();
  s.clearTones().toneTop('active');
  v.eq('pop() → C', 'ok').counter('size 2').say('Pop removes the top. C came in last, so it leaves first. Push, pop and peek are all O of one.');

  v.chapter('uses', 'Where stacks appear');
  v.clear();
  v.table('u', ['Real life / software', 'Why a stack'], [
    ['Undo in an editor', 'undo the most recent change first'],
    ['Browser back button', 'go back to the most recently visited page'],
    ['Function calls (call stack)', 'the most recent call finishes first'],
    ['Matching brackets ( [ { } ] )', 'the most recent open bracket must close first'],
    ['Evaluating expressions', 'operands wait for their operator'],
  ]);
  v.say('Stacks appear whenever the most recent unfinished thing must be handled first. Undo, the back button, function calls, and matching brackets.');

  v.chapter('brackets', 'Example: matching brackets', { code: ['for c in s:', '  if c is an opener: push(c)', '  elif stack empty or top does not match c: return false', '  else: pop()', 'return stack is empty'] });
  v.clear().layout('row');
  const str = '([]{})';
  const a = v.array('s', [...str], { label: `"${str}"` });
  const st = v.stack('st', [], { label: 'open brackets', ends: ['top', ''] });
  const match: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  [...str].forEach((c, i) => {
    a.clearTones().ptr('c', i).tone(i, 'active');
    if (!match[c]) {
      st.push(c).clearTones().toneTop('active');
      v.line(1).eq(`${c} opens → push`);
    } else {
      st.clearTones().toneTop('ok');
      v.line(3).eq(`${c} closes top ${st.peek()} ✓ → pop`, 'ok').hold(500);
      st.pop();
      st.clearTones();
    }
    if (i === 0) v.say('Openers wait on the stack. Each closer must match the most recent opener still waiting, which is exactly the top.');
    else v.hold(650);
  });
  a.noPtr().clearTones();
  v.line(4).eq('stack empty → valid', 'ok').say('At the end the stack is empty, so every opener was closed. We will solve this properly as the first homework problem.');

  v.chapter('impl', 'How to use one');
  v.clear();
  v.table('i', ['Language', 'Use', 'push / pop / peek'], [
    ['Java', 'Deque<Integer> st = new ArrayDeque<>()', 'push / pop / peek'],
    ['Python', 'st = [] (a list)', 'append / pop / st[-1]'],
    ['C++', 'stack<int> st', 'push / pop (void) / top'],
  ]);
  v.say('In Java use ArrayDeque, not the old Stack class. In Python a list is a perfect stack. In C plus plus, std stack; note that pop returns nothing, so read top first.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Stacks', lines: ['LIFO: last in, first out', 'push, pop, peek: O(1)', 'Use when the most recent unfinished item decides what happens', 'Brackets, undo, expression parsing, DFS, monotonic stacks'] });
  v.say('Last in, first out, all operations constant time. Later we will meet the monotonic stack, one of the most powerful interview patterns, and it is built on this simple structure.');
  return v.build();
}

const body = String.raw`
## The idea

A **stack** stores items so that the **last one pushed is the first one popped** (LIFO).

> Real-life picture: a stack of plates, the undo button, or the browser's back button.

| Operation | Cost |
|---|---|
| push (add on top) | O(1) |
| pop (remove top) | O(1) |
| peek / top (read top) | O(1) |
| isEmpty, size | O(1) |
| search for a value | O(n) (not what stacks are for) |

## In your language

\`\`\`java
Deque<Integer> st = new ArrayDeque<>();   // prefer this over java.util.Stack
st.push(1);
int top = st.peek();
int x = st.pop();
boolean empty = st.isEmpty();
\`\`\`

\`\`\`python
st = []
st.append(1)          # push
top = st[-1]          # peek
x = st.pop()          # pop
empty = not st
\`\`\`

\`\`\`cpp
stack<int> st;
st.push(1);
int top = st.top();
st.pop();             // returns void: read top() first
bool empty = st.empty();
\`\`\`

## When to reach for a stack

- **Matching / nesting:** brackets, HTML tags, nested encodings like \`3[a2[c]]\` ([Decode String](#/problem/decode-string)).
- **Undo / most recent first:** backspace handling, simplify a file path.
- **Expression evaluation:** reverse Polish notation, calculators.
- **Cancelling neighbours:** remove adjacent duplicates, asteroid collisions.
- **Next greater / smaller element:** the [monotonic stack](#/learn/monotonic-stack) pattern.
- **Iterative DFS:** replace recursion with an explicit stack.

## Designing with stacks

Two classic design questions build new behaviour out of stacks:

- **[Min Stack](#/problem/min-stack):** store the current minimum alongside each element, so \`getMin\` is O(1).
- **[Queue using two stacks](#/problem/implement-queue-using-stacks):** pour an "in" stack into an "out" stack only when "out" is empty: amortised O(1) per operation.

## Pitfalls

- Popping or peeking an empty stack: always check first.
- In C++, \`pop()\` returns nothing.
- Java's legacy \`Stack\` class is synchronised and slower; use \`ArrayDeque\`.
`;

const lesson: Lesson = {
  slug: 'stacks',
  video,
  body,
  quiz: [
    { q: 'Push 1, push 2, push 3, pop, push 4, pop. What is on top now?', options: ['1', '2', '3', '4'], answer: 1, why: 'After popping 3 and then 4, the top is 2.' },
    { q: 'Why is a stack right for matching brackets?', options: ['Brackets are sorted', 'The most recent unmatched opener must be closed first', 'Stacks are faster than arrays', 'Brackets come in pairs'], answer: 1, why: 'Nesting means the latest opener closes first: exactly LIFO.' },
    { q: 'Which Java class should you use as a stack?', options: ['java.util.Stack', 'ArrayDeque', 'LinkedList only', 'TreeSet'], answer: 1, why: 'ArrayDeque is the recommended, faster choice.' },
    { q: 'Cost of push and pop on a stack?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 0, why: 'Both only touch the top.' },
  ],
};

export default lesson;
