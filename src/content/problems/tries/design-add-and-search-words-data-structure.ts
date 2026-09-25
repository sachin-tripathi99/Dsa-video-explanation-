import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { trieViz } from '../../trieviz';

const ADDS = ['bad', 'dad', 'mad'];
const QUERIES = ['pad', 'bad', '.ad', 'b..', '.ay'];

const matches = (w: string, p: string) => w.length === p.length && [...p].every((c, i) => c === '.' || c === w[i]);

function run(ops: string[], args: unknown[][]) {
  const words: string[] = [];
  return ops.map((op, i) => {
    if (op === 'WordDictionary') return null;
    const s = args[i][0] as string;
    if (op === 'addWord') { words.push(s); return null; }
    return words.some((w) => matches(w, s));
  });
}

function video() {
  const v = new Video('add-search-words', 'Design Add and Search Words Data Structure');
  v.chapter('intro', 'The problem');
  const ops = [...ADDS.map((w) => ['addWord', w]), ...QUERIES.map((q) => ['search', q])];
  const outs = run(['WordDictionary', ...ops.map((o) => o[0])], [[], ...ops.map((o) => [o[1]])]).slice(1);
  v.table('ops', ['call', 'returns'], ops.map(([op, s], i) => [`${op}("${s}")`, outs[i] === null ? '—' : String(outs[i])]));
  v.say('Like a trie, but search patterns may contain dots, and a dot matches any single letter. So dot, a, d matches bad, dad and mad.');

  v.chapter('brute', 'Brute force: compare with every word', { cx: 'O(n · L) per search', code: ['for w in words:', '  if len(w) == len(p) and every p[i] is "." or == w[i]:', '    return true', 'return false'] });
  v.clear();
  const list = v.array('l', ADDS, { label: 'stored words · pattern ".ay"', showIdx: false });
  v.say('The simple approach checks the pattern against every stored word, letter by letter.');
  ADDS.forEach((w, i) => {
    list.clearTones().ptr('w', i).tone(i, matches(w, '.ay') ? 'ok' : 'bad');
    v.line(1).eq(`"${w}" vs ".ay": ${[...'.ay'].map((c, j) => (c === '.' ? '.' : c === w[j] ? '✓' : '✗')).join(' ')}`).hold(650);
  });
  list.noPtr();
  v.eq('n words × L letters per search', 'warn').say('That is O of n times L per search, and with thousands of words it is slow. A hash set cannot help either, because a pattern with dots is not one fixed key.');

  v.chapter('optimal', 'Optimal: trie + DFS on dots', { cx: 'O(L) without dots', code: ['dfs(node, i):', '  if i == len(p): return node.isEnd', '  if p[i] == ".": return any(dfs(child, i+1) for each child)', '  child = node.children[p[i]]', '  return child != null and dfs(child, i+1)'] });
  v.clear().layout('row');
  const T = trieViz(v, 't', 'trie');
  const res = v.table('res', ['search', 'returns'], []);
  ADDS.forEach((w) => T.insert(w));
  T.t.clearTones();
  v.say('Insert the words into a trie exactly as before. Now search walks the trie. A normal letter follows one child. A dot tries every child, and backtracks if a branch fails.');

  let hit = '';
  const dfs = (pre: string, pat: string, i: number): boolean => {
    if (i === pat.length) {
      if (T.ends.has(pre)) hit = pre;
      return T.ends.has(pre);
    }
    const nd = T.t.p.nodes[T.ID(pre)];
    const kids = nd.kids.filter((k): k is string => !!k).map((k) => String(T.t.p.nodes[k].v));
    const tryKid = (c: string) => {
      const np = pre + c;
      T.t.tone(T.ID(np), 'path').edge(T.ID(pre), T.ID(np), 'path');
      v.line(pat[i] === '.' ? 2 : 3).eq(`p[${i}] = '${pat[i]}' → go to "${np}"`).hold(450);
      if (dfs(np, pat, i + 1)) return true;
      T.t.tone(T.ID(np), 'bad').edge(T.ID(pre), T.ID(np), 'none');
      v.line(pat[i] === '.' ? 2 : 3).eq(`"${np}" fails → back to "${pre || 'root'}"`, 'bad').hold(450);
      return false;
    };
    if (pat[i] === '.') { for (const c of kids) if (tryKid(c)) return true; return false; }
    if (!T.has(pre + pat[i])) {
      T.t.tone(T.ID(pre), 'bad');
      v.line(4).eq(`no '${pat[i]}' child under "${pre || 'root'}"`, 'bad').hold(500);
      return false;
    }
    return tryKid(pat[i]);
  };

  QUERIES.forEach((q, k) => {
    T.t.clearTones().tone(T.ID(''), 'path');
    res.clearTones();
    hit = '';
    const ans = dfs('', q, 0);
    if (ans) T.t.tone(T.ID(hit), 'ok');
    res.addRow([`"${q}"`, String(ans)]).clearTones().tone(res.p.rows.length - 1, ans ? 'ok' : 'bad');
    v.line(1).eq(`search("${q}") → ${ans}`, ans ? 'ok' : 'bad');
    if (k === 0) v.say('Pad: the root has no p child. We stop right away. False.');
    else if (k === 1) v.say('Bad has no dots: follow b, a, d, and the last node is a word end. True, in O of L steps.');
    else if (k === 2) v.say('Dot a d: the dot tries the first child, b. Then a, then d, which is a word end. True, found on the first branch.');
    else if (k === 3) v.say('B dot dot: follow b, then each dot branches, but there is only one child each time. It reaches bad. True.');
    else v.say('Dot a y is the interesting one. The dot tries b, then a, but there is no y, so it backtracks. Then d, a: no y. Then m, a: no y. Every branch fails, so the answer is false.');
  });
  T.t.clearTones();
  v.eq('no dots: O(L) · each dot can branch up to 26 ways', 'ok');
  v.say('Without dots, search is O of L. Each dot may branch into up to twenty-six children, but branches die as soon as a letter is missing, so in practice it is fast. And the problem limits a pattern to a few dots.');

  recap(v, [
    { name: 'Compare with every word', time: 'O(n · L)', space: 'O(total letters)' },
    { name: 'Trie + DFS on dots', time: 'O(L), up to O(26^d · L) with d dots', space: 'O(total letters)' },
  ], 'A wildcard turns the trie walk into a DFS that backtracks.', ['Wildcards over a set of words → trie + DFS'], 'Plain letters walk one path; a dot branches into every child and backtracks on failure.');
  return v.build();
}

