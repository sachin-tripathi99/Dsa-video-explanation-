import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const R = [1, 3, 4, 5, 2, 2, 1];
function candy(r: number[]) { const n = r.length, c = Array(n).fill(1); for (let i = 1; i < n; i++) if (r[i] > r[i - 1]) c[i] = c[i - 1] + 1; for (let i = n - 2; i >= 0; i--) if (r[i] > r[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1); return c.reduce((a, b) => a + b, 0); }

function video() {
  const v = new Video('candy', 'Candy');
  const n = R.length;
  v.chapter('intro', 'The problem');
  v.array('r', R, { label: 'ratings', bars: true });
  v.say('Children stand in a line with ratings. Every child gets at least one candy, and a child with a higher rating than a neighbour must get more candies than that neighbour. What is the minimum total?');
  v.eq(`answer: ${candy(R)}`);

  v.chapter('brute', 'Brute force: fix violations until none remain', { cx: 'O(n²)', code: ['give everyone 1', 'repeat until nothing changes:', '  for each child: if rated higher than a neighbour but not more candy: raise'] });
  v.eq('each pass fixes a little; up to n passes', 'warn').say('Give everyone one candy, then keep sweeping and fixing any child who breaks a rule, until a sweep changes nothing. A long decreasing run needs many sweeps: quadratic.');

  v.chapter('optimal', 'Optimal: one pass from each side', { cx: 'O(n)', code: ['c = [1] * n', '→ if r[i] > r[i−1]: c[i] = c[i−1] + 1', '← if r[i] > r[i+1]: c[i] = max(c[i], c[i+1] + 1)', 'return sum(c)'] });
  v.clear();
  const a = v.array('r', R, { label: 'ratings', bars: true });
  const c = Array(n).fill(1);
  const ca = v.array('c', [...c], { label: 'candies' });
  v.say('Each child has two rules, one per neighbour. Handle them separately. The left-to-right pass satisfies every left-neighbour rule: if you beat the child on your left, get one more than them.');
  for (let i = 1; i < n; i++) {
    a.clearTones().tone(i - 1, 'cmp').tone(i, 'active');
    if (R[i] > R[i - 1]) { c[i] = c[i - 1] + 1; ca.set(i, c[i]).clearTones().tone(i, 'ok'); v.line(1).eq(`${R[i]} > ${R[i - 1]} → c[${i}] = ${c[i]}`, 'ok'); }
    else { ca.clearTones(); v.line(1).eq(`${R[i]} ≤ ${R[i - 1]} → keep ${c[i]}`); }
    v.hold(550);
  }
  a.clearTones(); ca.clearTones();
  v.eq(`after left pass: [${c.join(', ')}]`).say('Now the right-neighbour rules. Sweep from right to left: if you beat the child on your right, you need at least one more than them. Take the maximum, so the left rule stays satisfied too.');
  let told = false;
  for (let i = n - 2; i >= 0; i--) {
    a.clearTones().tone(i + 1, 'cmp').tone(i, 'active');
    if (R[i] > R[i + 1]) {
      const old = c[i];
      const nv = Math.max(old, c[i + 1] + 1);
      const changed = nv !== old;
      c[i] = nv;
      ca.set(i, c[i]).clearTones().tone(i, changed ? 'ok' : 'cmp');
      v.line(2).eq(`${R[i]} > ${R[i + 1]} → c[${i}] = max(${old}, ${c[i + 1]} + 1) = ${nv}`, changed ? 'ok' : undefined);
      if (!told && !changed) { v.say(`The child rated ${words(R[i])} already has ${words(c[i])} candies from the left pass, which beats the right neighbour’s ${words(c[i + 1])}. Nothing changes: that is why we take the maximum.`); told = true; }
      else v.hold(600);
    } else { ca.clearTones(); v.line(2).eq(`${R[i]} ≤ ${R[i + 1]} → keep ${c[i]}`).hold(450); }
  }
  a.clearTones(); ca.clearTones();
  v.line(3).eq(`sum = ${c.reduce((x, y) => x + y, 0)}`, 'ok').say(`Every rule holds, and nobody has more candy than their rules force. The total is ${words(candy(R))}.`);
  v.answer(candy(R));

  recap(v, [{ name: 'Fix until stable', time: 'O(n²)', space: 'O(n)' }, { name: 'Two passes', time: 'O(n)', space: 'O(n)' }], 'Left pass for left neighbours, right pass (with max) for right neighbours.', ['Constraints from both neighbours → one pass per direction'], 'Split two-sided constraints into two one-sided sweeps.');
  return v.build();
}

const problem: Problem = {
  slug: 'candy',
  statement: '`n` children stand in a line, each with a rating. Give candies so that every child has at least one, and children with a higher rating than a neighbour get more candies than that neighbour. Return the minimum number of candies.',
  examples: [{ input: 'ratings = [1,0,2]', output: '5' }, { input: 'ratings = [1,2,2]', output: '4' }],
  constraints: ['1 ≤ n ≤ 2 · 10⁴', '0 ≤ ratings[i] ≤ 2 · 10⁴'],
  hints: ['Handle left neighbours and right neighbours separately.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Fix until stable', idea: 'Repeatedly raise violators until no change.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Many sweeps.' },
    { id: 'optimal', kind: 'optimal', name: 'Two passes', idea: 'Left-to-right then right-to-left with max.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['Equal ratings impose no constraint.', 'Use max in the second pass, not assignment.'],
  takeaway: '**Two sweeps** for two-sided constraints.',
  video,
  videoArgs: [R],
  judge: {
    type: 'fn', fn: 'candy', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 0, 2]], out: 5 }, { args: [[1, 2, 2]], out: 4 }, { args: [R], out: candy(R) }, { args: [[5, 4, 3, 2, 1]], out: 15 }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), 0, 5)],
    ref: (x: number[]) => candy(x),
  },
};

export default problem;
