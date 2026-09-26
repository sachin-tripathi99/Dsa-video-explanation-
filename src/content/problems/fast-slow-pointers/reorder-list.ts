import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const L = [1, 2, 3, 4, 5, 6];
const reorder = (a: number[]) => { const out: number[] = []; let l = 0, r = a.length - 1; while (l <= r) { out.push(a[l++]); if (l <= r) out.push(a[r--]); } return out; };

function video() {
  const v = new Video('reorder-list', 'Reorder List');
  v.chapter('intro', 'The problem');
  v.list('l', L, { label: 'L0 → L1 → … → Ln' });
  v.say('Reorder the list to go first, last, second, second to last, and so on, by relinking nodes, not by changing values.');
  v.eq(`[${reorder(L).join(', ')}]`);

  v.chapter('brute', 'Brute force: array of nodes + two pointers', { cx: 'O(n) · O(n) space', code: ['nodes = array of all nodes', 'l, r = 0, n − 1: link nodes[l] → nodes[r] → nodes[l + 1] …'] });
  v.eq('easy with random access, but O(n) memory', 'warn').say('With all nodes in an array, alternating from both ends is easy. That costs an array of n pointers.');

  v.chapter('optimal', 'Optimal: middle, reverse, merge', { cx: 'O(n) · O(1)', code: ['1. slow/fast → split into two halves', '2. reverse the second half', '3. merge: take one from each half alternately'] });
  v.clear();
  const n = L.length;
  const half = Math.ceil(n / 2);
  const l = v.list('l', L, { label: 'one list, relinked in place' });
  const ids = L.map((_, i) => l.id(i));   // capture now: l.id() is positional and changes after order()
  const id = (i: number) => ids[i];
  // 1. middle
  let sIdx = 0;
  let fIdx = 0;
  l.ptr('slow', id(0)).ptr('fast', id(0));
  v.line(0).say('Three steps, each a pattern you already know. Step one: slow and fast pointers find the end of the first half.');
  while (fIdx + 2 < n) {
    sIdx++;
    fIdx += 2;
    l.ptr('slow', id(sIdx)).ptr('fast', id(fIdx));
    v.line(0).hold(600);
  }
  l.setNext(id(sIdx), null);
  for (let i = half; i < n; i++) l.row(id(i), 1);
  l.noPtr().tone(id(sIdx), 'active');
  v.line(0).eq(`cut after ${L[sIdx]}: first half ${L.slice(0, half).join(' → ')}, second half ${L.slice(half).join(' → ')}`).say(`Cut the list after slow, ${L[sIdx]}. The second half moves to its own row.`);
  // 2. reverse the second half, one pointer at a time
  v.say('Step two: reverse the second half, flipping one pointer at a time.');
  for (let i = half; i < n; i++) {
    l.setNext(id(i), i > half ? id(i - 1) : null).clearTones().tone(id(i), 'active');
    v.line(1).eq(`${L[i]}.next → ${i > half ? L[i - 1] : 'null'}`).hold(600);
  }
  l.order([...Array.from({ length: half }, (_, i) => id(i)), ...Array.from({ length: n - half }, (_, k) => id(n - 1 - k))]).clearTones();
  const second = L.slice(half).reverse();
  v.line(1).eq(`second half now ${second.join(' → ')}`);
  v.hold(700);
  // 3. weave
  v.say('Step three: weave. Take one node from the top row, then one from the bottom row, relinking as we go.');
  const woven: number[] = [];
  for (let k = 0; k < half; k++) {
    woven.push(k);
    const bi = n - 1 - k;
    if (bi >= half) {
      l.setNext(id(k), id(bi)).row(id(bi), 0);
      woven.push(bi);
      l.setNext(id(bi), k + 1 < half ? id(k + 1) : null);
    }
    const rest = Array.from({ length: n }, (_, i) => i).filter((i) => !woven.includes(i));
    l.order([...woven.map(id), ...rest.map(id)]).clearTones().tone(id(k), 'ok');
    if (bi >= half) l.tone(id(bi), 'ok');
    v.line(2).eq(`${L[k]} → ${bi >= half ? L[bi] + ' → ' : ''}${k + 1 < half ? L[k + 1] : 'null'}`).hold(800);
  }
  l.clearTones();
  v.line(2).eq(`[${reorder(L).join(', ')}] · only pointers changed`, 'ok').say('Every node has been relinked, no values changed and no extra memory was used.');
  v.answer(reorder(L));

  recap(v, [{ name: 'Array of nodes', time: 'O(n)', space: 'O(n)' }, { name: 'Middle + reverse + merge', time: 'O(n)', space: 'O(1)' }], 'Split, reverse the back half, interleave.', ['Interleave front and back of a list → middle + reverse + merge'], 'Hard list problems are often three easy ones glued together.');
  return v.build();
}

const problem: Problem = {
  slug: 'reorder-list',
  statement: 'You are given the head of a singly linked list `L0 → L1 → … → Ln−1 → Ln`. Reorder it to `L0 → Ln → L1 → Ln−1 → L2 → Ln−2 → …` by changing links only, not node values.',
  examples: [{ input: 'head = [1,2,3,4]', output: '[1,4,2,3]' }, { input: 'head = [1,2,3,4,5]', output: '[1,5,2,4,3]' }],
  constraints: ['1 ≤ n ≤ 5 · 10⁴'],
  hints: ['Find the middle, reverse the second half, then merge.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Array of nodes', idea: 'Store nodes; link from both ends alternately.', time: 'O(n)', space: 'O(n)', bottleneck: 'Array of n pointers.' },
    { id: 'optimal', kind: 'optimal', name: 'Middle + reverse + merge', idea: 'Split at the middle, reverse the second half, weave the halves together.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Composite list problem: **middle + reverse + merge**.',
  video,
  videoArgs: [L],
  judge: {
    type: 'fn', fn: 'reorderList', params: ['ListNode'], ret: 'void', inplace: 0,
    tests: [{ args: [[1, 2, 3, 4]], out: [1, 4, 2, 3] }, { args: [[1, 2, 3, 4, 5]], out: [1, 5, 2, 4, 3] }, { args: [[1]], out: [1] }],
    gen: (r: Rng) => [r.ints(r.int(1, 9), 1, 9)],
    ref: (a: number[]) => reorder(a),
  },
};

export default problem;
