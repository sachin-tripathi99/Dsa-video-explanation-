import type { Lesson } from '../../types';
import { Video, bullets } from '../../helpers';

function video() {
  const v = new Video('how-to-solve', 'The problem-solving playbook');
  v.chapter('intro', 'The playbook');
  v.text('title', { title: 'How to solve a problem you have never seen', subtitle: 'Six steps. Every video on DryRun follows them.', big: true });
  v.say("Welcome to DryRun. Before any data structure or pattern, let's learn the one process you'll use on every single problem, including ones you've never seen before.");
  v.clear();
  bullets(
    v, 'steps', 'The six steps',
    ['1. **Understand**: restate the problem, ask about edge cases', '2. **Examples**: work 2–3 small inputs by hand', '3. **Brute force**: the simplest thing that works', '4. **Optimise**: find the repeated or wasted work', '5. **Code**: write it cleanly, name things well', '6. **Test**: dry run your code, then edge cases'],
    [
      'Step one: understand. Restate the problem in your own words and ask about anything unclear.',
      'Step two: examples. Work through two or three small inputs by hand. This is where most insights come from.',
      'Step three: brute force. Say the simplest correct solution out loud, even if it is slow.',
      'Step four: optimise. Look for work that is repeated or wasted, and pick a better tool.',
      'Step five: code it, cleanly.',
      'Step six: test. Walk through your own code with an example, like a computer would. That is called a dry run, which is where this platform gets its name.',
    ],
  );

  v.chapter('understand', 'Step 1 · Understand');
  v.clear();
  v.text('prob', { title: 'Contains Duplicate', subtitle: 'Given an array `nums`, return true if any value appears at least twice.', lines: ['Can the array be empty? → yes, return false', 'Negative numbers? → yes, any integers', 'How big? → up to 100,000 numbers', 'Do I return the duplicate, or just true/false? → just true/false'], shown: 0 });
  v.say("Let's practise on a real problem. Contains Duplicate: given an array of numbers, return true if any value appears at least twice.");
  const t = v.text('prob', { title: 'Contains Duplicate', subtitle: 'Given an array `nums`, return true if any value appears at least twice.', lines: ['Can the array be empty? → yes, return false', 'Negative numbers? → yes, any integers', 'How big? → up to 100,000 numbers', 'Do I return the duplicate, or just true/false? → just true/false'], shown: 1 });
  v.say('Before writing anything, ask questions. Can the array be empty? Then the answer is false.');
  t.show(2);
  v.say('Can numbers be negative? Yes. Good to know if we were thinking of using values as indexes.');
  t.show(3).tone(2, 'warn');
  v.note('n ≤ 10⁵ → aim for O(n log n) or better');
  v.say('How big can it get? A hundred thousand numbers. This one matters most: it tells us how fast our solution must be. We will learn exactly how in the time complexity lesson.');
  t.show(4).clearTones();
  v.note('');
  v.say('And what do we return? Just true or false. Now we understand the problem.');

  v.chapter('examples', 'Step 2 · Examples');
  v.clear();
  const a = v.array('ex1', [3, 1, 4, 1, 5], { label: 'example 1' });
  v.eq('expected: true (1 appears twice)', 'ok');
  a.tone([1, 3], 'ok');
  v.say('Example one: three, one, four, one, five. One appears twice, so the answer is true.');
  const b = v.array('ex2', [7, 2, 9], { label: 'example 2' });
  v.eq('expected: false', 'none');
  v.say('Example two: seven, two, nine. All different, so false.');
  v.array('ex3', [], { label: 'edge case: empty' });
  v.eq('edge cases: [], one element, all equal', 'warn');
  v.say('And edge cases: an empty array, a single element, or every element equal. Writing these down now saves you from bugs later.');
  void b;

  v.chapter('brute', 'Step 3 · Brute force', { cx: 'O(n²)', code: ['for i in 0..n-1:', '  for j in i+1..n-1:', '    if a[i] == a[j]: return true', 'return false'] });
  v.clear();
  const arr = [3, 1, 4, 1, 5];
  const x = v.array('nums', arr, { label: 'nums' });
  let checks = 0;
  outer: for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      checks++;
      const same = arr[i] === arr[j];
      x.clearTones().ptrs({ i, j }).tone([i, j], same ? 'ok' : 'cmp');
      v.counter(`checks: ${checks}`).line(same ? 2 : 1).eq(`${arr[i]} ${same ? '==' : '≠'} ${arr[j]}`, same ? 'ok' : 'bad');
      if (checks === 1) v.say('The simplest idea: compare every pair. Fix i, and let j scan everything after it.');
      else if (same) v.say('Three and one are different… and eventually one equals one. True.');
      else v.hold(520);
      if (same) break outer;
    }
  }
  v.note('n = 10⁵ → 5 × 10⁹ checks. Too slow.');
  v.say('It is correct, and saying it out loud shows the interviewer you can solve it. But for a hundred thousand numbers it needs about five billion comparisons. Too slow.');

  v.chapter('optimise', 'Step 4 · Optimise', { cx: 'O(n)', code: ['seen = empty set', 'for x in nums:', '  if x in seen: return true', '  add x to seen', 'return false'] });
  v.clear();
  v.text('q', { title: 'What work is wasted?', lines: ['For every new number we re-scan numbers we already looked at', 'Idea A: sort first, then duplicates sit next to each other → O(n log n)', 'Idea B: remember what we have seen in a hash set → O(n)'], shown: 1 });
  v.say('Now optimise. Ask: what work is wasted? For every number, we re-scan numbers we have already looked at.');
  v.text('q', { title: 'What work is wasted?', lines: ['For every new number we re-scan numbers we already looked at', 'Idea A: sort first, then duplicates sit next to each other → O(n log n)', 'Idea B: remember what we have seen in a hash set → O(n)'], shown: 2 });
  v.say('Idea A: if we sort the array first, equal numbers end up side by side, and one pass finds them.');
  v.text('q', { title: 'What work is wasted?', lines: ['For every new number we re-scan numbers we already looked at', 'Idea A: sort first, then duplicates sit next to each other → O(n log n)', 'Idea B: remember what we have seen in a hash set → O(n)'], shown: 3 });
  v.say('Idea B: remember every number we have seen in a hash set, which answers "have I seen this?" instantly. Let us run idea B.');
  v.clear();
  const y = v.array('nums', arr, { label: 'nums' });
  const seen = v.map('seen', { label: 'seen (hash set)', set: true });
  v.layout('row');
  for (let i = 0; i < arr.length; i++) {
    y.clearTones().ptr('x', i).tone(i, 'active');
    v.counter(`step ${i + 1}`).line(2);
    if (seen.has(arr[i])) {
      y.tone(i, 'ok');
      seen.tone(arr[i], 'ok');
      v.eq(`${arr[i]} is already in seen → true`, 'ok').say('One is already in the set. We found a duplicate in a single pass.');
      break;
    }
    v.eq(`${arr[i]} not in seen → add it`);
    seen.put(arr[i]);
    if (i === 0) v.say('Three is not in the set, so add it.');
    else v.hold(700);
  }
  v.layout('col');
  v.note('O(n) time, O(n) extra space');
  v.say('One pass, so O of n time, at the cost of O of n extra memory for the set. That trade, memory for speed, is one of the most common moves in this whole course.');

  v.chapter('test', 'Steps 5 & 6 · Code and test');
  v.clear();
  bullets(
    v, 'test', 'Dry run, then edge cases',
    ['Trace your code on example 1 → true ✓', 'Example 2 → false ✓', 'Empty array → loop never runs → false ✓', 'All equal [2,2,2] → true at index 1 ✓'],
    [
      'After coding, test it like a computer would. Trace example one: we already did, it returns true.',
      'Example two returns false.',
      'The empty array: the loop never runs, and we return false. Correct.',
      'All equal: we return true at the second element. Our solution handles every edge case we listed in step two.',
    ],
  );

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Understand → Examples → Brute → Optimise → Code → Test', lines: ['Always say the brute force first, with its complexity', 'Optimise by finding repeated or wasted work', 'Constraints tell you how fast you need to be', 'On DryRun: try the problem on LeetCode first, then use hints, then watch the video'] });
  v.say('That is the playbook. Every solution video on DryRun follows it: brute force first, then what is wasted, then a better tool. Next up, we learn how to measure speed properly, with time complexity.');
  return v.build();
}

