import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const L = [1, 2, 3, 2, 1];

function video() {
  const v = new Video('palindrome-linked-list', 'Palindrome Linked List');
  v.chapter('intro', 'The problem');
  v.list('l', L, { label: 'head' });
  v.say('Is this linked list a palindrome, the same read forwards and backwards? With an array you would compare both ends, but a singly linked list cannot walk backwards.');

  v.chapter('brute', 'Brute force: copy into an array', { cx: 'O(n) · O(n) space', code: ['vals = list of all values', 'return vals == reversed(vals)'] });
  v.eq('easy, but O(n) extra memory', 'warn').say('Copy the values into an array and use two pointers. Linear time, but linear extra space.');

  v.chapter('optimal', 'Optimal: find the middle, reverse the second half, compare', { cx: 'O(n) · O(1)', code: ['slow/fast → slow at the middle', 'reverse the list from slow', 'compare the first half with the reversed second half', '(optionally reverse back to restore the list)'] });
  v.clear();
  const l = v.list('l', L, { label: 'head' });
  const mid = Math.floor(L.length / 2);
  l.ptr('slow', l.id(mid)).tone(l.id(mid), 'active');
  v.line(0).eq(`middle at ${L[mid]}`).say('Step one: fast and slow pointers find the middle.');
  const second = L.slice(mid).reverse();
  l.row(l.id(mid), 1);
  for (let i = mid + 1; i < L.length; i++) l.row(l.id(i), 1);
  for (let i = mid; i < L.length; i++) l.setNext(l.id(i), i > mid ? l.id(i - 1) : null);
  l.setNext(l.id(mid - 1), null);
  l.order([...L.slice(0, mid).map((_, i) => l.id(i)), ...Array.from({ length: L.length - mid }, (_, k) => l.id(L.length - 1 - k))]);
  l.noPtr();
  v.line(1).eq(`second half reversed: ${second.join(' → ')}`).say('Step two: reverse the second half in place, like in the reversal module. Now its end points back toward the middle.');
  for (let k = 0; k < mid; k++) {
    l.clearTones().tone(l.id(k), 'ok').tone(l.id(L.length - 1 - k), 'ok');
    v.line(2).eq(`${L[k]} vs ${L[L.length - 1 - k]} ✓`, 'ok').hold(700);
  }
  v.say('Step three: walk the first half and the reversed second half together. Every pair matches, so it is a palindrome. Reversing the second half back afterwards leaves the input unchanged.');
  v.answer(true);

  recap(v, [{ name: 'Copy to array', time: 'O(n)', space: 'O(n)' }, { name: 'Middle + reverse + compare', time: 'O(n)', space: 'O(1)' }], 'Make the second half walkable backwards by reversing it.', ['Compare a list with its reverse in O(1) space → middle + reverse half'], 'Combine patterns: fast/slow finds the middle, reversal gives you the backwards walk.');
  return v.build();
}

const problem: Problem = {
  slug: 'palindrome-linked-list',
  statement: 'Given the `head` of a singly linked list, return `true` if it is a palindrome. Could you do it in O(n) time and O(1) space?',
  examples: [{ input: 'head = [1,2,2,1]', output: 'true' }, { input: 'head = [1,2]', output: 'false' }],
  constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ val ≤ 9'],
  hints: ['Find the middle.', 'Reverse the second half and compare.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Copy to an array', idea: 'Collect values; compare with the reverse.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra memory.' },
    { id: 'optimal', kind: 'optimal', name: 'Middle + reverse + compare', idea: 'Slow/fast to the middle; reverse from there; compare the two halves.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Two patterns combined: **fast/slow + reversal**.',
  video,
  videoArgs: [L],
  judge: {
    type: 'fn', fn: 'isPalindrome', params: ['ListNode'], ret: 'boolean',
    tests: [{ args: [[1, 2, 2, 1]], out: true }, { args: [[1, 2]], out: false }, { args: [[7]], out: true }, { args: [[1, 2, 3, 2, 1]], out: true }],
    gen: (r: Rng) => { const h = r.ints(r.int(0, 4), 0, 3); const a = r.chance(0.5) ? [...h, ...r.ints(r.int(0, 1), 0, 3), ...[...h].reverse()] : r.ints(r.int(1, 8), 0, 3); return [a.length ? a : [1]]; },
    ref: (a: number[]) => a.join() === [...a].reverse().join(),
  },
};

export default problem;
