import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const N = [1, 2, 3];

function video() {
  const v = new Video('backtracking', 'Backtracking: choose, explore, un-choose');
  v.chapter('intro', 'Building answers one choice at a time');
  v.text('t', { title: 'Backtracking', lines: ['Build a candidate step by step', 'At each step: CHOOSE an option, EXPLORE further, UN-CHOOSE it', 'Stop early when the partial candidate can no longer work (pruning)'], shown: 3 });
  v.say('Many problems ask for all arrangements: all subsets, all permutations, all ways to place queens. Backtracking builds each answer one choice at a time. Choose something, explore what follows from it, then undo the choice and try the next option. It is depth-first search over a tree of decisions.');

  v.chapter('tree', 'The decision tree for subsets of [1, 2, 3]', { code: ['def go(i, path):', '  if i == n: record path; return', '  path.append(nums[i]); go(i + 1, path)   # choose', '  path.pop()                               # un-choose', '  go(i + 1, path)                          # skip'] });
  v.clear();
  const d = decisionTree(v, 't', 'each level decides one number: take it (+) or skip it (−)');
  const path: number[] = [];
  let found = 0;
  let told = 0;
  const go = (i: number, edge?: string) => {
    const nid = d.enter(`[${path.join(',')}]`, edge);
    if (i === N.length) {
      d.mark(nid, 'ok');
      found++;
      v.line(1).counter(`subsets: ${found}`).eq(`leaf → record [${path.join(', ')}]`, 'ok');
      if (told === 1) { v.say(`We have decided all three numbers: take, take, take. Record [1, 2, 3].`); told++; }
      else if (told === 2) { v.say('Back up one level: un-choose three, and take the other branch, skipping it. Record [1, 2]. This undo step is the “back” in backtracking.'); told++; }
      else v.hold(500);
      d.leave();
      return;
    }
    if (told === 0 && i === 0) { v.line(0).say('The root is the empty subset. Each level of the tree decides one number: take it, or skip it.'); told++; } else v.line(2).hold(450);
    path.push(N[i]);
    go(i + 1, `+${N[i]}`);
    path.pop();
    v.line(3).hold(300);
    go(i + 1, `−${N[i]}`);
    d.leave();
  };
  go(0);
  v.line(4).eq(`${found} subsets = 2³ leaves · O(n · 2ⁿ)`, 'ok').say(`Eight leaves, one for each subset. The work is proportional to the size of the output, n times two to the n, and no algorithm can list the answers faster than that.`);

  v.chapter('template', 'The template');
  v.clear();
  v.text('tpl', { title: 'Every backtracking solution', mono: true, lines: ['def backtrack(state):', '    if state is a complete answer: record a copy; return', '    for choice in options(state):', '        if choice is not valid: continue      # prune', '        apply(choice)                          # choose', '        backtrack(state)                       # explore', '        undo(choice)                           # un-choose'], shown: 7 });
  v.say('Every backtracking solution has the same skeleton. If the state is complete, record a copy of it. Otherwise loop over the options, skip invalid ones, apply the choice, recurse, and undo the choice. Record a copy, because the path keeps changing after you record it.');

  v.chapter('prune', 'Pruning: cut dead branches early');
  v.clear();
  v.table('p', ['Problem', 'Prune when…'], [
    ['Combination Sum', 'the running sum exceeds the target (sorted → stop the loop)'],
    ['Generate Parentheses', 'close > open, or open > n'],
    ['N-Queens', 'the column or a diagonal is already attacked'],
    ['Word Search', 'the cell does not match the next letter'],
    ['Subsets II / Permutations II', 'the same value was already tried at this depth'],
  ]);
  v.say('Pruning is what makes backtracking fast in practice. As soon as a partial answer cannot possibly lead to a valid one, stop exploring that branch. Sorting the input often makes pruning easier, and skipping equal values at the same depth removes duplicate answers.');

  v.chapter('families', 'Three families');
  v.clear();
  v.table('f', ['Family', 'Loop over', 'Examples'], [
    ['subsets / combinations', 'start index i … n−1 (never look back)', 'Subsets, Combinations, Combination Sum'],
    ['permutations', 'every unused element (used[] array)', 'Permutations, Permutations II'],
    ['constraint placement', 'the options for the next cell / row', 'N-Queens, Sudoku, Word Search'],
  ]);
  v.say(`Most problems belong to one of three families. Subsets and combinations loop from a start index forward, so order does not matter. Permutations loop over every unused element, so order matters. And placement problems try every legal option for the next cell or row.`);
  void words;
  return v.build();
}

