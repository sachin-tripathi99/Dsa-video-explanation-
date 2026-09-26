import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

function video() {
  const v = new Video('stack-patterns', 'Stack patterns');
  v.chapter('intro', 'When the most recent thing matters most');
  v.text('i', { title: 'A stack remembers what is still “open”', lines: ['matching pairs: brackets, tags, cancelling neighbours', 'nesting: 3[a2[c]], directories, function calls', 'evaluation: expressions with precedence and parentheses', 'simulation: collisions that can cascade backwards'], shown: 4 });
  v.say('The stacks lesson showed push and pop. This pattern module is about recognising when a stack is the right tool: whenever the newest unfinished thing must be dealt with first. Matching pairs, nested structures, expression evaluation, and collisions that cascade backwards.');

  v.chapter('cancel', 'Pattern 1: cancel with the top', { code: ['for c in s:', '  if stack and stack.top cancels c: pop', '  else: push c'] });
  v.clear();
  const S = 'abbaca';
  const a = v.array('s', S.split(''), { label: 'remove adjacent equal pairs, repeatedly' });
  const st = v.stack('st', [], { label: 'stack = the string built so far' });
  const cur: string[] = [];
  let told = 0;
  v.say('Remove adjacent equal letters, again and again, until none are left. Deleting from the middle of a string is slow, but a stack does it in one pass: the top of the stack is the letter just before the current one.');
  S.split('').forEach((c, i) => {
    a.clearTones().tone(i, 'active');
    if (cur.length && cur[cur.length - 1] === c) {
      cur.pop();
      st.pop();
      a.tone(i, 'bad');
      v.line(1).eq(`'${c}' equals the top → both vanish`, 'bad');
      if (told === 0) { v.say(`The second b meets the b on top. They cancel: pop, and do not push. Now the top is a again, which will meet the next a, so the cancellation can cascade.`); told++; }
      else v.hold(600);
    } else {
      cur.push(c);
      st.push(c);
      v.line(2).eq(`push '${c}'`).hold(450);
    }
  });
  a.clearTones();
  v.eq(`result "${cur.join('')}"`, 'ok').say(`What remains on the stack, read bottom to top, is the answer: ${cur.join(', ')}.`);

  v.chapter('nest', 'Pattern 2: save the outer context', { code: ['on "[": push (current string, repeat count); start fresh', 'on "]": pop (prev, k); current = prev + current × k'] });
  v.clear();
  v.text('d', { title: '3[a2[c]]', lines: ['see 3[ → save ("", 3), start a new inner string', 'see a → inner = "a"', 'see 2[ → save ("a", 2), start fresh', 'see c → inner = "c"', 'see ] → pop ("a", 2): inner = "a" + "cc" = "acc"', 'see ] → pop ("", 3): result = "" + "acc" × 3'], shown: 6 });
  v.say('For nested structures, push the outer context when you go one level deeper, and pop it when the inner level closes. Decoding three of a, two of c: the stack holds the half-built outer strings and their repeat counts, exactly like a call stack holds the caller’s local variables.');

  v.chapter('expr', 'Pattern 3: evaluate as you go', { code: ['for each number with the operator before it:', '  + → push n;  − → push −n', '  × or ÷ → apply to the top right away', 'answer = sum(stack)'] });
  v.clear();
  const E = ['3', '+', '2', '*', '2', '-', '4'];
  v.array('e', E, { label: '3 + 2 × 2 − 4' });
  const es = v.stack('es', [], { label: 'pending terms' });
  v.say('Multiplication binds tighter than addition. So keep a stack of terms still waiting to be added. A plus pushes the next number, a minus pushes its negative, but times and divide immediately combine with the top.');
  es.push(3);
  v.line(1).eq('push 3').hold(500);
  es.push(2);
  v.line(1).eq('+ 2 → push 2').hold(500);
  es.pop();
  es.push(4);
  v.line(2).eq('× 2 → top becomes 2 × 2 = 4', 'warn').say('Times two pops the two and pushes four.');
  es.push(-4);
  v.line(1).eq('− 4 → push −4').hold(500);
  v.line(3).eq('3 + 4 + (−4) = 3', 'ok').say('At the end, add up the stack: three plus four minus four, three.');

  v.chapter('recap', 'Recognising the pattern');
  v.clear();
  v.table('r', ['Signal', 'What goes on the stack'], [
    ['Adjacent things cancel', 'the surviving characters'],
    ['Brackets must match / be removed', 'indices of unmatched open brackets'],
    ['Nested repetition or paths', 'the outer context (string, count, folder)'],
    ['Expressions with precedence', 'pending terms (or numbers and operators)'],
    ['Things collide and may cascade', 'survivors that can still be hit'],
  ]);
  v.say('Whenever the latest open item must be resolved before older ones, reach for a stack. Decide what exactly you push: characters, indices, contexts, or partial results.');
  return v.build();
}

