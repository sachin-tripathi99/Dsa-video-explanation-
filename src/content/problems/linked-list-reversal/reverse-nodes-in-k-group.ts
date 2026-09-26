import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { animateReverse } from '../../listviz';

const L = [1, 2, 3, 4, 5, 6, 7, 8];
const K = 3;
const kgroup = (a: number[], k: number) => { const out: number[] = []; let i = 0; for (; i + k <= a.length; i += k) out.push(...a.slice(i, i + k).reverse()); return [...out, ...a.slice(i)]; };

function video() {
  const v = new Video('reverse-k-group', 'Reverse Nodes in k-Group');
  v.chapter('intro', 'The problem');
  v.list('l', L, { label: `k = ${K}` });
  v.say(`Reverse the nodes k at a time. If fewer than k nodes remain at the end, leave them as they are. Only relink nodes, and use constant extra memory.`);
  v.eq(`→ [${kgroup(L, K).join(', ')}]`);

  v.chapter('brute', 'Brute force: collect each group in an array', { cx: 'O(n) · O(n)', code: ['for each full group: copy its values, write them back reversed'] });
  v.eq('extra array; rewrites values', 'warn').say('Buffering each group of values and writing them back reversed works, but uses extra memory and changes values rather than links.');

  v.chapter('optimal', 'Optimal: sublist reversal, repeated', { cx: 'O(n) · O(1)', code: ['groupPrev = dummy', 'loop: check k nodes exist after groupPrev (else stop)', '  reverse those k nodes, prev starting at the node after them', '  groupPrev.next = new group front; groupPrev = old group front'] });
  v.clear();
  const l = v.list('l', ['D', ...L], { label: 'dummy D in front' });
  const ids = l.ids();
  let gp = ids[0];
  let g = 0;
  v.say('This is Reverse Linked List Two, applied again and again. Keep groupPrev, the node before the current group. Before reversing, check that k nodes exist.');
  for (;;) {
    const grp: string[] = [];
    let p = l.nextOf(gp);
    while (p && grp.length < K) { grp.push(p); p = l.nextOf(p); }
    l.clearTones().ptr('groupPrev', gp);
    grp.forEach((x) => l.tone(x, grp.length === K ? 'active' : 'dim'));
    if (grp.length < K) {
      v.line(1).eq(`only ${grp.length} node${grp.length === 1 ? '' : 's'} left < k → stop`, 'warn').say(`Only ${words(grp.length)} nodes remain, fewer than ${words(K)}, so they stay in their original order.`);
      break;
    }
    v.line(1).eq(`group ${grp.map((x) => l.val(x)).join(', ')}`);
    if (g === 0) v.say(`The first group is ${grp.map((x) => words(l.val(x) as number)).join(', ')}.`);
    else v.hold(600);
    l.noPtr('groupPrev');
    animateReverse(v, l, grp, { before: gp, after: p, line: [2], perStep: 420 });
    v.line(3).eq(`→ ${l.ids().slice(1).map((x) => l.val(x)).join(' → ')}`).hold(700);
    gp = grp[0];
    g++;
  }
  l.clearTones().noPtr();
  v.eq(`[${kgroup(L, K).join(', ')}]`, 'ok').say('Each node is visited a constant number of times: once to count, once to reverse. Linear time, constant memory.');
  v.answer(kgroup(L, K));

  recap(v, [{ name: 'Buffer each group', time: 'O(n)', space: 'O(k)–O(n)' }, { name: 'Repeated sublist reversal', time: 'O(n)', space: 'O(1)' }], 'Count k, reverse, reconnect, move groupPrev to the old front.', ['Reverse in groups → sublist reversal in a loop'], 'The hardest reversal problem is the sublist reversal in a loop, plus a count check.');
  return v.build();
}

const problem: Problem = {
  slug: 'reverse-nodes-in-k-group',
  statement: 'Given the `head` of a linked list, reverse the nodes of the list `k` at a time, and return the modified list. If the number of nodes is not a multiple of `k`, the left-out nodes at the end should remain as they are. You may not alter the values in the nodes; use O(1) extra memory.',
  examples: [{ input: 'head = [1,2,3,4,5], k = 2', output: '[2,1,4,3,5]' }, { input: 'head = [1,2,3,4,5], k = 3', output: '[3,2,1,4,5]' }],
  constraints: ['1 ≤ k ≤ n ≤ 5000'],
  hints: ['Check that k nodes remain before reversing.', 'Reuse the sublist reversal from Reverse Linked List II.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Buffer each group', idea: 'Copy each full group’s values and write them back reversed.', time: 'O(n)', space: 'O(k)', bottleneck: 'Changes values, not links.' },
    { id: 'optimal', kind: 'optimal', name: 'Repeated sublist reversal', idea: 'groupPrev before each group; count k; reverse with prev = node after; reconnect; advance groupPrev to the old first node.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'k-group = **sublist reversal in a loop** with a count check.',
  video,
  videoArgs: [L, K],
  judge: {
    type: 'fn', fn: 'reverseKGroup', params: ['ListNode', 'int'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 3, 4, 5], 2], out: [2, 1, 4, 3, 5] }, { args: [[1, 2, 3, 4, 5], 3], out: [3, 2, 1, 4, 5] }, { args: [[1], 1], out: [1] }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 10), 1, 9); return [a, r.int(1, a.length)]; },
    ref: (a: number[], k: number) => kgroup(a, k),
  },
};

export default problem;
