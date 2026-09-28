import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { fill2D } from '../../dpviz';

const S1 = 'aab', S2 = 'axy', S3 = 'aaxaby';
function tbl(a: string, b: string, c: string) { const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false)); if (m + n !== c.length) return d; d[0][0] = true; for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) { if (i && a[i - 1] === c[i + j - 1] && d[i - 1][j]) d[i][j] = true; if (j && b[j - 1] === c[i + j - 1] && d[i][j - 1]) d[i][j] = true; } return d; }
function inter(a: string, b: string, c: string) { return a.length + b.length === c.length && tbl(a, b, c)[a.length][b.length]; }

function video() {
  const v = new Video('interleaving-string', 'Interleaving String');
  const d = tbl(S1, S2, S3);
  const m = S1.length, n = S2.length;
  v.chapter('intro', 'The problem');
  v.array('a', S1.split(''), { label: 's1' });
  v.array('b', S2.split(''), { label: 's2' });
  v.array('c', S3.split(''), { label: 's3' });
  v.say('Is s3 formed by interleaving s1 and s2: taking all their characters, keeping each string’s own order, but mixing the two however you like?');
  v.eq(`answer: ${inter(S1, S2, S3)} — a(s2) a(s1) x(s2) a(s1) b(s1) y(s2)`);

  v.chapter('brute', 'Brute force: at each step take the next char from s1 or s2', { cx: 'O(2^(m+n))', code: ['ok(i, j): used i chars of s1 and j of s2', '  s1[i] == s3[i+j] and ok(i+1, j)', '  or s2[j] == s3[i+j] and ok(i, j+1)'] });
  v.eq('two choices whenever both match', 'bad').say('When the next character of s3 matches both strings, we must try both. Exponential without caching.');

  v.chapter('better', 'Better: memoise (i, j)', { cx: 'O(m·n)', code: ['the position in s3 is always i + j, so (i, j) is the whole state'] });
  v.eq('(m+1)(n+1) states', 'warn').say('The key observation: after using i characters of s1 and j of s2, we are at position i plus j in s3. So i and j alone describe the state.');

  v.chapter('optimal', 'Optimal: a boolean table', { cx: 'O(m·n) time, O(n) space', code: ['dp[0][0] = true', 'dp[i][j] = (dp[i−1][j] and s1[i−1] == s3[i+j−1])', '       or (dp[i][j−1] and s2[j−1] == s3[i+j−1])', 'answer = dp[m][n]'] });
  v.clear();
  const g = v.grid('dp', d.map((row) => row.map(() => '')), { label: 'dp[i][j] = first i of s1 and first j of s2 can form the first i+j of s3' });
  g.heads(['""', ...S1.split('')], ['""', ...S2.split('')]);
  g.set(0, 0, 'T').tone(0, 0, 'ok');
  v.line(0).say('Moving down the table uses the next character of s1; moving right uses the next character of s2. A cell is true if it can be reached from a true cell above with a matching s1 character, or from a true cell on the left with a matching s2 character.');
  const cells: [number, number][] = [];
  for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) if (i || j) cells.push([i, j]);
  fill2D(v, g, cells, {
    deps: (i, j) => [...(i && d[i - 1][j] && S1[i - 1] === S3[i + j - 1] ? [[i - 1, j] as [number, number]] : []), ...(j && d[i][j - 1] && S2[j - 1] === S3[i + j - 1] ? [[i, j - 1] as [number, number]] : [])],
    val: (i, j) => (d[i][j] ? 'T' : 'F'), tone: (i, j) => (d[i][j] ? 'ok' : 'bad'), line: [1, 2],
    eq: (i, j) => `s3[${i + j - 1}] = '${S3[i + j - 1]}': ${i ? `from above '${S1[i - 1]}'${d[i - 1][j] ? '' : ' (above F)'}` : ''}${i && j ? ' · ' : ''}${j ? `from left '${S2[j - 1]}'${d[i][j - 1] ? '' : ' (left F)'}` : ''} → ${d[i][j] ? 'T' : 'F'}`,
    say: (i, j) => (i === 0 && j === 1 ? 'Top row: using only s2. The first a of s2 matches the first a of s3.' : i === 2 && j === 0 ? 'Two a’s from s1 match the start of s3 too.' : i === m && j === n ? 'The corner is reachable: all of s1 and s2 form all of s3.' : undefined),
    hold: 450,
  });
  v.line(3).eq(`dp[${m}][${n}] = ${d[m][n]}`, d[m][n] ? 'ok' : 'bad').say('Every true path from the top-left to the bottom-right corner is one valid interleaving. Only the previous row is needed, so one row of booleans is enough.');
  v.answer(inter(S1, S2, S3));

  recap(v, [{ name: 'Recursion', time: 'O(2^(m+n))', space: 'O(m + n)' }, { name: 'Memoisation', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'Boolean row', time: 'O(m·n)', space: 'O(n)' }], 'State (i, j): position in s3 is i + j.', ['Merge two sequences keeping order → 2D reachability DP'], 'Check lengths first: m + n must equal |s3|.');
  return v.build();
}

const problem: Problem = {
  slug: 'interleaving-string',
  statement: 'Given strings `s1`, `s2` and `s3`, return `true` if `s3` is formed by an interleaving of `s1` and `s2`: all characters of both, each string keeping its own order.',
  examples: [{ input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"', output: 'true' }, { input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"', output: 'false' }, { input: 's1 = "", s2 = "", s3 = ""', output: 'true' }],
  constraints: ['0 ≤ s1.length, s2.length ≤ 100', '0 ≤ s3.length ≤ 200', 'lowercase English letters'],
  hints: ['The position in s3 is i + j.', 'dp[i][j] from above (s1) or from the left (s2).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Take the next char from s1 or s2.', time: 'O(2^(m+n))', space: 'O(m + n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache ok(i, j).', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Table + recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Boolean row', idea: 'Bottom-up reachability with one row.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: 'Position in s3 = **i + j**.',
  video,
  videoArgs: [S1, S2, S3],
  judge: {
    type: 'fn', fn: 'isInterleave', params: ['String', 'String', 'String'], ret: 'boolean',
    tests: [{ args: ['aabcc', 'dbbca', 'aadbbcbcac'], out: true }, { args: ['aabcc', 'dbbca', 'aadbbbaccc'], out: false }, { args: ['', '', ''], out: true }, { args: ['a', '', 'a'], out: true }, { args: ['a', 'b', 'a'], out: false }, { args: [S1, S2, S3], out: inter(S1, S2, S3) }],
    gen: (r: Rng) => { const al = 'ab'; const s = (k: number) => Array.from({ length: k }, () => al[r.int(0, 1)]).join(''); const a = s(r.int(0, 5)), b = s(r.int(0, 5)); let c = ''; let i = 0, j = 0; while (i < a.length || j < b.length) { if (j >= b.length || (i < a.length && r.chance(0.5))) c += a[i++]; else c += b[j++]; } if (r.chance(0.4) && c.length) { const k = r.int(0, c.length - 1); c = c.slice(0, k) + (c[k] === 'a' ? 'b' : 'a') + c.slice(k + 1); } return [a, b, c]; },
    ref: (a: string, b: string, c: string) => inter(a, b, c),
  },
};

export default problem;
