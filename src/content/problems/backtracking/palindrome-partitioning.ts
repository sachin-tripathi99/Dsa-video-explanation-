import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const S = 'aab';
const isPal = (x: string) => x === [...x].reverse().join('');
function pp(s: string) { const out: string[][] = []; const p: string[] = []; const go = (i: number) => { if (i === s.length) { out.push([...p]); return; } for (let j = i + 1; j <= s.length; j++) { const piece = s.slice(i, j); if (!isPal(piece)) continue; p.push(piece); go(j); p.pop(); } }; go(0); return out; }

function video() {
  const v = new Video('palindrome-partitioning', 'Palindrome Partitioning');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Cut the string into pieces so that every piece is a palindrome. Return every possible way to do it.');
  v.eq(pp(S).map((x) => `[${x.join(' | ')}]`).join('  '));

  v.chapter('brute', 'Backtracking with an on-the-fly palindrome check', { cx: 'O(n · 2ⁿ) · n', code: ['go(i): if i == n: record', '  for j in i+1..n: piece = s[i:j]', '    if isPalindrome(piece): choose; go(j); undo   # O(n) check'] });
  v.eq('each check re-reads the piece', 'warn').say('Choose where the first piece ends; if it is a palindrome, recurse on the rest. Checking each piece from scratch costs up to n every time, and the same pieces are checked again and again in different branches.');

  v.chapter('optimal', 'Precompute every palindrome, then backtrack', { cx: 'O(n · 2ⁿ)', code: ['pal[i][j] = s[i] == s[j] and (j − i < 2 or pal[i+1][j−1])', 'go(i): if i == n: record', '  for j in i..n−1: if pal[i][j]: choose s[i..j]; go(j + 1); undo'] });
  v.clear();
  const n = S.length;
  const pal = Array.from({ length: n }, () => Array(n).fill(false));
  const g = v.grid('p', Array.from({ length: n }, () => Array(n).fill('')), { label: 'pal[i][j]: is s[i..j] a palindrome?', rowHead: S.split('').map((c, i) => `${i}:${c}`), colHead: S.split('').map((c, i) => `${i}:${c}`) });
  v.say('First fill a table: pal of i, j is true when s from i to j reads the same both ways. A piece is a palindrome if its end letters match and the inside is a palindrome. Fill it from shorter pieces to longer ones.');
  for (let len = 1; len <= n; len++) for (let i = 0; i + len - 1 < n; i++) { const j = i + len - 1; pal[i][j] = S[i] === S[j] && (j - i < 2 || pal[i + 1][j - 1]); g.set(i, j, pal[i][j] ? 'T' : 'F').tone(i, j, pal[i][j] ? 'ok' : 'bad'); }
  v.line(0).eq('n² table, each cell O(1)').hold(1200);
  v.clear();
  const d = decisionTree(v, 't', 'each level cuts off the next palindromic piece');
  const path: string[] = [];
  let count = 0;
  const told = { bad: false, rec: false };
  const go = (i: number, edge?: string) => {
    const nid = d.enter(path.length ? path.join('|') : '""', edge);
    if (i === n) {
      d.mark(nid, 'ok'); count++;
      v.line(1).counter(`found: ${count}`).eq(`record [${path.join(', ')}]`, 'ok');
      if (!told.rec) { v.say(`The whole string is used: a, a, b. Record it.`); told.rec = true; } else v.hold(600);
      d.leave();
      return;
    }
    v.line(2).eq(`cut from index ${i}`).hold(300);
    for (let j = i; j < n; j++) {
      const piece = S.slice(i, j + 1);
      if (!pal[i][j]) {
        const pid = d.enter(piece, '✗'); d.mark(pid, 'bad');
        v.line(2).eq(`"${piece}": pal[${i}][${j}] = false → skip`, 'bad');
        if (!told.bad) { v.say(`"${piece}" is not a palindrome: one table lookup says so, in constant time. Skip it.`); told.bad = true; } else v.hold(500);
        d.leave();
        continue;
      }
      path.push(piece);
      go(j + 1, piece);
      path.pop();
    }
    d.leave();
  };
  go(0);
  v.eq(pp(S).map((x) => `[${x.join(', ')}]`).join(' '), 'ok').say('Two partitions. The table made every palindrome check constant time.');
  v.answer(pp(S));

  recap(v, [{ name: 'Backtracking + direct checks', time: 'O(n² · 2ⁿ)', space: 'O(n)' }, { name: 'Palindrome table + backtracking', time: 'O(n · 2ⁿ)', space: 'O(n²)' }], 'Precompute pal[i][j]; branch on the end of the next piece.', ['Partition a string into valid pieces → backtracking over cut positions'], 'Precompute repeated checks so the backtracking only branches.');
  return v.build();
}

const problem: Problem = {
  slug: 'palindrome-partitioning',
  statement: 'Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitionings of `s`.',
  examples: [{ input: 's = "aab"', output: '[["a","a","b"],["aa","b"]]' }, { input: 's = "a"', output: '[["a"]]' }],
  constraints: ['1 ≤ n ≤ 16', 'lowercase letters'],
  hints: ['Choose where the first piece ends.', 'Precompute which substrings are palindromes.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Direct checks', idea: 'Backtrack over cut positions, checking each piece by reversing it.', time: 'O(n² · 2ⁿ)', space: 'O(n)', bottleneck: 'Repeated O(n) checks.' },
    { id: 'optimal', kind: 'optimal', name: 'Palindrome table', idea: 'Fill pal[i][j] by length first, then backtrack with O(1) lookups.', time: 'O(n · 2ⁿ)', space: 'O(n²)' },
  ],
  takeaway: 'Precompute **pal[i][j]**, then branch.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'partition', params: ['String'], ret: 'List<List<String>>', cmp: 'sorted',
    tests: [{ args: ['aab'], out: pp('aab') }, { args: ['a'], out: [['a']] }, { args: ['abba'], out: pp('abba') }],
    gen: (r: Rng) => [r.str(r.int(1, 8), 'aab')],
    ref: (s: string) => pp(s),
  },
};

export default problem;
