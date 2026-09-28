import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const X = 'intention', Y = 'execution';
function tbl(x: string, y: string) { const d = Array.from({ length: x.length + 1 }, (_, i) => Array.from({ length: y.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))); for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) d[i][j] = x[i - 1] === y[j - 1] ? d[i - 1][j - 1] : 1 + Math.min(d[i - 1][j - 1], d[i - 1][j], d[i][j - 1]); return d; }
function dist(x: string, y: string) { return tbl(x, y)[x.length][y.length]; }

function video() {
  const v = new Video('edit-distance', 'Edit Distance');
  const d = tbl(X, Y);
  const m = X.length, n = Y.length;
  v.chapter('intro', 'The problem');
  v.array('x', X.split(''), { label: 'word1' });
  v.array('y', Y.split(''), { label: 'word2' });
  v.say('Turn word one into word two using the fewest operations: insert a character, delete a character, or replace a character.');
  v.eq(`answer: ${dist(X, Y)}`);
  v.say('For example: delete t, replace i with e, replace n with x, replace n with c, and insert u. Five operations.');

  v.chapter('brute', 'Brute force: try all three operations on the last character', { cx: 'O(3^(m+n))', code: ['ed(i, j): i == 0 → j; j == 0 → i', '  last chars equal → ed(i−1, j−1)', '  else 1 + min(ed(i−1, j−1) replace, ed(i−1, j) delete, ed(i, j−1) insert)'] });
  v.eq('three branches per mismatch', 'bad').say('Look at the last characters. If they are equal, they cost nothing. Otherwise the last operation was a replace, a delete, or an insert, and each leaves a smaller pair of prefixes. Three branches each time: exponential.');

  v.chapter('better', 'Better: memoise ed(i, j)', { cx: 'O(m·n)', code: ['cache ed(i, j)'] });
  v.eq('(m+1)(n+1) pairs', 'warn').say('Only m plus one times n plus one pairs of prefixes: caching makes it m times n.');

  v.chapter('optimal', 'Optimal: fill the table', { cx: 'O(m·n) time, O(n) space', code: ['dp[i][0] = i, dp[0][j] = j', 'x[i−1] == y[j−1] → dp[i][j] = dp[i−1][j−1]', 'else 1 + min(dp[i−1][j−1], dp[i−1][j], dp[i][j−1])', 'answer = dp[m][n]'] });
  v.clear();
  const g = v.grid('dp', d.map((row, i) => row.map((x, j) => (i === 0 || j === 0 ? x : ''))), { label: 'dp[i][j] = edits to turn word1[:i] into word2[:j]' });
  g.heads(['""', ...X.split('')], ['""', ...Y.split('')]);
  v.line(0).say('Row zero: building j letters from nothing takes j inserts. Column zero: removing i letters takes i deletes. Every other cell compares the last letters of its two prefixes. The arrow shows which neighbour gave the minimum: diagonal is replace or free match, up is delete, left is insert.');
  const cells: [number, number][] = [];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) cells.push([i, j]);
  let firstMatch = false;
  fill2D(v, g, cells, {
    deps: (i, j) => { if (X[i - 1] === Y[j - 1]) return [[i - 1, j - 1]]; const o: [number, number][] = [[i - 1, j - 1], [i - 1, j], [i, j - 1]]; const mm = Math.min(...o.map(([a, b]) => d[a][b])); return [o.find(([a, b]) => d[a][b] === mm)!]; },
    val: (i, j) => d[i][j], tone: (i, j) => (X[i - 1] === Y[j - 1] ? 'ok' : 'active'),
    line: (i, j) => (X[i - 1] === Y[j - 1] ? [1] : [2]),
    eq: (i, j) => (X[i - 1] === Y[j - 1] ? `'${X[i - 1]}' = '${Y[j - 1]}' → ${d[i][j]}` : `1 + min(${d[i - 1][j - 1]}, ${d[i - 1][j]}, ${d[i][j - 1]}) = ${d[i][j]}`),
    say: (i, j) => { if (i === 1 && j === 1) return 'I versus e: different letters, so one operation plus the best neighbour, zero.'; if (X[i - 1] === Y[j - 1] && !firstMatch) { firstMatch = true; return `${X[i - 1].toUpperCase()} matches ${X[i - 1]}: a green cell copies its diagonal for free.`; } return undefined; },
    hold: 110,
  });
  g.tone(m, n, 'ok');
  v.line(3).eq(`dp[${m}][${n}] = ${d[m][n]}`, 'ok').say(`The corner holds ${words(d[m][n])}. Each cell reads three neighbours from this row and the previous one, so two rows are enough.`);
  v.answer(dist(X, Y));

  recap(v, [{ name: 'Recursion', time: 'O(3^(m+n))', space: 'O(m + n)' }, { name: 'Memoisation', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'Table, two rows', time: 'O(m·n)', space: 'O(n)' }], 'Equal → diagonal; else 1 + min(replace, delete, insert).', ['Minimum edits between strings → edit distance table'], 'First row and column are j and i.');
  return v.build();
}

const problem: Problem = {
  slug: 'edit-distance',
  statement: 'Given two strings `word1` and `word2`, return the minimum number of operations (insert a character, delete a character, replace a character) required to convert `word1` into `word2`.',
  examples: [{ input: 'word1 = "horse", word2 = "ros"', output: '3' }, { input: 'word1 = "intention", word2 = "execution"', output: '5' }],
  constraints: ['0 ≤ word1.length, word2.length ≤ 500', 'lowercase English letters'],
  hints: ['Look at the last characters of both prefixes.', 'Three operations → three neighbours.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try replace/delete/insert on the last characters.', time: 'O(3^(m+n))', space: 'O(m + n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache ed(i, j).', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Recursion + table.' },
    { id: 'optimal', kind: 'optimal', name: 'Two rows', idea: 'Bottom-up table with rolling rows.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: '**1 + min of three** neighbours.',
  video,
  videoArgs: [X, Y],
  judge: {
    type: 'fn', fn: 'minDistance', params: ['String', 'String'], ret: 'int',
    tests: [{ args: ['horse', 'ros'], out: 3 }, { args: [X, Y], out: 5 }, { args: ['', 'abc'], out: 3 }, { args: ['abc', ''], out: 3 }, { args: ['', ''], out: 0 }],
    gen: (r: Rng) => { const al = 'abc'; const s = () => Array.from({ length: r.int(0, 7) }, () => al[r.int(0, 2)]).join(''); return [s(), s()]; },
    ref: (x: string, y: string) => dist(x, y),
  },
};

export default problem;
