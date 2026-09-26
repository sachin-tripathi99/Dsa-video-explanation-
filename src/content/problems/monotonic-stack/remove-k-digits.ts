import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const N = '1432219';
const K = 3;
function rk(num: string, k: number) { const st: string[] = []; for (const c of num) { while (k && st.length && st[st.length - 1] > c) { st.pop(); k--; } st.push(c); } while (k--) st.pop(); const s = st.join('').replace(/^0+/, ''); return s || '0'; }

function video() {
  const v = new Video('remove-k-digits', 'Remove K Digits');
  v.chapter('intro', 'The problem');
  v.array('d', N.split(''), { label: `remove k = ${K} digits to make the smallest number` });
  v.say(`Remove exactly ${words(K)} digits from the number so that what remains is as small as possible. Keep the order of the other digits.`);
  v.eq(`"${N}" → "${rk(N, K)}"`);

  v.chapter('insight', 'Greedy insight');
  v.clear();
  v.text('g', { title: 'Which digit should go first?', lines: ['The leftmost digits matter most', 'If a digit is larger than the one right after it, deleting it makes the number smaller', 'So delete the first digit that is followed by a smaller digit (a “peak”)'], shown: 3 });
  v.say('The leftmost positions weigh the most. If some digit is followed by a smaller digit, removing it lets the smaller digit move left, which lowers the number. So always remove the first digit that is bigger than its right neighbour.');

  v.chapter('brute', 'Brute force: remove one peak at a time, k times', { cx: 'O(n · k)', code: ['repeat k times:', '  find the first i with d[i] > d[i+1] (or the last digit)', '  delete it'] });
  v.eq('each removal rescans from the start', 'warn').say('Applying that rule k times, rescanning each time, is n times k.');

  v.chapter('optimal', 'Optimal: increasing stack', { cx: 'O(n)', code: ['for c in num:', '  while k and stack and stack.top > c: pop; k −= 1', '  push c', 'pop k more from the end if needed; strip leading zeros'] });
  v.clear();
  const a = v.array('d', N.split(''), { label: 'num' });
  const st = v.stack('st', [], { label: 'digits kept (non-decreasing)' });
  const stack: string[] = [];
  let k = K;
  const vars = v.vars('v', { k });
  let told = 0;
  v.say('Build the answer on a stack that stays non-decreasing. Whenever a new digit is smaller than the top, the top is a peak, so pop it, as long as removals remain.');
  N.split('').forEach((c, i) => {
    a.clearTones().tone(i, 'active');
    while (k && stack.length && stack[stack.length - 1] > c) {
      const t = stack.pop()!;
      st.pop();
      k--;
      vars.set({ k });
      v.line(1).eq(`${t} > ${c} → remove ${t} (k = ${k})`, 'bad');
      if (told === 0) { v.say(`Three arrives after four. Four is bigger, so removing four makes the number smaller. Pop it.`); told++; } else v.hold(600);
    }
    stack.push(c);
    st.push(c);
    v.line(2).eq(`push ${c}`).hold(400);
  });
  a.clearTones();
  const ans = rk(N, K);
  v.line(3).eq(`k = 0 → answer "${ans}"`, 'ok').say(`Removals used up, the stack reads ${ans.split('').join(', ')}. If removals were left over, we would drop digits from the end, the largest ones. And leading zeros are stripped.`);
  v.answer(ans);

  recap(v, [{ name: 'Remove one peak k times', time: 'O(n · k)', space: 'O(n)' }, { name: 'Increasing stack', time: 'O(n)', space: 'O(n)' }], 'Remove a digit whenever a smaller digit follows it.', ['Smallest number after removals → greedy increasing stack'], 'Greedy plus a monotonic stack: remove peaks as soon as you see them.');
  return v.build();
}

const problem: Problem = {
  slug: 'remove-k-digits',
  statement: 'Given a string `num` representing a non-negative integer and an integer `k`, return the smallest possible integer after removing `k` digits from `num`, as a string without leading zeros ("0" if empty).',
  examples: [{ input: 'num = "1432219", k = 3', output: '"1219"' }, { input: 'num = "10200", k = 1', output: '"200"' }, { input: 'num = "10", k = 2', output: '"0"' }],
  constraints: ['1 ≤ k ≤ num.length ≤ 10⁵'],
  hints: ['Which digit, if removed, reduces the number the most?', 'Keep the kept digits non-decreasing.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Remove one peak k times', idea: 'k times: delete the first digit larger than its successor (or the last).', time: 'O(n · k)', space: 'O(n)', bottleneck: 'Rescans.' },
    { id: 'optimal', kind: 'optimal', name: 'Increasing stack', idea: 'Pop larger tops while k > 0; push; trim k from the end; strip leading zeros.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['Leftover k after the scan: remove from the end.', 'Strip leading zeros; return "0" for an empty result.'],
  takeaway: 'Greedy **increasing stack** removes peaks early.',
  video,
  videoArgs: [N, K],
  judge: {
    type: 'fn', fn: 'removeKdigits', params: ['String', 'int'], ret: 'String',
    tests: [{ args: ['1432219', 3], out: '1219' }, { args: ['10200', 1], out: '200' }, { args: ['10', 2], out: '0' }, { args: ['112', 1], out: '11' }],
    gen: (r: Rng) => { const s = r.str(r.int(1, 10), '0123459'); return [s, r.int(1, s.length)]; },
    ref: (s: string, k: number) => rk(s, k),
  },
};

export default problem;