const body = String.raw`
## The idea

A stack keeps the **most recent unfinished item** on top. Use it when new input must be matched against, combined with, or cancelled by the latest earlier item.

> Real-life picture: a stack of trays, or browser back-navigation. You always deal with the top first.

## Pattern 1: cancel with the top

\`\`\`python
st = []
for c in s:
    if st and cancels(st[-1], c):
        st.pop()
    else:
        st.append(c)
\`\`\`

Examples: remove adjacent duplicates, valid parentheses, asteroid collisions (with a loop, since one asteroid can destroy several).

## Pattern 2: push the outer context

Nested structure like \`3[a2[c]]\`: on \`[\` push \`(current string, repeat)\` and start fresh; on \`]\` pop and combine. Directory paths (\`..\` pops a folder) are the same idea.

## Pattern 3: evaluate with precedence

For \`+ − × ÷\` without parentheses keep a stack of terms: push \`±n\`, apply \`× ÷\` to the top immediately, sum at the end. With parentheses, push the current (result, sign) on \`(\` and pop on \`)\`.

\`\`\`java
Deque<Integer> st = new ArrayDeque<>();
int num = 0; char op = '+';
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    if (Character.isDigit(c)) num = num * 10 + (c - '0');
    if ((!Character.isDigit(c) && c != ' ') || i == s.length() - 1) {
        if (op == '+') st.push(num);
        else if (op == '-') st.push(-num);
        else if (op == '*') st.push(st.pop() * num);
        else st.push(st.pop() / num);
        op = c; num = 0;
    }
}
int ans = 0; for (int x : st) ans += x;
\`\`\`

## Pattern 4: stack of indices

Store positions instead of characters when you need lengths or removals: unmatched \`(\` indices for "minimum remove", or a base index for "longest valid parentheses".

## Tips

- In Java use \`ArrayDeque\` (not \`Stack\`); in Python a \`list\`; in C++ \`std::stack\` or a \`vector\`.
- Build strings from a stack with a join at the end, not repeated concatenation.
`;

const lesson: Lesson = {
  slug: 'stack-patterns',
  video,
  body,
  quiz: [
    { q: 'Removing adjacent duplicates repeatedly ("abbaca" → "ca") is best done with…', options: ['Repeated string scans', 'A stack in one pass', 'Sorting', 'A queue'], answer: 1, why: 'The top is always the character just before the current one, so cascades happen naturally.' },
    { q: 'In 3 + 2 × 2, when do you apply × 2?', options: ['At the end', 'Immediately, to the top of the stack', 'Never', 'Before reading 3'], answer: 1, why: '× binds tighter, so it combines with the last term right away.' },
    { q: 'For “minimum remove to make parentheses valid”, the stack should hold…', options: ['characters', 'indices of unmatched "("', 'counts', 'nothing'], answer: 1, why: 'Indices tell you exactly which characters to delete.' },
    { q: 'Which Java class should you use as a stack?', options: ['Stack', 'ArrayDeque', 'LinkedList only', 'PriorityQueue'], answer: 1, why: 'ArrayDeque is faster and not synchronized.' },
  ],
};

export default lesson;
