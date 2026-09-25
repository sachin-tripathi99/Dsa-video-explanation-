import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const NN = 4;
const KK = 6;

function video() {
  const v = new Video('kth-symbol', 'K-th Symbol in Grammar');
  v.chapter('intro', 'The problem');
  const rows = ['0'];
  for (let i = 1; i < NN; i++) rows.push([...rows[i - 1]].map((c) => (c === '0' ? '01' : '10')).join(''));
  const tb = v.table('rows', ['row', 'symbols'], [['1', '0']]);
  v.say('Row one is a single zero. To build the next row, replace every zero with zero one, and every one with one zero.');
  for (let i = 1; i < NN; i++) {
    tb.addRow([String(i + 1), rows[i].split('').join(' ')]);
    tb.clearTones().tone(i, 'active');
    v.hold(900);
  }
  tb.clearTones().cell(3, 1, 'warn');
  v.eq(`row ${NN}, position ${KK} → ${rows[NN - 1][KK - 1]}`);
  v.say(`Given n and k, return the k-th symbol of row n. Row four, position six, is ${rows[NN - 1][KK - 1]}.`);

  v.chapter('brute', 'Brute force: build every row', { cx: 'O(2ⁿ)', code: ['row = "0"', 'repeat n − 1 times:', '  row = expand(row)', 'return row[k − 1]'] });
  v.clear();
  v.bars('len', [1, 2, 3, 4, 10, 20, 30].map((n) => ({ label: `row ${n}`, value: 2 ** (n - 1), text: `${(2 ** (n - 1)).toLocaleString('en-US')} symbols`, tone: n >= 20 ? 'bad' as const : undefined })), { log: true, label: 'row length doubles every row' });
  v.say('We could build the rows. But each row doubles in length. Row thirty has over five hundred million symbols. We need to find one symbol without building the row.');

  v.chapter('better', 'Better: ask your parent', { cx: 'O(n)', code: ['kth(n, k):', '  if n == 1: return 0', '  parent = kth(n − 1, (k + 1) / 2)', '  if k is odd: return parent', '  else: return 1 − parent'] });
  v.clear();
  const t = v.tree('t', { binary: true, label: 'every symbol has two children' });
  const ids: string[][] = [];
  for (let r = 0; r < NN; r++) {
    ids.push([]);
    for (let c = 0; c < 2 ** r; c++) {
      const parent = r === 0 ? null : ids[r - 1][c >> 1];
      ids[r].push(t.add(parent, rows[r][c], r === 0 ? undefined : ((c & 1) as 0 | 1)));
    }
  }
  v.say('Draw the rows as a tree. Every symbol produces two children: a zero makes zero one, a one makes one zero.');
  const path: string[] = [];
  let k = KK;
  for (let r = NN - 1; r >= 0; r--) {
    path.unshift(ids[r][k - 1]);
    k = Math.ceil(k / 2);
  }
  t.tone(path[NN - 1], 'active');
  v.line(2).say(`Position ${KK} in row ${NN} is the child of position ${Math.ceil(KK / 2)} in row ${NN - 1}. In general, the parent of k is k plus one, over two.`);
  for (let r = NN - 2; r >= 0; r--) {
    t.tone(path[r], 'path').edge(path[r], path[r + 1], 'path');
    v.hold(600);
  }
  t.tone(path[0], 'ok');
  v.line(1).say('Follow parents up to the root, which is zero.');
  for (let r = 1; r < NN; r++) {
    const pos = ((): number => { let kk = KK; for (let x = NN - 1; x > r; x--) kk = Math.ceil(kk / 2); return kk; })();
    t.tone(path[r], 'ok');
    v.line(pos % 2 === 1 ? 3 : 4).eq(`row ${r + 1}, k=${pos}: ${pos % 2 === 1 ? 'left child → same as parent' : 'right child → flipped'} → ${rows[r][pos - 1]}`);
    if (r === 1) v.say('Now come back down. A left child, odd k, copies its parent. A right child, even k, is the flipped parent.');
    else v.hold(1000);
  }
  v.eq(`answer: ${rows[NN - 1][KK - 1]}`, 'ok').say('One step per row: O of n time, and O of n stack space.');

  v.chapter('optimal', 'Optimal: count the flips', { cx: 'O(log k)', code: ['flips = popcount(k − 1)', 'return flips % 2'] });
  v.clear();
  const bin = (KK - 1).toString(2).padStart(NN - 1, '0');
  v.bits('b', [{ label: `k − 1 = ${KK - 1}`, bits: bin, tones: Object.fromEntries([...bin].map((c, i) => [i, c === '1' ? 'warn' : 'none'])) as Record<number, 'warn' | 'none'>, note: `${[...bin].filter((c) => c === '1').length} ones` }]);
  const flips = [...bin].filter((c) => c === '1').length;
  v.say(`Going right flips the symbol; going left keeps it. And the path from the root to position k is just the binary form of k minus one: a one means right. Here k minus one is ${KK - 1}, which is ${bin.split('').join(' ')} in binary, with ${flips} ones.`);
  v.eq(`${flips} flips of 0 → ${flips % 2}`, 'ok').note('answer = (number of 1 bits in k − 1) % 2');
  v.say(`${flips === 2 ? 'Two' : String(flips)} flips starting from zero gives ${flips % 2}. So the answer is simply the parity of the number of one bits in k minus one.`);
  v.answer(flips % 2);

  recap(
    v,
    [
      { name: 'Build every row', time: 'O(2ⁿ)', space: 'O(2ⁿ)' },
      { name: 'Recurse to the parent', time: 'O(n)', space: 'O(n)' },
      { name: 'Count 1 bits of k − 1', time: 'O(log k)', space: 'O(1)' },
    ],
    'Building rows is exponential. Asking the parent needs one step per row. Counting flips in the binary path is a one-liner.',
    ['Self-similar structure → relate position k to its parent', 'Path in a complete binary tree = binary digits of the index'],
    'When each item is built from a parent, relate a position to its parent and recurse, instead of building everything.',
  );
  return v.build();
}

