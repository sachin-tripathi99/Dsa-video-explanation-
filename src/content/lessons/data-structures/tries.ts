import type { Lesson } from '../../types';
import { Video } from '../../helpers';
import { trieViz } from '../../trieviz';

const WORDS = ['car', 'cat', 'cart', 'dog', 'do'];

function video() {
  const v = new Video('tries', 'Tries (prefix trees)');
  v.chapter('intro', 'Autocomplete');
  v.text('ac', { title: 'You type “ca”…', lines: ['car', 'cart', 'cat', 'catalog', 'cattle'], shown: 5, mono: true });
  v.say('You type c, a, into a search box and suggestions appear instantly: car, cart, cat. How can a program find every stored word starting with a prefix, without checking every word it knows?');
  v.eq('hash set: “is ‘cat’ stored?” O(L) ✓ · “any word starting with ‘ca’?” O(n · L) ✗', 'warn');
  v.say('A hash set answers “is this exact word stored?” quickly, but it has no idea which words share a prefix. It would have to scan all n words. A trie is built for exactly this.');

  v.chapter('build', 'Building a trie', { code: ['node = root', 'for ch in word:', '  if ch not in node.children: create it', '  node = node.children[ch]', 'node.isEnd = true'] });
  v.clear().layout('row');
  const T = trieViz(v, 't', 'trie');
  const w = v.array('w', WORDS, { label: 'words to insert', showIdx: false });
  v.say('A trie is a tree where each edge is one letter. The path from the root to a node spells a prefix. Words that share a prefix share the path.');
  WORDS.forEach((word, k) => {
    w.clearTones().tone(k, 'active');
    if (k === 0) {
      T.insert(word, (i) => {
        v.line(2, 3).eq(`"${word.slice(0, i + 1)}": '${word[i]}' missing → create`);
        if (i === 0) v.say('Insert car. The root has no c child, so create one and step into it.');
        else v.hold(700);
      });
      v.line(4).eq(`end of "${word}" → mark ✓`, 'ok').say('After the last letter, mark the node as the end of a word. The tick matters, as you will see.');
    } else {
      const made = T.insert(word, (i, created) => {
        v.line(created ? 2 : 3).eq(`"${word.slice(0, i + 1)}": ${created ? 'create' : 'already there → reuse'}`);
        v.hold(created ? 650 : 500);
      });
      const shared = word.length - made;
      v.line(4).eq(`"${word}": ${made} new node${made === 1 ? '' : 's'}, ${shared} shared`, made === 0 ? 'ok' : undefined);
      if (word === 'cat') v.say('Insert cat. The path c, a already exists, so we reuse it and only create t. That sharing is the whole point.');
      else if (word === 'cart') v.say('Cart walks c, a, r, which ends at the word car, and hangs a t below it. A word can be the prefix of another word.');
      else if (word === 'dog') v.say('Dog shares nothing with the others, so it starts a new branch from the root.');
      else if (word === 'do') v.say(`And do creates no nodes at all: the path already exists inside dog. We only add a tick to the o node.`);
    }
    w.tone(k, 'done');
  });
  T.t.clearTones();
  w.clearTones();

  v.chapter('search', 'Search vs. startsWith', { code: ['walk the letters from the root', 'search(w):     path exists AND last node has ✓', 'startsWith(p): path exists'] });
  v.clear().layout('row');
  const S = trieViz(v, 't', 'search');
  WORDS.forEach((x) => S.insert(x));
  S.t.clearTones();
  const res = v.table('res', ['query', 'answer'], []);
  const q = (kind: 'search' | 'startsWith', s: string, say: string) => {
    const got = S.walk(s, () => v.line(0).hold(420));
    const full = got === s.length;
    const ans = kind === 'search' ? full && S.ends.has(s) : full;
    if (full) S.t.tone(S.ID(s), ans ? 'ok' : 'warn');
    res.addRow([`${kind}("${s}")`, String(ans)]).clearTones().tone(res.p.rows.length - 1, ans ? 'ok' : 'bad');
    v.line(kind === 'search' ? 1 : 2).eq(`${kind}("${s}"): ${full ? 'path found' : `no '${s[got]}' child`} → ${ans}`, ans ? 'ok' : 'bad').say(say);
  };
  q('search', 'cat', 'Search cat: follow c, a, t. The path exists and the last node has a tick. True.');
  q('search', 'ca', 'Search ca: the path exists, but that node has no tick. Nobody inserted the word ca, so the answer is false. This is why we store the end marker.');
  q('startsWith', 'ca', 'Starts with ca only asks whether the path exists. It does, so true: some word continues from here.');
  q('search', 'cow', 'Search cow: after c, there is no o child. We stop immediately. False.');

  v.chapter('node', 'What a node stores');
  v.clear();
  v.table('nd', ['field', 'value at node “ca”'], [
    ['children[26] (or a map)', "'r' → node “car”,  't' → node “cat”,  others null"],
    ['isEnd', 'false: “ca” itself was never inserted'],
  ]);
  v.say('Each node stores its children, either as an array of twenty-six slots for lowercase letters, or as a hash map when the alphabet is large. Plus one flag: is a word ending here.');
  v.eq('insert / search / startsWith: O(L) where L = word length', 'ok').say('Every operation walks one node per letter, so it costs O of L, the length of the word, no matter how many words are stored.');
  v.note('space: O(total letters) nodes; 26 pointers each with arrays');

  v.chapter('recap', 'When to use a trie');
  v.clear();
  v.table('r', ['Need', 'Use'], [
    ['Exact lookups only', 'hash set (simpler)'],
    ['Many prefix queries / autocomplete', 'trie'],
    ['Match with wildcards like “b.d”', 'trie + DFS'],
    ['Search many words in a grid at once', 'trie + backtracking (Word Search II)'],
    ['Maximum XOR of two numbers', 'binary trie over bits'],
  ]).tone(1, 'ok');
  v.say('Reach for a trie when the question is about prefixes, when many words are searched together, or when wildcards appear. For plain exact lookups, a hash set is simpler.');
  return v.build();
}

