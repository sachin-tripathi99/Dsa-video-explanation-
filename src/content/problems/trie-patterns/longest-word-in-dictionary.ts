import type { Problem, Rng } from '../../types';
import { Video, recap, words as spell } from '../../helpers';
import { trieViz } from '../../trieviz';

const WS = ['a', 'banana', 'app', 'appl', 'ap', 'apply', 'apple'];
function longest(ws: string[]) { const s = new Set(ws); let best = ''; for (const w of ws) { let ok = true; for (let i = 1; i < w.length; i++) if (!s.has(w.slice(0, i))) { ok = false; break; } if (ok && (w.length > best.length || (w.length === best.length && w < best))) best = w; } return best; }

function video() {
  const v = new Video('longest-word-in-dictionary', 'Longest Word in Dictionary');
  const ans = longest(WS);
  v.chapter('intro', 'The problem');
  v.array('w', WS, { label: 'words' });
  v.say('Find the longest word that can be built one letter at a time, where every step along the way is itself a word in the list. Ties go to the alphabetically smallest.');
  v.eq(`answer: "${ans}"`);
  v.say('Apple works: a, ap, app, appl, apple are all words. Banana does not: b is not a word.');

  v.chapter('brute', 'Brute force: check every prefix of every word', { cx: 'O(Σ L²)', code: ['set = all words', 'for each word: all prefixes in the set?', 'keep the longest, ties → smaller'] });
  v.eq('builds every prefix string', 'warn').say('Put the words in a set and, for each word, check all its prefixes. It works, but builds up to L prefix strings per word.');

  v.chapter('optimal', 'Trie + DFS through ✓ nodes only', { cx: 'O(Σ L)', code: ['insert every word', 'DFS from the root, entering a child only if it is a ✓', 'the deepest node reached (first in letter order) is the answer'] });
  v.clear();
  const T = trieViz(v, 't', 'trie · green = buildable');
  WS.forEach((w) => T.insert(w));
  T.t.clearTones();
  v.line(0).say('Insert every word. A word is buildable exactly when every node on its path carries a check mark.');
  let best = '';
  let told = 0;
  const dfs = (p: string) => {
    for (const k of [...T.t.p.nodes[T.ID(p)].kids]) {
      const c = p + String(T.t.p.nodes[k!].v);
      if (!T.ends.has(c)) {
        T.t.tone(T.ID(c), 'bad');
        v.line(1).eq(`"${c}" is not a word → do not enter`, 'bad');
        if (told++ === 0) v.say(`${c[0].toUpperCase()}${c.slice(1)} is not a word, so nothing below it can be built one letter at a time. The whole ${c} branch is skipped.`); else v.hold(700);
        continue;
      }
      T.t.tone(T.ID(c), 'ok').edge(T.ID(p), T.ID(c), 'ok');
      const better = c.length > best.length;
      if (better) best = c;
      v.line(1, 2).counter(`best: "${best}"`).eq(`"${c}" ✓${better ? ' → new longest' : ''}`, 'ok');
      if (c === 'a') v.say('The DFS only steps into nodes that end a word. A is a word, so enter it.'); else v.hold(600);
      dfs(c);
    }
  };
  dfs('');
  v.line(2).eq(`answer: "${best}"`, 'ok').say(`The deepest buildable word is ${best}, ${spell(best.length)} letters. Visiting children in alphabetical order and only replacing the best on a strictly longer word gives the smallest word among ties automatically.`);
  v.answer(ans);

  recap(v, [{ name: 'Prefix checks with a set', time: 'O(Σ L²)', space: 'O(Σ L)' }, { name: 'Sort + set, grow words', time: 'O(Σ L log n)', space: 'O(Σ L)' }, { name: 'Trie + DFS through ✓', time: 'O(Σ L)', space: 'O(Σ L)' }], 'Buildable = every node on the path is a word end.', ['Words built letter by letter → DFS a trie through end nodes only'], 'Alphabetical child order handles ties.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-word-in-dictionary',
  statement: 'Given an array `words`, return the longest word that can be built one character at a time by other words in `words` (every prefix of it must be in the list). If there are several, return the lexicographically smallest; if there is none, return the empty string.',
  examples: [{ input: 'words = ["w","wo","wor","worl","world"]', output: '"world"' }, { input: 'words = ["a","banana","app","appl","ap","apply","apple"]', output: '"apple"' }],
  constraints: ['1 ≤ words.length ≤ 1000', '1 ≤ words[i].length ≤ 30', 'lowercase letters'],
  hints: ['A word is buildable if every prefix is also a word.', 'In a trie: every node on the path is an end node.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Prefix checks', idea: 'For each word, check all prefixes in a set.', time: 'O(Σ L²)', space: 'O(Σ L)', bottleneck: 'Builds all prefixes.' },
    { id: 'optimal', kind: 'optimal', name: 'Trie + DFS', idea: 'DFS through end-of-word nodes only; deepest wins.', time: 'O(Σ L)', space: 'O(Σ L)' },
  ],
  takeaway: 'Only walk through **✓ nodes**.',
  video,
  videoArgs: [WS],
  judge: {
    type: 'fn', fn: 'longestWord', params: ['String[]'], ret: 'String',
    tests: [{ args: [['w', 'wo', 'wor', 'worl', 'world']], out: 'world' }, { args: [WS], out: 'apple' }, { args: [['b', 'ba', 'a', 'ab']], out: 'ab' }, { args: [['yo', 'ew', 'fc']], out: '' }],
    gen: (r: Rng) => { const al = 'ab'; const s = new Set<string>(); for (let i = r.int(1, 10); i > 0; i--) s.add(Array.from({ length: r.int(1, 4) }, () => al[r.int(0, 1)]).join('')); return [[...s]]; },
    ref: (ws: string[]) => longest(ws),
  },
};

export default problem;
