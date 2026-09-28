import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const BEGIN = 'hit', END = 'cog';
const LIST = ['hot', 'dot', 'dog', 'lot', 'log', 'cog'];
function ladder(b: string, e: string, list: string[]) { const set = new Set(list); if (!set.has(e)) return 0; let level = [b]; const seen = new Set([b]); let d = 1; while (level.length) { const next: string[] = []; for (const w of level) { if (w === e) return d; for (let i = 0; i < w.length; i++) for (let ch = 97; ch <= 122; ch++) { const x = w.slice(0, i) + String.fromCharCode(ch) + w.slice(i + 1); if (set.has(x) && !seen.has(x)) { seen.add(x); next.push(x); } } } level = next; d++; } return 0; }

function video() {
  const v = new Video('word-ladder', 'Word Ladder');
  v.chapter('intro', 'The problem');
  v.array('w', LIST, { label: `wordList · begin "${BEGIN}" · end "${END}"` });
  v.say(`Transform ${BEGIN} into ${END} by changing one letter at a time, where every intermediate word must be in the word list. Return the number of words in the shortest such sequence, counting both ends, or zero if it is impossible.`);
  v.eq(`answer: ${ladder(BEGIN, END, LIST)} (hit → hot → dot → dog → cog)`);

  v.chapter('graph', 'It is a shortest path on a hidden graph');
  v.clear();
  const all = [BEGIN, ...LIST];
  const pos: Record<string, [number, number]> = { hit: [8, 50], hot: [26, 50], dot: [46, 25], lot: [46, 75], dog: [68, 25], log: [68, 75], cog: [90, 50] };
  const edges: { a: string; b: string }[] = [];
  const diff1 = (a: string, b: string) => [...a].filter((ch, i) => ch !== b[i]).length === 1;
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) if (diff1(all[i], all[j])) edges.push({ a: all[i], b: all[j] });
  v.graph('g', all.map((w) => ({ id: w, label: w, x: pos[w][0], y: pos[w][1] })), edges, { label: 'words are nodes; one-letter changes are edges' });
  v.say('Treat each word as a node, and connect two words when they differ in exactly one letter. Every step costs the same, so the shortest transformation is a breadth-first search from the start word. The only question is how to find a word’s neighbours quickly.');

  v.chapter('brute', 'Neighbours by comparing with every word', { cx: 'O(N² · L)', code: ['for each word popped from the queue:', '  compare it with every word in the list (L letters each)', '  one difference → neighbour'] });
  v.eq('N words × N comparisons × L letters', 'warn').say('Comparing each popped word with every word in the list costs N times L per word, and N squared times L overall. With five thousand words that is too slow.');

  v.chapter('optimal', 'Neighbours by changing each letter', { cx: 'O(N · L · 26)', code: ['words = set(wordList)', 'for each position i and each letter a..z:', '  candidate = word with letter i replaced', '  in the set and unseen → next level'] });
  v.clear();
  const g = v.graph('g', all.map((w) => ({ id: w, label: w, x: pos[w][0], y: pos[w][1] })), edges, { label: 'BFS levels' });
  const seen = new Set([BEGIN]);
  let level = [BEGIN];
  let d = 1;
  g.tone(BEGIN, 'active'); g.badge(BEGIN, 1);
  v.line(0).say(`Put the words in a hash set. To find neighbours of a word, change each of its L letters to each of the twenty-six letters and look the result up: twenty-six times L lookups, independent of the list size. Start BFS at ${BEGIN}, level one.`);
  let told = 0;
  while (level.length) {
    const next: string[] = [];
    for (const w of level) for (let i = 0; i < w.length; i++) for (let ch = 97; ch <= 122; ch++) { const x = w.slice(0, i) + String.fromCharCode(ch) + w.slice(i + 1); if (LIST.includes(x) && !seen.has(x)) { seen.add(x); next.push(x); } }
    if (!next.length) break;
    d++;
    g.clearTones(); seen.forEach((x) => g.tone(x, 'done')); next.forEach((x) => { g.tone(x, x === END ? 'ok' : 'active'); g.badge(x, d); });
    v.line(1, 2, 3).counter(`level ${d}`).eq(`level ${d}: ${next.join(', ')}`, next.includes(END) ? 'ok' : undefined);
    if (told === 0) { v.say(`From hit, changing the middle letter to o gives hot, which is in the list. Nothing else works. Level two is just hot.`); told++; }
    else if (next.includes(END)) { v.say(`Level ${words(d)} contains cog, the target. The shortest sequence has ${words(d)} words.`); break; }
    else v.hold(900);
    level = next;
  }
  v.answer(ladder(BEGIN, END, LIST));

  recap(v, [{ name: 'Compare with every word', time: 'O(N² · L)', space: 'O(N)' }, { name: 'Change each letter + set lookup', time: 'O(N · L · 26)', space: 'O(N)' }], 'BFS on an implicit graph; generate neighbours letter by letter.', ['Minimum number of single-step transformations → BFS on states'], 'Generate neighbours instead of searching for them. Bidirectional BFS speeds it up further.');
  return v.build();
}

const problem: Problem = {
  slug: 'word-ladder',
  statement: 'Given `beginWord`, `endWord` and a `wordList`, return the number of words in the shortest transformation sequence from beginWord to endWord, changing one letter at a time, where every intermediate word is in wordList (beginWord need not be). Return 0 if no sequence exists.',
  examples: [{ input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5' }, { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0' }],
  constraints: ['1 ≤ L ≤ 10', '1 ≤ wordList.length ≤ 5000', 'lowercase letters'],
  hints: ['Words are nodes, one-letter changes are edges.', 'Generate neighbours by changing each letter.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Compare with every word', idea: 'BFS; neighbours found by comparing against the whole list.', time: 'O(N² · L)', space: 'O(N)', bottleneck: 'N² comparisons.' },
    { id: 'optimal', kind: 'optimal', name: 'Generate neighbours', idea: 'BFS; try all 26 letters at each position and check a hash set.', time: 'O(N · L · 26)', space: 'O(N)' },
  ],
  pitfalls: ['If endWord is not in the list, the answer is 0.'],
  takeaway: 'BFS on an **implicit graph**.',
  video,
  videoArgs: [BEGIN, END, LIST],
  judge: {
    type: 'fn', fn: 'ladderLength', params: ['String', 'String', 'List<String>'], ret: 'int',
    tests: [{ args: [BEGIN, END, LIST], out: 5 }, { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], out: 0 }, { args: ['a', 'c', ['a', 'b', 'c']], out: 2 }],
    gen: (r: Rng) => { const L = r.int(1, 3); const mk = () => r.str(L, 'abc'); const list = Array.from({ length: r.int(1, 10) }, mk); const b = mk(); let e = r.pick(list); if (e === b) e = mk(); return [b, e, list]; },
    ref: (b: string, e: string, list: string[]) => (b === e ? (new Set(list).has(e) ? 1 : 0) : ladder(b, e, list)),
  },
};

export default problem;
