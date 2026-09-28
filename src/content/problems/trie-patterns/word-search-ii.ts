import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { trieViz } from '../../trieviz';

const BD = [['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']];
const WS = ['oath', 'pea', 'eat', 'rain'];
const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function findAll(board: string[][], words: string[]) {
  const R = board.length, C = board[0].length;
  const exists = (w: string) => {
    const seen = board.map((r) => r.map(() => false));
    const go = (r: number, c: number, i: number): boolean => {
      if (i === w.length) return true;
      if (r < 0 || c < 0 || r >= R || c >= C || seen[r][c] || board[r][c] !== w[i]) return false;
      seen[r][c] = true;
      const ok = D4.some(([dr, dc]) => go(r + dr, c + dc, i + 1));
      seen[r][c] = false;
      return ok;
    };
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (go(r, c, 0)) return true;
    return false;
  };
  return [...new Set(words)].filter(exists);
}

function video() {
  const v = new Video('word-search-ii', 'Word Search II');
  const R = BD.length, C = BD[0].length;
  const ans = findAll(BD, WS);
  v.chapter('intro', 'The problem');
  v.grid('g', BD, { label: 'board' });
  v.say(`Find every word from the list ${WS.join(', ')} that can be traced on the board through neighbouring cells, up, down, left or right, without reusing a cell within one word.`);
  v.eq(`found: ${ans.join(', ')}`);

  v.chapter('brute', 'Brute force: a separate Word Search per word', { cx: 'O(W · R·C · 4ᴸ)', code: ['for each word:', '  DFS from every cell, matching the word letter by letter'] });
  v.eq('the board is searched again for every word', 'bad').say('Running the single-word search once per word works, but with thousands of words the board is explored thousands of times, and words sharing a beginning redo the same paths.');

  v.chapter('optimal', 'One DFS guided by a trie of all words', { cx: 'O(R·C · 4 · 3ᴸ⁻¹)', code: ['build a trie of the words', 'DFS from each cell with a trie pointer', '  letter not a child of the pointer → prune', '  pointer at a ✓ → record the word, unmark it', '  mark cell used; recurse to 4 neighbours; unmark'] });
  v.clear();
  const g = v.grid('g', BD, { label: 'board' });
  const T = trieViz(v, 't', 'trie of words');
  WS.forEach((w) => T.insert(w));
  T.t.clearTones();
  v.layout('row').weight('g', 1).weight('t', 1.3);
  v.line(0).say('Put every word in one trie. Then do a single search over the board, carrying a pointer into the trie. A path on the board is worth continuing only while it spells a prefix of some word.');
  const found: string[] = [];
  const ends = new Set(WS);
  const used = BD.map((r) => r.map(() => false));
  let narrated = 0;
  const trail: [number, number][] = [];
  const paint = () => {
    g.clearTones();
    trail.forEach(([r, c], i) => g.tone(r, c, i === trail.length - 1 ? 'active' : 'path'));
    const p = trail.map(([r, c]) => BD[r][c]).join('');
    T.t.clearTones().tone(T.ID(''), 'path');
    for (let i = 1; i <= p.length; i++) T.t.tone(T.ID(p.slice(0, i)), 'path').edge(T.ID(p.slice(0, i - 1)), T.ID(p.slice(0, i)), 'path');
  };
  const dfs = (r: number, c: number, pre: string) => {
    const p = pre + BD[r][c];
    trail.push([r, c]);
    used[r][c] = true;
    paint();
    if (ends.has(p)) {
      ends.delete(p);
      found.push(p);
      trail.forEach(([a, b]) => g.tone(a, b, 'ok'));
      T.t.tone(T.ID(p), 'ok');
      v.line(3).counter(`found: ${found.join(', ')}`).eq(`"${p}" ends at a ✓ → found`, 'ok');
      v.say(p === 'oath' ? 'O, a, t, h: the pointer lands on a check mark. Oath is on the board. Unmark it so it is reported only once.' : `E, a, t reaches a check mark too: eat is found.`);
    } else {
      v.line(4).eq(`"${p}" is a prefix → continue`);
      if (p === 'oa' && narrated++ === 0) v.say('From o, the neighbour a spells o, a: still a prefix of oath, so keep going. Neighbours that do not continue a prefix are never even entered.'); else v.hold(500);
    }
    for (const [dr, dc] of D4) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= R || nc >= C || used[nr][nc]) continue;
      const q = p + BD[nr][nc];
      if (!T.has(q)) continue;
      dfs(nr, nc, p);
    }
    used[r][c] = false;
    trail.pop();
  };
  let prunedTold = false;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const ch = BD[r][c];
    if (!T.has(ch)) continue;
    g.clearTones(); g.tone(r, c, 'active');
    T.t.clearTones().tone(T.ID(ch), 'cmp');
    v.line(1).eq(`start at (${r},${c}) = "${ch}"`);
    if (r === 0 && c === 0) v.say('Most cells start nothing: the root only has children o, p, e and r. The first useful start is the o in the corner.');
    else v.hold(600);
    const before = found.length;
    dfs(r, c, '');
    if (found.length === before) {
      g.clearTones(); g.tone(r, c, 'bad');
      const nb = D4.map(([dr, dc]) => [r + dr, c + dc]).filter(([a, b]) => a >= 0 && b >= 0 && a < R && b < C).map(([a, b]) => BD[a][b]);
      v.line(2).eq(`"${ch}" → neighbours ${nb.join(', ')}: no trie child matches → pruned`, 'bad');
      if (!prunedTold) { prunedTold = true; v.say(`Starting from this ${ch}, none of its neighbours continues any word in the trie, so the search stops after one step instead of exploring the whole board.`); } else v.hold(700);
    }
  }
  g.clearTones(); T.t.clearTones();
  v.eq(`found: ${found.join(', ')}`, 'ok').say(`The single guided search finds ${found.join(' and ')}. Pea and rain never get past their first letters. Removing found words and pruning empty trie branches keeps later searches even shorter.`);
  v.answer(ans);

  recap(v, [{ name: 'Word Search per word', time: 'O(W · R·C · 4ᴸ)', space: 'O(L)' }, { name: 'Trie-guided DFS', time: 'O(R·C · 4 · 3ᴸ⁻¹)', space: 'O(Σ L)' }], 'One DFS serves all words; the trie prunes dead paths.', ['Find many words on a board → trie of the words + one DFS'], 'Unmark found words to avoid duplicates.');
  return v.build();
}

