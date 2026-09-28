import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { trieViz } from '../../trieviz';

const W = ['car', 'cart', 'care', 'cat', 'dog'];
const NUMS = [5, 2, 7];
const B = 3;
const bits = (x: number) => x.toString(2).padStart(B, '0');

function video() {
  const v = new Video('trie-patterns', 'Solving problems with tries');

  v.chapter('intro', 'A trie stores every prefix once');
  const T = trieViz(v, 't', 'trie of the dictionary');
  v.say('A trie stores words letter by letter along paths from the root. Words that share a beginning share the same path, so every prefix exists exactly once, and a check mark shows where a word ends.');
  W.forEach((w, i) => {
    T.insert(w);
    v.eq(`insert "${w}"`).counter(`${i + 1}/${W.length} words · ${T.nodeCount() - 1} letters`);
    if (i === 1) v.say('Cart reuses the whole path of car and adds a single node for t.'); else v.hold(700);
  });
  T.t.clearTones();
  v.say('Once the trie is built, a question about a prefix costs only the length of the prefix, however many words there are. Four patterns come up again and again.');

  v.chapter('prefix', 'Pattern 1: walk a prefix, then explore below it', { code: ['node = walk(prefix)', 'DFS below node in letter order', 'collect words at ✓ nodes'] });
  const P = 'car';
  T.walk(P);
  v.line(0).eq(`walk "${P}"`).say(`Autocomplete: walk the prefix ${P.split('').join(', ')}. Everything below that node starts with the prefix.`);
  const found: string[] = [];
  const dfs = (p: string) => {
    if (T.ends.has(p)) { found.push(p); T.t.tone(T.ID(p), 'ok'); }
    for (const k of [...(T.t.p.nodes[T.ID(p)].kids)]) dfs(p + String(T.t.p.nodes[k!].v));
  };
  dfs(P);
  v.line(1, 2).eq(`suggestions: ${found.join(', ')}`, 'ok').say(`A DFS below it, visiting children in alphabetical order, lists ${found.join(', ')} already sorted. Search suggestion problems stop after the first few.`);

  v.chapter('shortest', 'Pattern 2: stop at the first word end', { code: ['walk the word letter by letter', 'first ✓ on the way = shortest dictionary prefix', 'no letter / no ✓ → keep the word'] });
  const Q = 'cartoon';
  let stop = -1;
  T.t.clearTones().tone(T.ID(''), 'path');
  for (let i = 0; i < Q.length; i++) {
    const p = Q.slice(0, i + 1);
    if (!T.has(p)) break;
    T.t.tone(T.ID(p), 'path').edge(T.ID(Q.slice(0, i)), T.ID(p), 'path');
    if (T.ends.has(p)) { stop = i; T.t.tone(T.ID(p), 'ok'); break; }
  }
  v.line(1).eq(`"${Q}" → shortest root "${Q.slice(0, stop + 1)}"`, 'ok').say(`Replace words wants the shortest dictionary word that starts a given word. Walk ${Q} and stop at the very first check mark: car. One walk per word, no substring copies.`);

  v.chapter('grid', 'Pattern 3: a trie guides a search');
  v.clear();
  v.text('tx', { title: 'Trie + DFS on a board (Word Search II)', lines: ['Put all target words in one trie', 'DFS from every cell, moving the trie pointer with each letter', 'The next letter has no child → stop this path immediately', 'Reaching a ✓ → found a word; remove it so it is reported once'], shown: 4 });
  v.say('When you search for many words at once, for example on a letter board, put them all in one trie and walk it in step with the search. The moment the path spells something that is not a prefix of any word, stop. One search serves every word at once.');

  v.chapter('xor', 'Pattern 4: a trie of bits maximises XOR', { code: ['insert each number’s bits, highest first', 'query x: at each level prefer the opposite bit', 'opposite exists → that bit of the XOR is 1'] });
  v.clear();
  const X = trieViz(v, 'b', `bit trie (${B} bits)`);
  NUMS.forEach((x) => X.insert(bits(x)));
  X.t.clearTones();
  v.line(0).eq(`inserted ${NUMS.map((x) => `${x}=${bits(x)}`).join(', ')}`).say(`Tries work on bits too. Insert each number as its binary digits, highest bit first: ${NUMS.map((x) => words(x)).join(', ')}.`);
  const q = 2;
  const qb = bits(q);
  let path = '', xr = 0;
  X.t.clearTones().tone(X.ID(''), 'path');
  for (let i = 0; i < B; i++) {
    const want = qb[i] === '0' ? '1' : '0';
    const go = X.has(path + want) ? want : qb[i];
    X.t.tone(X.ID(path + go), go === want ? 'ok' : 'warn').edge(X.ID(path), X.ID(path + go), 'path');
    path += go;
    if (go === want) xr |= 1 << (B - 1 - i);
    v.line(1, 2).eq(`bit ${B - 1 - i}: x has ${qb[i]}, want ${want} → ${go === want ? 'found, XOR bit = 1' : 'missing, XOR bit = 0'}`, go === want ? 'ok' : 'warn');
    if (i === 0) v.say(`To maximise ${q} XOR something, look at the highest bit first. ${q} has ${qb[0]} there, so we want a ${want}: a one in the highest bit beats anything the lower bits can add. The trie says it exists.`);
    else v.hold(900);
  }
  const partner = parseInt(path, 2);
  v.eq(`best partner for ${q} is ${partner}: ${q} XOR ${partner} = ${xr}`, 'ok').say(`Following the greedy choices leads to ${words(partner)}, and ${words(q)} XOR ${words(partner)} is ${words(xr)}. Each query costs one step per bit, instead of comparing with every number.`);

  v.chapter('table', 'When to reach for a trie');
  v.clear();
  v.table('t', ['Clue', 'Trie pattern'], [
    ['autocomplete / suggestions for a prefix', 'walk the prefix, DFS below'],
    ['replace by the shortest root / prefix', 'walk, stop at the first ✓'],
    ['words built one letter at a time', 'DFS only through ✓ nodes'],
    ['find many words on a board', 'trie of the words guides one DFS'],
    ['maximum XOR of pairs', 'bit trie, prefer the opposite bit'],
  ]);
  v.say('If a problem involves many strings and their prefixes, or bits compared from the top, a trie is usually the tool.');
  return v.build();
}

