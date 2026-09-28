import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { trieViz } from '../../trieviz';

const DICT = ['cat', 'bat', 'rat'];
const SENT = 'the cattle was rattled by the battery';
function replace(dict: string[], s: string) { return s.split(' ').map((w) => { let best = w; for (const d of dict) if (w.startsWith(d) && d.length < best.length) best = d; return best; }).join(' '); }

function video() {
  const v = new Video('replace-words', 'Replace Words');
  const ans = replace(DICT, SENT);
  v.chapter('intro', 'The problem');
  v.array('s', SENT.split(' '), { label: 'sentence' });
  v.say(`A dictionary holds roots: ${DICT.join(', ')}. In the sentence, replace every word that starts with a root by that root. If several roots fit, use the shortest.`);
  v.eq(`→ "${ans}"`);

  v.chapter('brute', 'Brute force: every prefix of every word in a set', { cx: 'O(Σ L²)', code: ['roots = set(dictionary)', 'for each word: for i = 1..len: if word[:i] in roots → replace', 'first hit is the shortest'] });
  v.eq('each word builds up to L prefix strings', 'warn').say('Put the roots in a hash set and try every prefix of each word, shortest first. Each prefix is a new string to build and hash, so a word of length L costs about L squared.');

  v.chapter('optimal', 'Trie of roots: one walk per word, stop at the first ✓', { cx: 'O(Σ L)', code: ['insert every root into a trie', 'for each word: walk letter by letter', '  hit a ✓ → replace with that prefix', '  missing letter → keep the word'] });
  v.clear();
  const T = trieViz(v, 't', 'trie of roots');
  DICT.forEach((d) => T.insert(d));
  T.t.clearTones();
  const out = v.array('o', SENT.split(' '), { label: 'result' });
  v.weight('t', 2).weight('o', 1);
  v.line(0).say('Insert the roots into a trie. Now each sentence word is a single walk from the root, stopping at the first check mark.');
  SENT.split(' ').forEach((w, i) => {
    let root = '';
    T.t.clearTones().tone(T.ID(''), 'path');
    let j = 0;
    for (; j < w.length; j++) {
      const p = w.slice(0, j + 1);
      if (!T.has(p)) { T.t.tone(T.ID(w.slice(0, j)), 'bad'); break; }
      T.t.tone(T.ID(p), 'path').edge(T.ID(w.slice(0, j)), T.ID(p), 'path');
      if (T.ends.has(p)) { root = p; T.t.tone(T.ID(p), 'ok'); break; }
    }
    out.clearTones().tone(i, root ? 'ok' : 'cmp');
    if (root) out.set(i, root);
    v.line(1, root ? 2 : 3).counter(`word ${i + 1}/${SENT.split(' ').length}`).eq(root ? `"${w}" → ✓ at "${root}" → replace` : `"${w}": ${j === 0 ? `no root starts with "${w[0]}"` : `"${w.slice(0, j + 1)}" is not in the trie`} → keep`, root ? 'ok' : undefined);
    if (i === 0) v.say(`The: no root starts with t, so the walk fails immediately and the word stays.`);
    else if (i === 1) v.say(`Cattle: c, a, t, and t carries a check mark. Stop right there and replace the word with cat, without reading the rest of it.`);
    else v.hold(800);
  });
  out.clearTones();
  v.eq(`"${ans}"`, 'ok').say('Every word is read at most once, letter by letter, so the total work is linear in the length of the sentence plus the dictionary.');
  v.answer(ans);

  recap(v, [{ name: 'Prefix set lookups', time: 'O(Σ L²)', space: 'O(D)' }, { name: 'Trie of roots', time: 'O(Σ L)', space: 'O(D)' }], 'Shortest dictionary prefix = first ✓ on the walk.', ['Replace by shortest prefix / root → trie walk, stop at first end'], 'Stop early: the first ✓ is already the shortest.');
  return v.build();
}

const problem: Problem = {
  slug: 'replace-words',
  statement: 'Given a `dictionary` of roots and a `sentence` of space-separated words, replace every word that has a root as a prefix with that root. If several roots match, use the shortest. Return the new sentence.',
  examples: [{ input: 'dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"', output: '"the cat was rat by the bat"' }, { input: 'dictionary = ["a","b","c"], sentence = "aadsfasf absbs bbab cadsfafs"', output: '"a a b c"' }],
  constraints: ['1 ≤ dictionary.length ≤ 1000', '1 ≤ dictionary[i].length ≤ 100', 'sentence has at most 10⁶ characters, lowercase words separated by single spaces'],
  hints: ['Put the roots in a trie.', 'Walk each word and stop at the first end-of-word node.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Prefix set', idea: 'Try each prefix of each word against a hash set, shortest first.', time: 'O(Σ L²)', space: 'O(D)', bottleneck: 'Builds every prefix string.' },
    { id: 'optimal', kind: 'optimal', name: 'Trie of roots', idea: 'Walk each word in the trie; the first ✓ is the answer.', time: 'O(Σ L)', space: 'O(D)' },
  ],
  takeaway: 'Shortest root = **first ✓** on the walk.',
  video,
  videoArgs: [DICT, SENT],
  judge: {
    type: 'fn', fn: 'replaceWords', params: ['List<String>', 'String'], ret: 'String',
    tests: [{ args: [DICT, SENT], out: 'the cat was rat by the bat' }, { args: [['a', 'b', 'c'], 'aadsfasf absbs bbab cadsfafs'], out: 'a a b c' }, { args: [['catt', 'cat', 'bat', 'rat'], 'the cattle was rattled by the battery'], out: 'the cat was rat by the bat' }, { args: [['ab'], 'a ab abc'], out: 'a ab ab' }],
    gen: (r: Rng) => { const al = 'abc'; const w = () => Array.from({ length: r.int(1, 5) }, () => al[r.int(0, 2)]).join(''); return [Array.from({ length: r.int(1, 4) }, () => w().slice(0, r.int(1, 3))), Array.from({ length: r.int(1, 6) }, w).join(' ')]; },
    ref: (d: string[], s: string) => replace(d, s),
  },
};

export default problem;
