import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const L = [[1, 4, 7], [2, 3, 9], [5, 6]];

function video() {
  const v = new Video('merge-k-sorted-lists', 'Merge k Sorted Lists');
  const N = L.flat().length;
  v.chapter('intro', 'The problem');
  const l0 = v.list('l', L.flat(), { label: 'k sorted linked lists (one per row)' });
  { let t = 0; L.forEach((lst, r) => { lst.forEach((_, j) => { l0.row(l0.id(t), r); if (j === lst.length - 1) l0.setNext(l0.id(t), null); t++; }); }); }
  v.say(`Merge ${words(L.length)} sorted linked lists into one sorted list, reusing the nodes.`);
  v.eq(`→ ${[...L.flat()].sort((a, b) => a - b).join(' → ')}`);

  v.chapter('brute', 'Brute force: collect, sort, rebuild', { cx: 'O(N log N)', code: ['copy all values into an array', 'sort it', 'build a new list'] });
  v.eq('throws away the sortedness', 'warn').say('Collect every value, sort, and build a new list. N log N, and it ignores that each list is already sorted.');

  v.chapter('better', 'Better: merge lists one at a time', { cx: 'O(N · k)', code: ['result = empty', 'for each list: result = mergeTwo(result, list)'] });
  v.eq('the result is re-walked for every list', 'warn').say('Merging two sorted lists is linear. Folding the lists into the result one at a time works, but the result gets walked again for every list: N times k.');

  v.chapter('optimal', 'Optimal: min-heap of the k heads', { cx: 'O(N log k)', code: ['push every list head into a min-heap', 'while heap: node = pop smallest', '  tail.next = node; tail = node', '  if node.next: push node.next'] });
  v.clear();
  const l = v.list('l', L.flat(), { label: 'the k lists (one per row)', compact: true });
  const ids: string[][] = [];
  { let t = 0; L.forEach((lst, r) => { ids.push([]); lst.forEach((_, j) => { const id = l.id(t); ids[r].push(id); l.row(id, r); if (j === lst.length - 1) l.setNext(id, null); t++; }); }); }
  const m = v.list('m', ['D'], { label: 'merged: dummy D, then tail.next = popped node', prefix: 'm', compact: true });
  const h = v.heap('h', { label: 'min-heap of heads', min: true, treeOnly: true });
  v.weight('l', 1.4).weight('m', 1).weight('h', 1.1);
  const where = new Map<number, [number, number]>();
  L.forEach((lst, r) => { where.set(lst[0], [r, 0]); h.push(lst[0]); l.tone(ids[r][0], 'cmp'); });
  m.ptr('tail', 'm0');
  v.line(0).eq(`heap = {${L.map((x) => x[0]).join(', ')}}`).say('A dummy node D starts the merged list, and tail points at its end. Push the head of each list into a min-heap. The smallest remaining node overall is always one of these heads.');
  let tail = 'm0';
  let count = 0;
  let told = 0;
  while (h.size) {
    const x = Number(h.pop());
    const [r, j] = where.get(x)!;
    const id = ids[r][j];
    const nx = j + 1 < L[r].length ? ids[r][j + 1] : null;
    l.removeNode(id);
    const nid = `mm${count++}`;
    m.add(nid, x).setNext(tail, nid).clearTones().tone(nid, 'ok');
    tail = nid;
    m.ptr('tail', tail);
    if (nx) { where.set(L[r][j + 1], [r, j + 1]); h.push(L[r][j + 1]); l.tone(nx, 'cmp'); }
    v.line(1, 2, 3).counter(`merged ${count}/${N}`).eq(`pop ${x} → tail.next = ${x}${nx ? ` · push ${L[r][j + 1]}` : ' · that list is empty'}`, 'ok');
    if (told === 0) { v.say(`Pop ${words(x)}, the smallest head. Link it after the tail and move the tail to it. Its successor, ${words(L[r][j + 1])}, becomes the new head of that list, so push it.`); told++; }
    else if (!nx && told === 1) { v.say(`Popping ${words(x)} empties its list: nothing to push. The heap shrinks.`); told++; }
    else v.hold(650);
  }
  m.clearTones().noPtr();
  v.eq(`return dummy.next → ${[...L.flat()].sort((a, b) => a - b).join(' → ')}`, 'ok').say('Return dummy dot next. Every node went through the heap once, at log k each.');
  v.answer([...L.flat()].sort((a, b) => a - b));

  recap(v, [{ name: 'Collect + sort', time: 'O(N log N)', space: 'O(N)' }, { name: 'Merge one at a time', time: 'O(N · k)', space: 'O(1)' }, { name: 'Min-heap of heads', time: 'O(N log k)', space: 'O(k)' }], 'Heap holds one head per list; pop, link, push its next.', ['k sorted lists → heap of heads'], 'Divide and conquer (merge pairs of lists) also gives N log k with O(1) extra space.');
  return v.build();
}

function refMerge(lists: number[][]) { return lists.flat().sort((a, b) => a - b); }

const problem: Problem = {
  slug: 'merge-k-sorted-lists',
  statement: 'You are given an array of `k` linked lists, each sorted in ascending order. Merge all the linked lists into one sorted linked list and return it.',
  examples: [{ input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' }, { input: 'lists = []', output: '[]' }, { input: 'lists = [[]]', output: '[]' }],
  constraints: ['0 ≤ k ≤ 10⁴', 'total nodes ≤ 10⁴', 'each list sorted ascending'],
  hints: ['Which node can come first? One of the heads.', 'Keep the heads in a min-heap.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Collect + sort', idea: 'Gather values, sort, rebuild.', time: 'O(N log N)', space: 'O(N)', bottleneck: 'Ignores sortedness.' },
    { id: 'better', kind: 'better', name: 'Merge one at a time', idea: 'Fold mergeTwo over the lists.', time: 'O(N · k)', space: 'O(1)', bottleneck: 'Re-walks the result k times.' },
    { id: 'optimal', kind: 'optimal', name: 'Min-heap of heads', idea: 'Pop the smallest head, link it, push its next.', time: 'O(N log k)', space: 'O(k)' },
  ],
  pitfalls: ['Skip empty lists when seeding the heap.', 'Java: compare node values with Integer.compare in the heap comparator.'],
  takeaway: '**Heap of heads**: O(N log k).',
  video,
  videoArgs: [L],
  judge: {
    type: 'fn', fn: 'mergeKLists', params: ['ListNode[]'], ret: 'ListNode',
    tests: [{ args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], out: [1, 1, 2, 3, 4, 4, 5, 6] }, { args: [[]], out: [] }, { args: [[[]]], out: [] }, { args: [L], out: refMerge(L) }],
    gen: (r: Rng) => [Array.from({ length: r.int(0, 5) }, () => r.ints(r.int(0, 5), -5, 9).sort((a, b) => a - b))],
    ref: (lists: number[][]) => refMerge(lists),
  },
};

export default problem;