const body = String.raw`
## The idea

A **trie** (pronounced "try", from re*trie*val) is a tree where each edge is a character. The path from the root to a node spells a **prefix**; a flag \`isEnd\` marks nodes where a whole word ends. Words that share a prefix share nodes.

> Real-life picture: autocomplete. After you type "ca", the program jumps to the "ca" node and everything below it is a suggestion.

| Operation | Trie | Hash set of words |
|---|---|---|
| insert(word) | O(L) | O(L) |
| search(word) | O(L) | O(L) |
| startsWith(prefix) | **O(L)** | O(n · L) (scan all words) |
| list all words with a prefix | O(L + output) | O(n · L) |

L is the length of the word, n the number of stored words.

## Implementation

\`\`\`java
class Trie {
    private static class Node {
        Node[] children = new Node[26];
        boolean isEnd;
    }
    private final Node root = new Node();

    public void insert(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (node.children[i] == null) node.children[i] = new Node();
            node = node.children[i];
        }
        node.isEnd = true;
    }
    private Node walk(String s) {
        Node node = root;
        for (char ch : s.toCharArray()) {
            node = node.children[ch - 'a'];
            if (node == null) return null;
        }
        return node;
    }
    public boolean search(String word) { Node n = walk(word); return n != null && n.isEnd; }
    public boolean startsWith(String prefix) { return walk(prefix) != null; }
}
\`\`\`

\`\`\`python
class Trie:
    def __init__(self):
        self.root = {}                      # char -> child dict; "$" marks end of word

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node:
                return None
            node = node[ch]
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and "$" in node

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) is not None
\`\`\`

\`\`\`cpp
class Trie {
    struct Node {
        Node* children[26] = {};
        bool isEnd = false;
    };
    Node* root = new Node();
    Node* walk(const string& s) {
        Node* node = root;
        for (char ch : s) {
            node = node->children[ch - 'a'];
            if (!node) return nullptr;
        }
        return node;
    }
public:
    void insert(const string& word) {
        Node* node = root;
        for (char ch : word) {
            int i = ch - 'a';
            if (!node->children[i]) node->children[i] = new Node();
            node = node->children[i];
        }
        node->isEnd = true;
    }
    bool search(const string& word) { Node* n = walk(word); return n && n->isEnd; }
    bool startsWith(const string& prefix) { return walk(prefix) != nullptr; }
};
\`\`\`

## Array or map for children?

- **Array of 26**: fastest, simplest, but every node pays for 26 pointers. Great for lowercase-only input.
- **Hash map**: only pays for children that exist. Use it for large alphabets (Unicode, whole words as tokens).

## When to use a trie

- Prefix queries, autocomplete, "does any word start with…".
- Searching **many words at once** (e.g. finding dictionary words in a grid): one walk explores all of them.
- **Wildcard matching** such as \`b.d\`: branch into every child at a \`.\`.
- **Bitwise tries** store numbers bit by bit to answer maximum-XOR queries.

## Pitfalls

- Forgetting the \`isEnd\` flag: then \`search("ca")\` wrongly returns true after inserting "cat".
- Memory: n words of length L can create up to n · L nodes.
`;

const lesson: Lesson = {
  slug: 'tries',
  video,
  body,
  quiz: [
    { q: 'What does the path from the root to a trie node represent?', options: ['A whole word always', 'A prefix', 'A hash value', 'The word count'], answer: 1, why: 'Each edge adds one character, so the path spells a prefix.' },
    { q: 'After inserting only "cat", what does search("ca") return?', options: ['true', 'false'], answer: 1, why: 'The path exists, but no word ends at the "ca" node.' },
    { q: 'Time for startsWith(prefix) in a trie holding n words?', options: ['O(n)', 'O(L), L = prefix length', 'O(n · L)', 'O(log n)'], answer: 1, why: 'Walk one node per character; the number of stored words does not matter.' },
    { q: 'You only ever check whether exact words exist. Best choice?', options: ['Trie', 'Hash set', 'Sorted array', 'Heap'], answer: 1, why: 'A hash set does exact lookups in O(L) with less code and memory.' },
  ],
};

export default lesson;
