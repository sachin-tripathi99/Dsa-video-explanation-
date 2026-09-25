import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { trieViz } from '../../trieviz';

const OPS: [string, string][] = [['insert', 'apple'], ['search', 'apple'], ['search', 'app'], ['startsWith', 'app'], ['insert', 'app'], ['search', 'app']];

function run(ops: string[], args: unknown[][]) {
  const words = new Set<string>();
  return ops.map((op, i) => {
    const s = args[i][0] as string;
    if (op === 'Trie') return null;
    if (op === 'insert') { words.add(s); return null; }
    if (op === 'search') return words.has(s);
    return [...words].some((w) => w.startsWith(s));
  });
}

function video() {
  const v = new Video('implement-trie', 'Implement Trie (Prefix Tree)');
  v.chapter('intro', 'The problem');
  const outs = run(OPS.map((o) => o[0]), OPS.map((o) => [o[1]]));
  v.table('ops', ['call', 'returns'], OPS.map(([op, s], i) => [`${op}("${s}")`, outs[i] === null ? '—' : String(outs[i])]));
  v.say('Build a class with three methods. Insert stores a word. Search asks whether that exact word was inserted. Starts with asks whether any inserted word begins with a prefix.');
  v.say('Notice search app is false after inserting apple, but starts with app is true. After we also insert app, search app becomes true.');

  v.chapter('brute', 'Brute force: a list of words', { cx: 'O(n · L) per query', code: ['insert: words.append(w)', 'search: any(x == w for x in words)', 'startsWith: any(x.startswith(p) for x in words)'] });
  v.clear();
  const list = v.array('l', ['apple', 'apply', 'ape', 'bat', 'ball', 'band'], { label: 'words stored so far', showIdx: false });
  v.say('The simplest idea: keep every word in a list, and for each query compare against all of them.');
  const P = 'ban';
  for (let i = 0; i < 6; i++) {
    const hit = list.get(i)!.toString().startsWith(P);
    list.clearTones().ptr('i', i).tone(i, hit ? 'ok' : 'cmp');
    for (let k = 0; k < i; k++) list.tone(k, 'dim');
    v.line(2).eq(`startsWith("${P}"): "${list.get(i)}" ${hit ? '✓' : '✗'}`, hit ? 'ok' : undefined).counter(`words checked: ${i + 1}`);
    if (i === 0) v.say(`Starts with ${P.split('').join(', ')}: check each stored word in turn.`);
    else if (hit) v.say('Found at the very end, after checking every word. With n words of length L, each query costs O of n times L.');
    else v.hold(420);
  }
  list.noPtr();

  v.chapter('better', 'Better: hash sets of words and prefixes', { cx: 'O(L) query, O(L²) insert', code: ['insert(w): words.add(w)', '  for i in 1..len(w): prefixes.add(w[:i])', 'search(w): w in words', 'startsWith(p): p in prefixes'] });
  v.clear().layout('row');
  const ws = v.map('ws', { set: true, label: 'words' });
  const ps = v.map('ps', { set: true, label: 'prefixes' });
  ws.put('apple');
  v.line(0).say('What if we precompute every prefix? Insert apple adds apple to a words set, and also every prefix of it to a prefixes set.');
  for (let i = 1; i <= 5; i++) {
    ps.put('apple'.slice(0, i)).clearTones().tone('apple'.slice(0, i), 'active');
    v.line(1).eq(`prefixes.add("${'apple'.slice(0, i)}")`).hold(450);
  }
  ps.clearTones().tone('app', 'ok');
  v.line(2, 3).eq('search("app"): not in words → false · startsWith("app"): in prefixes → true', 'ok');
  v.say('Now both queries are single hash lookups. Search app is false because app is not in the words set, and starts with app is true.');
  v.eq('insert copies L prefixes of up to L letters → O(L²) time and memory', 'warn');
  v.say('But every insert creates L separate prefix strings, costing L squared time and memory. And words sharing a prefix, like apple and apply, store it twice.');

  v.chapter('optimal', 'Optimal: a trie shares the prefixes', { cx: 'O(L) every operation', code: ['insert: walk, creating missing nodes; mark end', 'search: walk; true if path exists and node.isEnd', 'startsWith: walk; true if path exists'] });
  v.clear().layout('row');
  const T = trieViz(v, 't', 'trie');
  const res = v.table('res', ['call', 'returns'], []);
  v.say('A trie stores each shared prefix once, as a path of nodes. Let us run the calls.');
  OPS.forEach(([op, s], k) => {
    if (op === 'insert') {
      const made = T.insert(s, () => v.line(0).hold(380));
      res.addRow([`insert("${s}")`, '—']).clearTones().tone(res.p.rows.length - 1, 'active');
      v.line(0).eq(`insert("${s}"): ${made} new node${made === 1 ? '' : 's'}, mark ✓ on "${s}"`, 'ok');
      if (k === 0) v.say('Insert apple creates five nodes, one per letter, and marks the last one as a word end.');
      else v.say(`Insert ${s} creates no new nodes. The path is already there inside apple, so we only add the end mark.`);
    } else {
      const got = T.walk(s, () => v.line(op === 'search' ? 1 : 2).hold(330));
      const full = got === s.length;
      const ans = op === 'search' ? full && T.ends.has(s) : full;
      if (full) T.t.tone(T.ID(s), ans ? 'ok' : 'warn');
      res.addRow([`${op}("${s}")`, String(ans)]).clearTones().tone(res.p.rows.length - 1, ans ? 'ok' : 'bad');
      v.line(op === 'search' ? 1 : 2).eq(`${op}("${s}") → ${ans}${op === 'search' && full && !ans ? ': path exists, no ✓' : ''}`, ans ? 'ok' : 'bad');
      if (k === 1) v.say('Search apple walks five letters and lands on a marked node. True.');
      else if (k === 2) v.say('Search app walks three letters, but that node has no end mark. False.');
      else if (k === 3) v.say('Starts with app only needs the path to exist. True.');
      else v.say('Now the app node carries an end mark, so search app is true.');
    }
  });
  T.t.clearTones();
  v.eq('each call touches one node per letter: O(L) · shared prefixes stored once', 'ok');
  v.say('Every call walks at most L nodes, and apple and app share one path. That is why tries power autocomplete.');

  recap(v, [
    { name: 'List of words', time: 'O(n · L) query', space: 'O(total letters)' },
    { name: 'Hash sets of words + prefixes', time: 'O(L) query, O(L²) insert', space: 'O(Σ L²)' },
    { name: 'Trie', time: 'O(L) all ops', space: 'O(total letters)' },
  ], 'A trie makes prefix queries as cheap as the prefix itself.', ['“startsWith” / prefix queries', 'Autocomplete, dictionary of words'], 'When a problem talks about prefixes of many words, think trie.');
  return v.build();
}

