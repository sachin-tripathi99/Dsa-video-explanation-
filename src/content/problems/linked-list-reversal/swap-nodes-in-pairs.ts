import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { animateReverse } from '../../listviz';

const L = [1, 2, 3, 4, 5];
const swapPairs = (a: number[]) => { const b = [...a]; for (let i = 0; i + 1 < b.length; i += 2) [b[i], b[i + 1]] = [b[i + 1], b[i]]; return b; };

function video() {
  const v = new Video('swap-nodes-in-pairs', 'Swap Nodes in Pairs');
  v.chapter('intro', 'The problem');
  v.list('l', L, { label: 'head' });
  v.say('Swap every two adjacent nodes and return the head. You must relink nodes, not swap their values.');
  v.eq(`→ [${swapPairs(L).join(', ')}] (an odd last node stays)`);

  v.chapter('brute', 'Brute force: array of nodes', { cx: 'O(n) · O(n)', code: ['nodes = list of nodes', 'swap entries pairwise; relink in array order'] });
  v.eq('extra array of node references', 'warn').say('Put the nodes in an array, swap neighbours in the array, and relink in order. Linear, with linear memory.');

  v.chapter('optimal', 'Optimal: reverse groups of two', { cx: 'O(n) · O(1)', code: ['prev = dummy', 'while prev.next and prev.next.next:', '  a, b = prev.next, prev.next.next', '  a.next = b.next; b.next = a; prev.next = b', '  prev = a'] });
  v.clear();
  const l = v.list('l', ['D', ...L], { label: 'dummy D in front' });
  const ids = l.ids();
  v.say('Each pair is a tiny reversal of two nodes. With a dummy node, prev always points at the node before the current pair.');
  let prev = ids[0];
  let k = 0;
  while (l.nextOf(prev) && l.nextOf(l.nextOf(prev))) {
    const a = l.nextOf(prev)!;
    const b = l.nextOf(a)!;
    const after = l.nextOf(b);
    l.clearTones().ptr('prev', prev).tone(a, 'active').tone(b, 'active');
    v.line(2).eq(`pair ${l.val(a)}, ${l.val(b)}`);
    if (k === 0) v.say(`The first pair is ${words(L[0])} and ${words(L[1])}. Three pointer changes: ${words(L[0])} points past the pair, ${words(L[1])} points at ${words(L[0])}, and prev points at ${words(L[1])}.`);
    else v.hold(600);
    l.noPtr('prev');
    animateReverse(v, l, [a, b], { before: prev, after, line: [3], perStep: 500 });
    v.line(4).eq(`→ ${l.ids().slice(1).map((x) => l.val(x)).join(' → ')}`).hold(600);
    prev = a;                              // a is now the second node of the pair
    k++;
  }
  l.clearTones();
  v.eq(`[${swapPairs(L).join(', ')}] · the last odd node stays`, 'ok').say(`When fewer than two nodes remain, stop. ${words(L[L.length - 1])} has no partner and stays where it is.`);
  v.answer(swapPairs(L));

  recap(v, [{ name: 'Array of nodes', time: 'O(n)', space: 'O(n)' }, { name: 'Pairwise relinking', time: 'O(n)', space: 'O(1)' }], 'Swap pairs = reverse in groups of two.', ['Pairwise or k-wise relinking → dummy + prev pointer'], 'A dummy node makes the first pair no different from the others.');
  return v.build();
}

const problem: Problem = {
  slug: 'swap-nodes-in-pairs',
  statement: 'Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list’s nodes (only nodes themselves may be changed).',
  examples: [{ input: 'head = [1,2,3,4]', output: '[2,1,4,3]' }, { input: 'head = []', output: '[]' }, { input: 'head = [1,2,3]', output: '[2,1,3]' }],
  constraints: ['0 ≤ n ≤ 100'],
  hints: ['Use a dummy node before the head.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Array of nodes', idea: 'Store nodes, swap pairwise in the array, relink.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra array.' },
    { id: 'optimal', kind: 'optimal', name: 'Pairwise relinking', idea: 'a = prev.next, b = a.next: a.next = b.next; b.next = a; prev.next = b; prev = a.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '**Groups of two** reversal with a dummy head.',
  video,
  videoArgs: [L],
  judge: {
    type: 'fn', fn: 'swapPairs', params: ['ListNode'], ret: 'ListNode',
    tests: [{ args: [[1, 2, 3, 4]], out: [2, 1, 4, 3] }, { args: [[]], out: [] }, { args: [[1, 2, 3]], out: [2, 1, 3] }],
    gen: (r: Rng) => [r.ints(r.int(0, 9), 1, 9)],
    ref: (a: number[]) => swapPairs(a),
  },
};

export default problem;