const problem: Problem = {
  slug: 'design-add-and-search-words-data-structure',
  statement: 'Design a data structure that supports adding words and searching patterns:\n\n- `WordDictionary()` initialises it.\n- `void addWord(String word)` adds `word`.\n- `boolean search(String word)` returns `true` if any added word matches `word`. The pattern may contain dots `.`; a dot matches **any one** letter.',
  examples: [{ input: '["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\n[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]', output: '[null,null,null,null,false,true,true,true]' }],
  constraints: ['1 ≤ word.length ≤ 25', 'addWord words are lowercase letters; search patterns are lowercase letters or `.`', 'at most 2 dots per search pattern', 'at most 10⁴ calls'],
  hints: ['Start from the trie you built in Implement Trie.', 'At a dot you do not know which child to take, so try all of them.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Compare with every word', idea: 'Keep a list; a word matches if it has the same length and every non-dot character agrees.', time: 'O(n · L) per search', space: 'O(total letters)', bottleneck: 'Every search scans every word.' },
    { id: 'optimal', kind: 'optimal', name: 'Trie + DFS', idea: 'Store words in a trie. Search with `dfs(node, i)`: a letter follows one child, a dot tries every child; at the end return `isEnd`.', steps: ['addWord: standard trie insert.', 'dfs(node, i): if i == len, return node.isEnd.', 'If p[i] is a dot, return true if dfs succeeds for any child.', 'Otherwise follow the matching child, or return false if it is missing.'], time: 'O(L) without dots; O(26^d · L) worst case with d dots', space: 'O(total letters)' },
  ],
  pitfalls: ['Returning true when the path ends at a node without `isEnd`.', 'Returning after the first dot branch fails instead of trying the others.'],
  takeaway: 'Wildcards → **DFS over the trie**, branching at every `.`.',
  video,
  judge: {
    type: 'design', cls: 'WordDictionary', ctor: [],
    methods: { addWord: { params: ['String'], ret: 'void' }, search: { params: ['String'], ret: 'boolean' } },
    tests: [
      { ops: ['WordDictionary', 'addWord', 'addWord', 'addWord', 'search', 'search', 'search', 'search'], args: [[], ['bad'], ['dad'], ['mad'], ['pad'], ['bad'], ['.ad'], ['b..']], out: [null, null, null, null, false, true, true, true] },
      { ops: ['WordDictionary', 'addWord', 'search', 'search', 'search'], args: [[], ['a'], ['.'], ['a.'], ['..']], out: [null, null, true, false, false] },
    ],
    gen: (r: Rng) => {
      const word = () => Array.from({ length: r.int(1, 3) }, () => r.pick(['a', 'b', 'c'])).join('');
      const ops = ['WordDictionary'];
      const args: unknown[][] = [[]];
      for (let k = 0; k < 30; k++) {
        if (r.chance(0.4)) { ops.push('addWord'); args.push([word()]); }
        else { ops.push('search'); args.push([[...word()].map((c) => (r.chance(0.35) ? '.' : c)).join('')]); }
      }
      return { ops, args };
    },
    ref: (ops, args) => run(ops, args),
  },
};

export default problem;
