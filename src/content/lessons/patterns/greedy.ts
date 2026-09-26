import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

function video() {
  const v = new Video('greedy', 'Greedy algorithms');
  v.chapter('intro', 'Take the best-looking step, never look back');
  v.text('t', { title: 'Greedy', lines: ['At each step, make the choice that looks best right now', 'Never undo a choice', 'Fast and simple, but only correct for some problems'], shown: 3 });
  v.say('A greedy algorithm builds an answer one step at a time, always making the choice that looks best right now, and never going back. It is usually the fastest and simplest solution. The catch: it is only correct when the local best choice can never hurt the final answer.');

  v.chapter('works', 'When greedy works: making change with US coins', { code: ['while amount > 0:', '  take the largest coin ≤ amount'] });
  v.clear();
  const coins = [25, 10, 5, 1];
  v.array('c', coins, { label: 'coins' });
  const took: number[] = [];
  const o = v.array('o', [], { label: 'coins taken' });
  let amt = 63;
  v.say(`Pay sixty-three cents with as few coins as possible. Greedy: always take the largest coin that fits.`);
  while (amt > 0) {
    const c = coins.find((x) => x <= amt)!;
    amt -= c;
    took.push(c);
    o.push(c);
    v.line(1).counter(`left: ${amt}`).eq(`take ${c}`).hold(550);
  }
  v.eq(`${took.length} coins: ${took.join(' + ')} = 63`, 'ok').say(`Six coins, and that is optimal. For these coin values, a bigger coin always replaces several smaller ones, so grabbing it first never hurts.`);

  v.chapter('fails', 'When greedy fails: coins {1, 3, 4}');
  v.clear();
  const c2 = [4, 3, 1];
  v.array('c', c2, { label: 'coins' });
  const g = v.array('g', [4, 1, 1], { label: 'greedy for 6: take 4, then 1, then 1' });
  g.tone([0, 1, 2], 'bad');
  v.eq('greedy: 4 + 1 + 1 = 3 coins', 'bad').say('Now the coins are one, three and four, and the amount is six. Greedy grabs four, then one, then one: three coins.');
  const b = v.array('b', [3, 3], { label: 'best: 3 + 3' });
  b.tone([0, 1], 'ok');
  v.eq('best: 3 + 3 = 2 coins', 'ok').say('But three plus three uses only two coins. Taking the four first looked best and was wrong. This problem needs dynamic programming. Greedy needs a proof, or at least a convincing argument.');

  v.chapter('proof', 'How to convince yourself a greedy is right');
  v.clear();
  v.table('p', ['Argument', 'Idea'], [
    ['Exchange', 'take any optimal answer; swap in the greedy choice; it is no worse'],
    ['Stays ahead', 'after every step, greedy is at least as good as any other strategy'],
    ['Counter-example hunt', 'try small tricky inputs; one failure kills the greedy'],
  ]);
  v.say('Two classic arguments. Exchange: start from any optimal answer and swap in the greedy choice; if the answer never gets worse, greedy is optimal. Stays ahead: show that after every step greedy has done at least as well as anything else. In an interview, also try a few small tricky inputs; one counter-example is enough to reject a greedy.');

  v.chapter('shapes', 'Greedy shapes you will meet');
  v.clear();
  v.table('s', ['Shape', 'Example'], [
    ['sort, then match smallest to smallest', 'Assign Cookies'],
    ['keep the furthest reach', 'Jump Game, Jump Game II'],
    ['extend to the last occurrence', 'Partition Labels'],
    ['running balance, restart when negative', 'Gas Station'],
    ['sort by the difference of two options', 'Two City Scheduling'],
    ['two passes, left and right', 'Candy'],
    ['track a range of possible states', 'Valid Parenthesis String'],
  ]);
  v.say('These are the shapes that keep coming back: sort and match, keep the furthest reach, extend to a last occurrence, keep a running balance and restart when it goes negative, sort by the difference between two options, sweep from both sides, or track a whole range of possible states at once.');
  return v.build();
}

const body = String.raw`
## The idea

A **greedy** algorithm makes the choice that looks best **right now** and never revisits it. It is correct only when a local best choice can never make the final answer worse.

> Real-life picture: paying with the largest bill that fits, again and again. It works for normal currencies, but not for strange coin systems like {1, 3, 4}.

## Proving it (enough for an interview)

- **Exchange argument:** take any optimal solution; replace its first choice by the greedy choice; show it is still valid and no worse.
- **Greedy stays ahead:** after each step, greedy's partial answer is at least as good as any other strategy's.
- **Hunt for a counter-example** on small inputs before committing.

If greedy fails, the problem usually needs **dynamic programming**.

## Common shapes

| Shape | Problems |
|---|---|
| Sort, then match or pick | Assign Cookies, Two City Scheduling, intervals |
| Furthest reach | Jump Game, Jump Game II |
| Last occurrence | Partition Labels |
| Running balance, restart | Gas Station, Kadane |
| Two passes | Candy |
| Range of possibilities | Valid Parenthesis String |

## Example: Jump Game

\`\`\`java
int reach = 0;
for (int i = 0; i < nums.length; i++) {
    if (i > reach) return false;          // stuck before i
    reach = Math.max(reach, i + nums[i]);
}
return true;
\`\`\`

\`\`\`python
reach = 0
for i, x in enumerate(nums):
    if i > reach:
        return False                      # stuck before i
    reach = max(reach, i + x)
return True
\`\`\`

\`\`\`cpp
int reach = 0;
for (int i = 0; i < (int)nums.size(); i++) {
    if (i > reach) return false;          // stuck before i
    reach = max(reach, i + nums[i]);
}
return true;
\`\`\`

## Pitfalls

- A greedy that "feels right" can be wrong: test it against brute force on small inputs.
- The sort key is usually the whole trick (end time, difference, ratio).
`;

const lesson: Lesson = {
  slug: 'greedy',
  video,
  body,
  quiz: [
    { q: 'Coins {1, 3, 4}, amount 6: greedy gives…', options: ['2 coins', '3 coins', '6 coins', 'no answer'], answer: 1, why: '4 + 1 + 1; the optimum is 3 + 3.' },
    { q: 'What does an exchange argument show?', options: ['greedy is fast', 'swapping in the greedy choice never makes an optimal answer worse', 'the input is sorted', 'DP is needed'], answer: 1, why: 'That proves greedy is optimal.' },
    { q: 'If a greedy fails on a small example, you should…', options: ['add more greedy rules', 'consider dynamic programming', 'sort differently and hope', 'ignore it'], answer: 1, why: 'Failure means choices interact: DP handles that.' },
    { q: 'Jump Game: what does greedy track?', options: ['the number of jumps', 'the furthest reachable index', 'every path', 'the smallest jump'], answer: 1, why: 'If an index is beyond the reach, it is unreachable.' },
  ],
};

export default lesson;