const problem: Problem = {
  slug: 'k-th-symbol-in-grammar',
  statement: 'Build a table of `n` rows. Row 1 is `0`. Each next row is made from the previous one by replacing every `0` with `01` and every `1` with `10`. Given `n` and `k`, return the `k`-th symbol (**1-indexed**) of row `n`.',
  examples: [
    { input: 'n = 1, k = 1', output: '0' },
    { input: 'n = 2, k = 1', output: '0', why: 'Row 2 is 01.' },
    { input: 'n = 2, k = 2', output: '1' },
  ],
  constraints: ['1 ≤ n ≤ 30', '1 ≤ k ≤ 2ⁿ⁻¹'],
  hints: ['How long is row 30? Can you afford to build it?', 'Which symbol in row n − 1 produced position k in row n?', 'A symbol’s left child equals it; its right child is flipped.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Build the rows', idea: 'Start from "0" and expand n − 1 times, then read position k.', time: 'O(2ⁿ)', space: 'O(2ⁿ)', bottleneck: 'Row n has 2ⁿ⁻¹ symbols: half a billion for n = 30.' },
    { id: 'better', kind: 'better', name: 'Recurse to the parent', idea: 'Position k in row n comes from position ⌈k/2⌉ in row n − 1. Odd k is a left child (same symbol); even k is a right child (flipped).', time: 'O(n)', space: 'O(n)', bottleneck: 'Still one call per row; the pattern of flips can be read directly from k.' },
    {
      id: 'optimal', kind: 'optimal', name: 'Parity of set bits',
      idea: 'The path from the root to position k spells out the bits of `k − 1` (1 = go right = flip). The answer is the number of flips mod 2.',
      steps: ['Count the 1 bits of `k − 1`', 'Return that count `% 2`'],
      time: 'O(log k)', space: 'O(1)',
    },
  ],
  pitfalls: ['Mixing 1-based k with 0-based indices: the parent of k is `(k + 1) / 2`.', 'Building strings up to row 30 runs out of memory.'],
  takeaway: 'For self-similar structures, **relate each position to its parent** instead of generating everything.',
  video,
  videoArgs: [NN, KK],
  judge: {
    type: 'fn', fn: 'kthGrammar', params: ['int', 'int'], ret: 'int',
    tests: [
      { args: [1, 1], out: 0 }, { args: [2, 1], out: 0 }, { args: [2, 2], out: 1 }, { args: [4, 6], out: 0 },
      { args: [30, 434991989], out: 0, big: true }, { args: [30, 536870912], out: 1, big: true },
    ],
    gen: (r) => { const n = r.int(1, 16); return [n, r.int(1, 2 ** (n - 1))]; },
    ref: (n: number, k: number) => { let c = 0; let x = k - 1; while (x) { c += x & 1; x >>= 1; } return c % 2; },
  },
};

export default problem;