const body = String.raw`
## The idea

A trie stores strings character by character, so all words sharing a prefix share one path. Any prefix question costs **O(length of the prefix)**, independent of how many words are stored.

> Real-life picture: a phone's autocomplete. After "ca" it only looks inside the "ca" branch.

## Node

\`\`\`java
class Node {
    Node[] next = new Node[26];
    boolean end;                  // or: String word, int count, List<String> top3
}
\`\`\`

\`\`\`python
class Node:
    def __init__(self):
        self.next = {}
        self.end = False
\`\`\`

\`\`\`cpp
struct Node {
    Node* next[26] = {};
    bool end = false;
};
\`\`\`

## The four patterns

1. **Prefix, then explore**: walk the prefix, DFS below it in letter order (search suggestions).
2. **First end on the way**: walk a word and stop at the first \`end\` node (replace words).
3. **Trie-guided search**: walk the trie in step with a DFS; prune as soon as there is no child (word search II).
4. **Bit trie**: insert numbers bit by bit from the top; for each query prefer the opposite bit (maximum XOR).

## Useful extras on a node

- \`word\`: store the whole word at its end node, so a DFS can report it without rebuilding it.
- \`count\`: how many words pass through, for "how many words start with…".
- \`top3\`: precomputed suggestions for autocomplete.

## Pitfalls

- A 26-slot array per node is fast but memory-hungry; a map saves space for sparse alphabets.
- In Word Search II, remove or unmark a found word to avoid duplicates, and prune empty branches to speed up the search.
- Bit tries need a fixed width (e.g. 31 bits for non-negative ints), highest bit first.
`;

const lesson: Lesson = {
  slug: 'trie-patterns',
  video,
  body,
  quiz: [
    { q: 'Cost of checking whether any stored word starts with a prefix of length L?', options: ['O(number of words)', 'O(L)', 'O(L²)', 'O(1)'], answer: 1, why: 'Walk L nodes from the root.' },
    { q: 'Max XOR with a bit trie: at each bit you prefer…', options: ['the same bit', 'the opposite bit', 'always 1', 'always 0'], answer: 1, why: 'Opposite bits XOR to 1, and higher bits dominate.' },
    { q: 'Why build one trie of all words in Word Search II?', options: ['to sort them', 'so one DFS checks every word and prunes dead prefixes', 'to save the board', 'it is required by the problem'], answer: 1, why: 'The walk stops as soon as no word has the current prefix.' },
    { q: 'Replace words with their shortest dictionary root: when do you stop walking?', options: ['at the end of the word', 'at the first end-of-word node', 'at the deepest node', 'never'], answer: 1, why: 'The first end marker is the shortest root.' },
  ],
};

export default lesson;
