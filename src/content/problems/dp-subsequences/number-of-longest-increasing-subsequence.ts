import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [1, 3, 5, 4, 7, 2, 6, 8];
function nlis(a: number[]) { const n = a.length; const len = Array(n).fill(1), cnt = Array(n).fill(1); for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) if (a[j] < a[i]) { if (len[j] + 1 > len[i]) { len[i] = len[j] + 1; cnt[i] = cnt[j]; } else if (len[j] + 1 === len[i]) cnt[i] += cnt[j]; } const L = Math.max(...len); return len.reduce((s, l, i) => s + (l === L ? cnt[i] : 0), 0); }

function video() {
  const v = new Video('number-of-longest-increasing-subsequence', 'Number of Longest Increasing Subsequence');
  const n = A.length;
  const len = Array(n).fill(1), cnt = Array(n).fill(1);
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Not just the length of the longest strictly increasing subsequence: how many different longest ones are there?');
  v.eq(`answer: ${nlis(A)}`);

  v.chapter('brute', 'Brute force: enumerate every subsequence', { cx: 'O(2ⁿ · n)', code: ['for each subsequence: if increasing, record its length', 'count those with the maximum length'] });
  v.eq(`2^${n} = ${2 ** n} subsequences`, 'bad').say('Listing every subsequence and checking it works only for tiny arrays.');

  v.chapter('optimal', 'Two arrays: length and count ending at i', { cx: 'O(n²)', code: ['len[i] = longest ending at i; cnt[i] = how many', 'for j < i with a[j] < a[i]:', '  len[j] + 1 > len[i] → len[i] = len[j] + 1, cnt[i] = cnt[j]', '  len[j] + 1 == len[i] → cnt[i] += cnt[j]', 'answer = Σ cnt[i] with len[i] == max'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const la = v.array('len', A.map(() => 1), { label: 'len[i]' });
  const ca = v.array('cnt', A.map(() => 1), { label: 'cnt[i]' });
  v.line(0).say('Extend the usual LIS table with a second number per position: how many longest subsequences end there. When a better length is found, the count is inherited. When the same length is found another way, the counts add up.');
  for (let i = 0; i < n; i++) {
    const notes: string[] = [];
    for (let j = 0; j < i; j++) if (A[j] < A[i]) {
      if (len[j] + 1 > len[i]) { len[i] = len[j] + 1; cnt[i] = cnt[j]; notes.push(`via ${A[j]}: new length ${len[i]}`); }
      else if (len[j] + 1 === len[i]) { cnt[i] += cnt[j]; notes.push(`via ${A[j]}: +${cnt[j]}`); }
    }
    a.clearTones().tone(i, 'active');
    for (let j = 0; j < i; j++) if (A[j] < A[i] && len[j] + 1 === len[i]) a.tone(j, 'cmp');
    la.clearTones().set(i, len[i]).tone(i, 'active');
    ca.clearTones().set(i, cnt[i]).tone(i, 'active');
    const from = [...Array(i).keys()].filter((j) => A[j] < A[i] && len[j] + 1 === len[i]);
    void notes;
    v.line(2, 3).eq(from.length ? `${A[i]}: len ${len[i]}, cnt ${from.map((j) => cnt[j]).join(' + ')} = ${cnt[i]} (after ${from.map((j) => A[j]).join(', ')})` : `${A[i]}: len 1, cnt 1`);
    if (i === 3) v.say('Four can follow one or three. The longest ending at four has length three: one, three, four. One way.');
    else if (i === 4) v.say(`Seven can follow five or four, both at length three with one way each. So length four, and the counts add: two ways.`);
    else if (i === 7) v.say(`Eight ends runs of length ${words(len[7])}: after seven, two ways, and after six, ${words(cnt[6])} more.`);
    else v.hold(700);
  }
  a.clearTones(); la.clearTones(); ca.clearTones();
  const L = Math.max(...len);
  len.forEach((l, i) => { if (l === L) { la.tone(i, 'ok'); ca.tone(i, 'ok'); } });
  v.line(4).eq(`max len ${L} → total ${nlis(A)}`, 'ok').say(`The longest length is ${words(L)}, and adding the counts at every position that reaches it gives ${words(nlis(A))}.`);
  v.answer(nlis(A));

  recap(v, [{ name: 'All subsequences', time: 'O(2ⁿ · n)', space: 'O(n)' }, { name: 'len + cnt DP', time: 'O(n²)', space: 'O(n)' }], 'Better length → inherit the count; equal length → add it.', ['Count optimal solutions → carry (best, count) pairs'], 'Sum counts over every end with the max length.');
  return v.build();
}

const problem: Problem = {
  slug: 'number-of-longest-increasing-subsequence',
  statement: 'Given an integer array `nums`, return the number of longest strictly increasing subsequences.',
  examples: [{ input: 'nums = [1,3,5,4,7]', output: '2' }, { input: 'nums = [2,2,2,2,2]', output: '5' }],
  constraints: ['1 ≤ nums.length ≤ 2000', '−10⁶ ≤ nums[i] ≤ 10⁶', 'the answer fits in a 32-bit integer'],
  hints: ['Keep a length and a count per ending position.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Enumerate', idea: 'Check every subsequence.', time: 'O(2ⁿ · n)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'optimal', kind: 'optimal', name: 'len + cnt', idea: 'O(n²) LIS carrying counts.', time: 'O(n²)', space: 'O(n)' },
  ],
  takeaway: 'Carry **(length, count)**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'findNumberOfLIS', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 3, 5, 4, 7]], out: 2 }, { args: [[2, 2, 2, 2, 2]], out: 5 }, { args: [A], out: nlis(A) }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 12) }, () => r.int(0, 8))],
    ref: (a: number[]) => nlis(a),
  },
};

export default problem;