const body = String.raw`
## Why a process matters

Most people get stuck in interviews not because they don't know enough, but because they freeze, jump straight to code, and get lost. A fixed process gives you something to do in every minute of the interview, and it shows the interviewer exactly how you think.

## The six steps

### 1. Understand the problem
Restate it in your own words. Then ask about anything the statement leaves open:

- **Input:** can it be empty? Negative numbers? Duplicates? Is it sorted?
- **Size:** how large can \`n\` be? This decides the complexity you must hit (see the [time complexity lesson](#/lesson/time-complexity)).
- **Output:** return a value, an index, a list? Any order? What if there's no answer?

### 2. Work examples by hand
Take 2–3 small inputs and solve them on paper. Include at least one **edge case** (empty, single element, all equal, already sorted). Watching yourself solve the example is where most algorithm ideas come from.

### 3. State a brute force
Say the simplest correct solution and its cost, even if it's slow: *"I could check every pair, that's O(n²)."* It proves you understand the problem and gives you something to improve.

### 4. Optimise
Ask these questions, in this order:

1. **What work is repeated?** Maybe we recompute the same sum or re-scan the same elements.
2. **What does the input give me for free?** Sorted order, small value ranges, a tree shape.
3. **Which tool removes the waste?** A hash map for "have I seen this?", two pointers for sorted pairs, a heap for "best so far", and so on. The rest of this course teaches these tools one by one.
4. **What's the trade-off?** Faster usually costs memory. Say it out loud.

### 5. Code
Write clean code with clear names. Talk while you type. Handle edge cases explicitly rather than hoping they work.

### 6. Test with a dry run
Trace your code line by line on a small example, tracking variable values the way the videos here do. Then run your edge cases. Fix bugs calmly; finding your own bug is a good signal, not a bad one.

## The example from the video

**Contains Duplicate:** return \`true\` if any value appears at least twice.

\`\`\`java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (seen.contains(x)) return true; // seen before: duplicate
            seen.add(x);
        }
        return false;
    }
}
\`\`\`

\`\`\`python
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()
        for x in nums:
            if x in seen:        # seen before: duplicate
                return True
            seen.add(x)
        return False
\`\`\`

\`\`\`cpp
class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int x : nums) {
            if (seen.count(x)) return true; // seen before: duplicate
            seen.insert(x);
        }
        return false;
    }
};
\`\`\`

| Approach | Time | Extra space |
|---|---|---|
| Compare every pair | O(n²) | O(1) |
| Sort, then compare neighbours | O(n log n) | O(1) or O(n) depending on the sort |
| Hash set of seen values | O(n) | O(n) |

## How to use DryRun

1. Watch the **concept video** for a module and read its notes.
2. Open a homework problem and **try it on LeetCode first**, for 20–30 minutes.
3. Stuck? Reveal the **hints** one at a time.
4. Watch the **solution video**: brute force, then better, then optimal, with the reason for each step.
5. Re-code the optimal solution from memory the next day. Star problems you struggled with and redo them in revision weeks.

> Tip: keep a notebook (or use the notes box on every problem) with one line per problem: *the insight that cracked it*. Before interviews, reread only those lines.
`;