const body = String.raw`
## The idea

**Backtracking** is DFS over a tree of choices. At each node you **choose** an option, **explore** the rest recursively, then **un-choose** it and try the next option. **Prune** branches that cannot lead to a valid answer.

> Real-life picture: solving a maze by walking, and stepping back to the last junction whenever you hit a dead end.

## Template

\`\`\`java
void backtrack(int start, List<Integer> path) {
    if (isComplete(path)) { res.add(new ArrayList<>(path)); return; }   // record a COPY
    for (int i = start; i < n; i++) {
        if (!valid(i)) continue;                                        // prune
        path.add(nums[i]);                                              // choose
        backtrack(i + 1, path);                                         // explore
        path.remove(path.size() - 1);                                   // un-choose
    }
}
\`\`\`

\`\`\`python
def backtrack(start, path):
    if is_complete(path):
        res.append(path[:])                 # record a COPY
        return
    for i in range(start, n):
        if not valid(i):
            continue                        # prune
        path.append(nums[i])                # choose
        backtrack(i + 1, path)              # explore
        path.pop()                          # un-choose
\`\`\`

\`\`\`cpp
void backtrack(int start, vector<int>& path) {
    if (isComplete(path)) { res.push_back(path); return; }   // push_back copies
    for (int i = start; i < n; i++) {
        if (!valid(i)) continue;                             // prune
        path.push_back(nums[i]);                             // choose
        backtrack(i + 1, path);                              // explore
        path.pop_back();                                     // un-choose
    }
}
\`\`\`

## Families

| Family | Loop | Complexity |
|---|---|---|
| Subsets / combinations | from \`start\` forward | O(n · 2ⁿ) |
| Permutations | every unused index (\`used[]\`) | O(n · n!) |
| Placement (N-Queens, Sudoku) | options for the next slot | exponential, pruning matters |

## Duplicates in the input

Sort first, then at the same depth skip \`nums[i] == nums[i-1]\` (for subsets: when \`i > start\`; for permutations: when the previous equal element is **not** in use).

## Pitfalls

- Recording \`path\` itself instead of a copy: every stored answer then changes with the path.
- Forgetting to undo state (visited marks, counters) after the recursive call.
- Output size is exponential: that is expected, not a bug.
`;

const lesson: Lesson = {
  slug: 'backtracking',
  video,
  body,
  quiz: [
    { q: 'What are the three steps inside the backtracking loop?', options: ['sort, search, return', 'choose, explore, un-choose', 'push, pop, peek', 'split, solve, merge'], answer: 1, why: 'Apply a choice, recurse, then undo it.' },
    { q: 'Why record a copy of the path?', options: ['it is faster', 'the path object keeps changing afterwards', 'Java requires it', 'to sort it'], answer: 1, why: 'Later choices would mutate the stored answer.' },
    { q: 'How many subsets does a set of n elements have?', options: ['n', 'n²', '2ⁿ', 'n!'], answer: 2, why: 'Each element is either taken or not.' },
    { q: 'To avoid duplicate subsets when the input has duplicates you…', options: ['use a set of lists only', 'sort and skip equal values at the same depth', 'reverse the array', 'use BFS'], answer: 1, why: 'Equal values at the same depth would build the same subsets.' },
  ],
};

export default lesson;
