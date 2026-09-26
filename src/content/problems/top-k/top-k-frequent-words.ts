import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const W = ['the', 'day', 'is', 'sunny', 'the', 'the', 'sunny', 'is', 'is', 'day'];
const K = 3;
function tkw(w: string[], k: number) { const m = new Map<string, number>(); for (const x of w) m.set(x, (m.get(x) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, k).map((e) => e[0]); }

function video() {
  const v = new Video('top-k-frequent-words', 'Top K Frequent Words');
  v.chapter('intro', 'The problem');
  v.array('w', W, { label: `words, k = ${K}` });
  v.say(`Return the ${words(K)} most frequent words, sorted by frequency from high to low. Words with the same frequency are sorted alphabetically.`);
  v.eq(`answer: [${tkw(W, K).join(', ')}]`);

  v.chapter('brute', 'Brute force: sort distinct words', { cx: 'O(n log n)', code: ['count', 'sort by (count desc, word asc)', 'take k'] });
  v.eq('sorts every distinct word', 'warn').say('Count, then sort the distinct words by count descending and alphabetically for ties. Simple and correct: n log n.');

  v.chapter('optimal', 'Optimal: heap of size k with a reversed tie-break', { cx: 'O(n log k)', code: ['heap top = the WORST of the best k:', '  lower count, or same count and later alphabetically', 'push each word; if size > k: pop', 'pop all, reverse'] });
  v.clear();
  const cnt = new Map<string, number>();
  for (const x of W) cnt.set(x, (cnt.get(x) ?? 0) + 1);
  const m = v.map('m', { label: 'count' });
  [...cnt.entries()].forEach(([x, c]) => m.put(x, c));
  const worse = (x: string, y: string) => { const a = x.split(' ')[0], b = y.split(' ')[0]; const ca = cnt.get(a)!, cb = cnt.get(b)!; return ca !== cb ? ca - cb : a < b ? 1 : a > b ? -1 : 0; };
  const h = v.heap('h', { label: `heap of size ${K}: worst candidate on top`, cmp: (x, y) => worse(String(x), String(y)) });
  v.say('Count the words. Then keep a heap of the best k. The top must be the worst candidate, the one to evict. Worst means a lower count. And on a tie, worst means later in the alphabet, because the earlier word should win. That reversed tie-break is the whole trick.');
  let told = false;
  [...cnt.keys()].forEach((x) => {
    m.clearTones().tone(x, 'active');
    h.push(`${x} ×${cnt.get(x)}`);
    v.line(2).eq(`push ${x} (×${cnt.get(x)})`).hold(600);
    if (h.size > K) {
      const out = String(h.pop());
      v.line(2).eq(`size > ${K} → pop ${out}`, 'bad');
      if (!told) {
        const w = out.split(' ')[0];
        const tie = h.values.map((x) => String(x).split(' ')[0]).find((y) => cnt.get(y) === cnt.get(w));
        v.say(tie ? `Four candidates. The worst is ${w}: its count ties with ${tie}, and ${w} comes later in the alphabet, so ${w} is evicted.` : `Four candidates. The worst is ${w}: it has the lowest count, so it is evicted.`);
        told = true;
      } else v.hold(700);
    }
  });
  m.clearTones();
  const res: string[] = [];
  while (h.size) res.push(String(h.pop()).split(' ')[0]);
  res.reverse();
  v.line(3).eq(`pop worst → best, then reverse: [${res.join(', ')}]`, 'ok').say(`Popping gives the words from worst to best, so reverse at the end. Is and the both appear three times; is comes first alphabetically.`);
  v.answer(tkw(W, K));

  recap(v, [{ name: 'Sort distinct words', time: 'O(n log n)', space: 'O(n)' }, { name: 'Heap of size k', time: 'O(n log k)', space: 'O(n)' }], 'Heap top = worst of the best: low count, or alphabetically last.', ['Top k with a tie-break → heap with the reversed comparator'], 'The heap comparator is the reverse of the output order.');
  return v.build();
}

const problem: Problem = {
  slug: 'top-k-frequent-words',
  statement: 'Given an array of strings `words` and an integer `k`, return the `k` most frequent strings, sorted by frequency from highest to lowest. Words with the same frequency are sorted in lexicographical order.',
  examples: [{ input: 'words = ["i","love","leetcode","i","love","coding"], k = 2', output: '["i","love"]' }, { input: 'words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4', output: '["the","is","sunny","day"]' }],
  constraints: ['1 ≤ n ≤ 500', 'k ≤ number of unique words'],
  hints: ['Count, then rank.', 'In the heap, the top should be the candidate to evict.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort', idea: 'Sort unique words by (−count, word).', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Sorts everything.' },
    { id: 'optimal', kind: 'optimal', name: 'Heap of size k', idea: 'Min-heap by count with reversed alphabetical tie-break; pop and reverse.', time: 'O(n log k)', space: 'O(n)' },
  ],
  takeaway: 'Heap order = **reverse** of output order.',
  video,
  videoArgs: [W, K],
  judge: {
    type: 'fn', fn: 'topKFrequent', params: ['String[]', 'int'], ret: 'List<String>',
    tests: [{ args: [['i', 'love', 'leetcode', 'i', 'love', 'coding'], 2], out: ['i', 'love'] }, { args: [['the', 'day', 'is', 'sunny', 'the', 'the', 'the', 'sunny', 'is', 'is'], 4], out: ['the', 'is', 'sunny', 'day'] }, { args: [W, K], out: ['is', 'the', 'day'] }],
    gen: (r: Rng) => { const pool = ['a', 'b', 'ab', 'ba', 'c', 'cat', 'dog']; const w = Array.from({ length: r.int(1, 12) }, () => r.pick(pool)); return [w, r.int(1, new Set(w).size)]; },
    ref: (w: string[], k: number) => tkw(w, k),
  },
};

export default problem;