const problem: Problem = {
  slug: 'implement-trie-prefix-tree',
  statement: 'Implement the `Trie` class:\n\n- `Trie()` initialises an empty trie.\n- `void insert(String word)` inserts `word`.\n- `boolean search(String word)` returns `true` if `word` was inserted before.\n- `boolean startsWith(String prefix)` returns `true` if some previously inserted word starts with `prefix`.',
  examples: [{ input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', output: '[null,null,true,false,true,null,true]' }],
  constraints: ['1 ≤ word.length, prefix.length ≤ 2000', 'lowercase English letters only', 'at most 3 · 10⁴ calls'],
  hints: ['Each node needs up to 26 children and one extra piece of information.', 'search and startsWith walk the same way; they differ only at the last node.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'List of words', idea: 'Store words in a list and compare every query against every word.', time: 'O(n · L) per query', space: 'O(total letters)', bottleneck: 'Each query scans all n words.' },
    { id: 'better', kind: 'better', name: 'Hash sets of words and prefixes', idea: 'Insert adds the word to `words` and each of its L prefixes to `prefixes`; queries are one set lookup.', time: 'O(L) query, O(L²) insert', space: 'O(Σ L²)', bottleneck: 'Copies every prefix string; shared prefixes are stored repeatedly.' },
    { id: 'optimal', kind: 'optimal', name: 'Trie', idea: 'Nodes with 26 child pointers and an `isEnd` flag. Walk one node per character.', steps: ['insert: create missing children along the word; set `isEnd` on the last node.', 'walk(s): follow children; return null if one is missing.', 'search: `walk(word)` exists and `isEnd`.', 'startsWith: `walk(prefix)` exists.'], time: 'O(L) per operation', space: 'O(total letters × 26)' },
  ],
  pitfalls: ['Forgetting `isEnd`, so `search("app")` returns true after inserting only "apple".', 'Allocating the 26 children lazily (null until used) keeps memory manageable.'],
  takeaway: 'A trie node = **children + isEnd**. search and startsWith share one walk.',
  video,
  judge: {
    type: 'design', cls: 'Trie', ctor: [],
    methods: { insert: { params: ['String'], ret: 'void' }, search: { params: ['String'], ret: 'boolean' }, startsWith: { params: ['String'], ret: 'boolean' } },
    tests: [{ ops: ['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search'], args: [[], ['apple'], ['apple'], ['app'], ['app'], ['app'], ['app']], out: [null, null, true, false, true, null, true] }],
    gen: (r: Rng) => {
      const word = () => Array.from({ length: r.int(1, 4) }, () => r.pick(['a', 'b', 'c'])).join('');
      const ops = ['Trie'];
      const args: unknown[][] = [[]];
      for (let k = 0; k < 30; k++) { const op = r.pick(['insert', 'insert', 'search', 'startsWith']); ops.push(op); args.push([word()]); }
      return { ops, args };
    },
    ref: (ops, args) => run(ops, args),
  },
};

export default problem;
