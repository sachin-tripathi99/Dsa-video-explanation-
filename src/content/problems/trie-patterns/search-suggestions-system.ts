import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { trieViz } from '../../trieviz';

const PROD = ['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'];
const SW = 'mouse';
function suggest(products: string[], w: string) { const s = [...products].sort(); return [...w].map((_, i) => s.filter((p) => p.startsWith(w.slice(0, i + 1))).slice(0, 3)); }

function video() {
  const v = new Video('search-suggestions-system', 'Search Suggestions System');
  const ans = suggest(PROD, SW);
  const sorted = [...PROD].sort();
  v.chapter('intro', 'The problem');
  v.array('p', PROD, { label: 'products' });
  v.say(`As the user types ${SW}, one letter at a time, show up to three products that start with what has been typed so far, in alphabetical order.`);
  v.table('t', ['typed', 'suggestions'], ans.map((s, i) => [SW.slice(0, i + 1), s.join(', ') || '—']));
  v.say('After m and mo, the three alphabetically first products are mobile, moneypot and monitor. From mou onwards only mouse and mousepad match.');

  v.chapter('brute', 'Brute force: scan every product for every prefix', { cx: 'O(L · n · L)', code: ['sort products', 'for each prefix: scan all products, keep the first 3 that match'] });
  v.eq('every keystroke rescans the whole catalogue', 'bad').say('Sort once, then for each typed prefix scan the whole sorted list and keep the first three matches. Each keystroke reads every product.');

  v.chapter('better', 'Better: sorted list + binary search', { cx: 'O(n log n + L log n)', code: ['sort products', 'for each prefix: i = lower_bound(prefix)', '  take products i, i+1, i+2 while they start with the prefix'] });
  v.clear();
  const a = v.array('s', sorted, { label: 'sorted products' });
  v.line(0).say('In a sorted list, all products with the same prefix sit next to each other, and the first of them is exactly where the prefix itself would be inserted.');
  for (let i = 0; i < SW.length; i++) {
    const p = SW.slice(0, i + 1);
    let lo = 0; while (lo < sorted.length && sorted[lo] < p) lo++;
    a.clearTones().ptr('lb', lo);
    for (let k = lo; k < Math.min(lo + 3, sorted.length); k++) a.tone(k, sorted[k].startsWith(p) ? 'ok' : 'dim');
    v.line(1, 2).counter(`typed "${p}"`).eq(`lower_bound("${p}") = ${lo} → ${ans[i].join(', ')}`, 'ok');
    if (i === 0) v.say('For m, binary search lands on index zero; the next three all start with m.');
    else if (i === 2) v.say('For m, o, u, the insertion point jumps past monitor to mouse. Only two products from there start with mou.');
    else v.hold(800);
  }
  a.noPtr().clearTones();

  v.chapter('optimal', 'Trie: walk one node per keystroke', { cx: 'O(Σ L) build, O(L) per word', code: ['insert products in sorted order', '  each node keeps the first 3 words that pass through it', 'typing a letter = one step down; read that node’s list'] });
  v.clear();
  const T = trieViz(v, 't', 'trie of products');
  sorted.forEach((w) => T.insert(w));
  T.t.clearTones();
  const tb = v.table('r', ['typed', 'node’s top 3'], []);
  v.layout('row').weight('t', 2.2).weight('r', 1);
  v.line(0, 1).say('Insert the products in sorted order. Every node remembers the first three words that pass through it; since the words arrive alphabetically, those are exactly the three suggestions for that prefix.');
  for (let i = 0; i < SW.length; i++) {
    const p = SW.slice(0, i + 1);
    T.walk(p);
    T.t.tone(T.ID(p), 'active');
    tb.addRow([p, ans[i].join(', ')]);
    v.line(2).counter(`typed "${p}"`).eq(`node "${p}" → [${ans[i].join(', ')}]`, 'ok');
    if (i === 0) v.say('Typing m moves one step down from the root. That node’s stored list is the answer for this keystroke.');
    else if (i === 2) v.say('Typing u moves into the mou branch. Its list holds just mouse and mousepad.');
    else v.hold(800);
  }
  v.say('Each keystroke is one step down plus reading at most three words. The walk continues from where it was, so a word of length L costs O of L after building the trie.');
  v.answer(ans);

  recap(v, [{ name: 'Scan all per prefix', time: 'O(L · n · L)', space: 'O(1)' }, { name: 'Sort + binary search', time: 'O(n log n + L log n)', space: 'O(1)' }, { name: 'Trie with top-3 per node', time: 'O(Σ L) + O(L)', space: 'O(Σ L)' }], 'Autocomplete = walk the prefix; answers live at the node.', ['Suggestions while typing → trie walk (or sorted list + lower bound)'], 'Insert in sorted order so each node’s first 3 are the answer.');
  return v.build();
}

const problem: Problem = {
  slug: 'search-suggestions-system',
  statement: 'Given an array of strings `products` and a string `searchWord`, after each character of `searchWord` is typed, suggest at most three products that start with the typed prefix, choosing the lexicographically smallest ones. Return the list of suggestion lists.',
  examples: [{ input: 'products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"', output: '[["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]' }, { input: 'products = ["havana"], searchWord = "tatiana"', output: '[[],[],[],[],[],[],[]]' }],
  constraints: ['1 ≤ products.length ≤ 1000', 'Σ products[i].length ≤ 2 · 10⁴', 'all products are unique lowercase strings', '1 ≤ searchWord.length ≤ 1000'],
  hints: ['Sort first.', 'Words with the same prefix are contiguous in sorted order.', 'A trie node can store its first three words.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan per prefix', idea: 'For each prefix, scan the sorted products for the first 3 matches.', time: 'O(L · n · L)', space: 'O(1)', bottleneck: 'Rescans everything each keystroke.' },
    { id: 'better', kind: 'better', name: 'Binary search', idea: 'lower_bound(prefix) in the sorted list, then take up to 3.', time: 'O(n log n + L log n)', space: 'O(1)', bottleneck: 'Log factor per keystroke.' },
    { id: 'optimal', kind: 'optimal', name: 'Trie with top 3', idea: 'Each node stores the first three words inserted through it (inserted in sorted order).', time: 'O(Σ L + L)', space: 'O(Σ L)' },
  ],
  takeaway: 'Autocomplete = **walk the prefix**.',
  video,
  videoArgs: [PROD, SW],
  judge: {
    type: 'fn', fn: 'suggestedProducts', params: ['String[]', 'String'], ret: 'List<List<String>>',
    tests: [{ args: [PROD, SW], out: suggest(PROD, SW) }, { args: [['havana'], 'tatiana'], out: [[], [], [], [], [], [], []] }, { args: [['bags', 'baggage', 'banner', 'box', 'cloths'], 'bags'], out: suggest(['bags', 'baggage', 'banner', 'box', 'cloths'], 'bags') }],
    gen: (r: Rng) => { const al = 'ab'; const s = new Set<string>(); for (let i = r.int(1, 8); i > 0; i--) s.add(Array.from({ length: r.int(1, 4) }, () => al[r.int(0, 1)]).join('')); return [[...s], Array.from({ length: r.int(1, 4) }, () => al[r.int(0, 1)]).join('')]; },
    ref: (p: string[], w: string) => suggest(p, w),
  },
};

export default problem;
