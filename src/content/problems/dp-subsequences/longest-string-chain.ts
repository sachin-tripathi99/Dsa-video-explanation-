import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const WS = ['a', 'b', 'ba', 'bca', 'bda', 'bdca', 'xy'];
function chain(ws: string[]) { const s = [...ws].sort((a, b) => a.length - b.length); const d = new Map<string, number>(); let best = 0; for (const w of s) { let b = 1; for (let i = 0; i < w.length; i++) { const p = w.slice(0, i) + w.slice(i + 1); if (d.has(p)) b = Math.max(b, d.get(p)! + 1); } d.set(w, Math.max(d.get(w) ?? 0, b)); best = Math.max(best, b); } return best; }

function video() {
  const v = new Video('longest-string-chain', 'Longest String Chain');
  const sorted = [...WS].sort((a, b) => a.length - b.length || (a < b ? -1 : 1));
  v.chapter('intro', 'The problem');
  v.array('w', WS, { label: 'words' });
  v.say('Word A is a predecessor of word B if inserting exactly one letter anywhere in A gives B. A chain is a sequence where each word is a predecessor of the next. Find the longest chain.');
  v.eq(`answer: ${chain(WS)} (a → ba → bda → bdca)`);

  v.chapter('brute', 'Brute force: DFS from every word upward', { cx: 'exponential', code: ['longest(w) = 1 + max(longest(w + one letter) that is in the list)', 'try every word as the start'] });
  v.eq('repeated searches from shared words', 'bad').say('A search from each word that tries every possible insertion revisits the same longer words again and again.');

  v.chapter('optimal', 'Sort by length, then DP on a hash map', { cx: 'O(n · L²)', code: ['sort words by length', 'for w: best[w] = 1 + max(best[w minus one letter])', '  (predecessors are shorter, so already computed)', 'answer = max(best)'] });
  v.clear();
  const src = v.array('w', sorted, { label: 'words sorted by length' });
  const map = v.map('m', { label: 'best[w] = longest chain ending at w' });
  v.line(0).say('Look backwards instead. The predecessors of a word are just the word with one letter removed: at most L of them. If we process words from shortest to longest, every predecessor is finished before the word itself, and a hash map gives its best chain in constant time.');
  const d = new Map<string, number>();
  sorted.forEach((w, k) => {
    src.clearTones().tone(k, 'active');
    map.clearTones();
    let b = 1; let via = '';
    const tried: string[] = [];
    for (let i = 0; i < w.length; i++) { const p = w.slice(0, i) + w.slice(i + 1); tried.push(p || '""'); if (d.has(p)) { map.tone(p, 'cmp'); if (d.get(p)! + 1 > b) { b = d.get(p)! + 1; via = p; } } }
    d.set(w, b);
    map.put(w, b).tone(w, 'active');
    v.line(1, 2).counter(`word ${k + 1}/${sorted.length}`).eq(`"${w}": remove one letter → ${tried.join(', ')}${via ? ` → best via "${via}"` : ''} = ${b}`);
    if (w === 'ba') v.say('Ba loses one letter to give a or b. Both are in the map with chains of one, so ba ends a chain of two.');
    else if (w === 'bda') v.say('Bda can come from da, ba or bd. Only ba exists, with two: so three.');
    else if (w === 'bdca') v.say('Bdca: removing one letter gives dca, bca, bda or bdc. Bca and bda both end chains of three, so bdca ends a chain of four.');
    else if (w === 'xy') v.say('Xy has no predecessor in the list, so its chain is just itself.');
    else v.hold(700);
  });
  src.clearTones(); map.clearTones();
  const best = Math.max(...d.values());
  [...d].forEach(([w, b]) => { if (b === best) map.tone(w, 'ok'); });
  v.line(3).eq(`longest chain = ${best}`, 'ok').say(`The longest chain has ${words(best)} words. Each word tries L deletions, each building a string of length L: n times L squared.`);
  v.answer(chain(WS));

  recap(v, [{ name: 'DFS by insertions', time: 'exponential', space: 'O(n)' }, { name: 'Sort + hash map DP', time: 'O(n log n + n · L²)', space: 'O(n · L)' }], 'Process by length; look up predecessors by deleting one letter.', ['Chains where each step adds one element → sort by size, DP on a map'], 'Delete letters (L options) instead of inserting (26·L).');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-string-chain',
  statement: 'Word A is a predecessor of word B if you can insert exactly one letter anywhere in A to make B. A word chain is a sequence where each word is a predecessor of the next. Return the length of the longest possible word chain using words from `words`.',
  examples: [{ input: 'words = ["a","b","ba","bca","bda","bdca"]', output: '4' }, { input: 'words = ["xbc","pcxbcf","xb","cxbc","pcxbc"]', output: '5' }, { input: 'words = ["abcd","dbqca"]', output: '1' }],
  constraints: ['1 ≤ words.length ≤ 1000', '1 ≤ words[i].length ≤ 16', 'lowercase English letters'],
  hints: ['Sort by length.', 'Predecessors = the word with one letter deleted.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS by insertions', idea: 'From each word, try every longer word it can grow into.', time: 'exponential', space: 'O(n)', bottleneck: 'Repeated searches.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + map DP', idea: 'best[w] = 1 + max best[w minus a letter].', time: 'O(n · L²)', space: 'O(n · L)' },
  ],
  takeaway: 'Sort by length; **delete a letter** to find predecessors.',
  video,
  videoArgs: [WS],
  judge: {
    type: 'fn', fn: 'longestStrChain', params: ['String[]'], ret: 'int',
    tests: [{ args: [['a', 'b', 'ba', 'bca', 'bda', 'bdca']], out: 4 }, { args: [['xbc', 'pcxbcf', 'xb', 'cxbc', 'pcxbc']], out: 5 }, { args: [['abcd', 'dbqca']], out: 1 }, { args: [WS], out: chain(WS) }],
    gen: (r: Rng) => { const al = 'ab'; const s = new Set<string>(); for (let i = r.int(1, 10); i > 0; i--) s.add(Array.from({ length: r.int(1, 4) }, () => al[r.int(0, 1)]).join('')); return [[...s]]; },
    ref: (ws: string[]) => chain(ws),
  },
};

export default problem;
