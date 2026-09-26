import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const L = [1, 2, 3, 4, 5];
const K = 2;

function video() {
  const v = new Video('remove-nth-from-end', 'Remove Nth Node From End of List');
  v.chapter('intro', 'The problem');
  const l0 = v.list('l', L, { label: `n = ${K}` });
  l0.tone(l0.id(L.length - K), 'bad');
  const ord = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth'][K] ?? `${K}th`;
  v.say(`Remove the ${ord} node from the end of the list and return the head. Here that is the node with value ${words(L[L.length - K])}.`);

  v.chapter('brute', 'Brute force: two passes', { cx: 'O(n), two passes', code: ['len = count nodes', 'walk to node len − n − 1 and unlink the next one'] });
  v.eq('count first, then walk again', 'warn').say('Count the length, then walk to the node just before the target and unlink it. Two passes.');

  v.chapter('optimal', 'Optimal: a gap of n, with a dummy head', { cx: 'O(n), one pass', code: ['dummy.next = head; fast = slow = dummy', 'move fast n + 1 steps', 'while fast: slow = slow.next; fast = fast.next', 'slow.next = slow.next.next', 'return dummy.next'] });
  v.clear();
  const vals: (string | number)[] = ['D', ...L];
  const l = v.list('l', vals, { label: 'dummy node D in front' });
  let s = 0;
  let f = 0;
  l.ptr('slow', l.id(0)).ptr('fast', l.id(0));
  v.line(0).say('Put a dummy node in front. It gives every real node, even the head, a node before it, which is what we need to unlink.');
  for (let k = 0; k <= K; k++) { f++; l.ptr('fast', f < vals.length ? l.id(f) : null); v.line(1).eq(`fast moves ahead: ${k + 1} of ${K + 1}`).hold(500); }
  v.say(`Fast is now ${words(K + 1)} nodes ahead of slow. Keep that gap and move both together.`);
  while (f < vals.length) {
    s++;
    f++;
    l.clearTones().ptr('slow', l.id(s)).ptr('fast', f < vals.length ? l.id(f) : null).tone(l.id(s), 'active');
    v.line(2).hold(600);
  }
  const target = s + 1;
  l.tone(l.id(target), 'bad');
  v.eq(`fast is null → slow is just before ${vals[target]}`).say(`Fast has fallen off the end, so slow sits right before the node to remove, ${words(vals[target] as number)}.`);
  const after = target + 1 < vals.length ? l.id(target + 1) : null;
  l.removeNode(l.id(target)).setNext(l.id(s), after);
  l.clearTones().tone(l.id(s), 'ok');
  const out = L.filter((_, i) => i !== L.length - K);
  v.line(3, 4).eq(`result: [${out.join(', ')}]`, 'ok').say('Point slow’s next past it, and return dummy dot next. One pass, and the head needs no special case.');
  v.answer(out);

  recap(v, [{ name: 'Two passes', time: 'O(n)', space: 'O(1)' }, { name: 'Gap of n + dummy head', time: 'O(n), one pass', space: 'O(1)' }], 'A fixed gap turns “from the end” into “from the front”.', ['k-th from the end → two pointers with a gap', 'Deleting possibly the head → dummy node'], 'Use a gap to measure from the end, and a dummy node to make head deletion ordinary.');
  return v.build();
}

const problem: Problem = {
  slug: 'remove-nth-node-from-end-of-list',
  statement: 'Given the `head` of a linked list, remove the `n`-th node from the end of the list and return its head.',
  examples: [{ input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]' }, { input: 'head = [1], n = 1', output: '[]' }, { input: 'head = [1,2], n = 1', output: '[1]' }],
  constraints: ['1 ≤ size ≤ 30', '1 ≤ n ≤ size'],
  hints: ['Could you do it in one pass?', 'Keep two pointers n nodes apart.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Two passes', idea: 'Count the length L, then unlink node L − n.', time: 'O(n)', space: 'O(1)', bottleneck: 'Two passes.' },
    { id: 'optimal', kind: 'optimal', name: 'Gap + dummy head', idea: 'Advance fast n + 1 steps from a dummy; move both until fast is null; unlink slow.next.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Removing the head: the dummy node handles it.'],
  takeaway: '**Gap of n** for “from the end”; **dummy** for head removal.',
  video,
  videoArgs: [L, K],
  judge: {
    type: 'fn', fn: 'removeNthFromEnd', params: ['ListNode', 'int'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 3, 4, 5], 2], out: [1, 2, 3, 5] }, { args: [[1], 1], out: [] }, { args: [[1, 2], 1], out: [1] }, { args: [[1, 2], 2], out: [2] }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 9), 1, 9); return [a, r.int(1, a.length)]; },
    ref: (a: number[], n: number) => a.filter((_, i) => i !== a.length - n),
  },
};

export default problem;