const problem: Problem = {
  slug: 'word-search-ii',
  statement: 'Given an `m × n` board of characters and a list of strings `words`, return all words on the board. Each word must be built from letters of sequentially adjacent cells (horizontal or vertical neighbours), and the same cell may not be used more than once in a word. Return them in any order.',
  examples: [{ input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' }, { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', output: '[]' }],
  constraints: ['1 ≤ m, n ≤ 12', '1 ≤ words.length ≤ 3 · 10⁴', '1 ≤ words[i].length ≤ 10', 'lowercase letters, words are unique'],
  hints: ['Put all words in a trie.', 'Walk the trie in step with the DFS; stop when there is no child.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Word Search per word', idea: 'Run the single-word backtracking search for every word.', time: 'O(W · R·C · 4ᴸ)', space: 'O(L)', bottleneck: 'Repeats the board search per word.' },
    { id: 'optimal', kind: 'optimal', name: 'Trie-guided DFS', idea: 'One DFS per start cell, advancing a trie pointer and pruning.', time: 'O(R·C · 4 · 3ᴸ⁻¹)', space: 'O(Σ L)' },
  ],
  takeaway: 'Many words → **one trie-guided DFS**.',
  video,
  videoArgs: [BD, WS],
  judge: {
    type: 'fn', fn: 'findWords', params: ['char[][]', 'String[]'], ret: 'List<String>', cmp: 'sorted',
    tests: [{ args: [BD, WS], out: ['eat', 'oath'] }, { args: [[['a', 'b'], ['c', 'd']], ['abcb']], out: [] }, { args: [[['a']], ['a', 'aa']], out: ['a'] }, { args: [[['a', 'b'], ['c', 'd']], ['abdc', 'acdb', 'ab', 'ba', 'bd']], out: ['abdc', 'acdb', 'ab', 'ba', 'bd'] }],
    gen: (r: Rng) => { const al = 'abc'; const R = r.int(1, 3), C = r.int(1, 3); const board = Array.from({ length: R }, () => Array.from({ length: C }, () => al[r.int(0, 2)])); const s = new Set<string>(); for (let i = r.int(1, 6); i > 0; i--) s.add(Array.from({ length: r.int(1, 4) }, () => al[r.int(0, 2)]).join('')); return [board, [...s]]; },
    ref: (b: string[][], w: string[]) => findAll(b, w),
  },
};

export default problem;