const lesson: Lesson = {
  slug: 'how-to-solve',
  video,
  body,
  quiz: [
    { q: 'What should you do **before** writing any code?', options: ['Pick the fastest algorithm you know', 'Restate the problem, ask about edge cases and work a few examples', 'Start typing a brute force immediately', 'Ask for the answer'], answer: 1, why: 'Understanding the problem and working examples by hand prevents wrong turns and often reveals the idea.' },
    { q: 'Why state a brute-force solution even if it is slow?', options: ['Interviewers only want brute force', 'It shows you understand the problem and gives a baseline to optimise', 'It is always accepted', 'It uses less memory'], answer: 1, why: 'A correct slow solution proves understanding and makes the waste visible, which you then remove.' },
    { q: 'In Contains Duplicate, the hash set solution trades…', options: ['time for memory: O(n) time, O(n) space', 'memory for time: O(n²) time, O(1) space', 'nothing: it is strictly better in every way', 'correctness for speed'], answer: 0, why: 'We use O(n) extra memory to get O(n) time. Say trade-offs like this out loud.' },
    { q: 'Which input detail most directly tells you how fast your solution must be?', options: ['The variable names', 'The constraint on n (input size)', 'Whether the problem is Easy or Medium', 'The programming language'], answer: 1, why: 'n ≤ 10⁵ usually means O(n log n) or better; n ≤ 20 allows exponential solutions.' },
  ],
};

export default lesson;
