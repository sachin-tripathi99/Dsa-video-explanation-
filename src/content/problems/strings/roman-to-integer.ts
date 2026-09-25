import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'MCMXCIV';
const VAL: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

function video() {
  const v = new Video('roman', 'Roman to Integer');
  v.chapter('intro', 'The problem');
  v.table('t', ['Symbol', 'I', 'V', 'X', 'L', 'C', 'D', 'M'], [['Value', '1', '5', '10', '50', '100', '500', '1000']]);
  v.say('Convert a Roman numeral to an integer. Symbols normally add up, largest first. But when a smaller symbol comes before a larger one, like I V, it is subtracted: four.');

  v.chapter('brute', 'Special-case the six pairs', { cx: 'O(n)', code: ['if s[i:i+2] in {IV, IX, XL, XC, CD, CM}:', '  add the pair value; i += 2', 'else: add value(s[i]); i += 1'] });
  v.eq('IV=4, IX=9, XL=40, XC=90, CD=400, CM=900').say('One approach lists the six subtractive pairs and checks for them explicitly. It works, but it is a table you must remember.');

  v.chapter('optimal', 'Optimal: compare with the next symbol', { cx: 'O(n)', code: ['total = 0', 'for i in 0..n-1:', '  if i+1 < n and val(s[i]) < val(s[i+1]):', '    total −= val(s[i])', '  else: total += val(s[i])'] });
  v.clear();
  const a = v.array('s', [...S], { label: `s = "${S}"` });
  a.subs([...S].map((c) => String(VAL[c])));
  const vv = v.vars('v', { total: 0 });
  let total = 0;
  [...S].forEach((c, i) => {
    const next = S[i + 1];
    const sub = next !== undefined && VAL[c] < VAL[next];
    total += sub ? -VAL[c] : VAL[c];
    a.clearTones().ptr('i', i).tone(i, sub ? 'bad' : 'ok');
    if (next) a.tone(i + 1, 'cmp');
    vv.set({ total });
    v.line(sub ? 3 : 4).eq(sub ? `${c} (${VAL[c]}) < ${next} (${VAL[next]}) → subtract` : `${c} → add ${VAL[c]}`, sub ? 'bad' : 'ok');
    if (i === 0) v.say('The general rule: look at the next symbol. If the current one is smaller, subtract it; otherwise add it. M is followed by C, which is smaller, so add a thousand.');
    else if (i === 1) v.say('C is followed by M, which is bigger, so subtract a hundred.');
    else v.hold(800);
  });
  a.noPtr().clearTones();
  v.eq(`${S} = ${total}`, 'ok').say(`The total is ${total}. One pass, no special table of pairs.`);
  v.answer(total);

  recap(v, [{ name: 'List the six subtractive pairs', time: 'O(n)', space: 'O(1)' }, { name: 'Compare with the next symbol', time: 'O(n)', space: 'O(1)' }], 'Both are linear; the comparison rule is shorter and harder to get wrong.', ['Look one step ahead to decide how to treat the current item'], 'Peeking at the next element is a small but common trick in parsing problems.');
  return v.build();
}

const problem: Problem = {
  slug: 'roman-to-integer',
  statement: 'Convert a Roman numeral string `s` to an integer. Symbols: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. A smaller symbol placed **before** a larger one is subtracted (IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900).',
  examples: [
    { input: 's = "III"', output: '3' },
    { input: 's = "LVIII"', output: '58', why: 'L = 50, V = 5, III = 3.' },
    { input: 's = "MCMXCIV"', output: '1994', why: 'M = 1000, CM = 900, XC = 90, IV = 4.' },
  ],
  constraints: ['1 ≤ s.length ≤ 15', 's is a valid Roman numeral in [1, 3999]'],
  hints: ['When is a symbol subtracted instead of added?', 'Compare each symbol with the one after it.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Check the subtractive pairs', idea: 'At each position, if the next two characters form one of IV, IX, XL, XC, CD, CM, add that pair’s value and skip two; otherwise add one symbol.', time: 'O(n)', space: 'O(1)', bottleneck: 'Needs a hard-coded table of pairs.' },
    { id: 'optimal', kind: 'optimal', name: 'Compare with the next symbol', idea: 'Subtract `val(s[i])` if it is smaller than `val(s[i+1])`, otherwise add it.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '**Peek at the next element** to decide how to handle the current one.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'romanToInt', params: ['String'], ret: 'int',
    tests: [{ args: ['III'], out: 3 }, { args: ['LVIII'], out: 58 }, { args: ['MCMXCIV'], out: 1994 }, { args: ['MMMCMXCIX'], out: 3999 }, { args: ['IV'], out: 4 }],
    gen: (r) => { const n = r.int(1, 3999); const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let x = n; let s = ''; for (const [v, t] of map) while (x >= v) { s += t; x -= v; } return [s]; },
    ref: (s: string) => { const V: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }; let t = 0; for (let i = 0; i < s.length; i++) t += i + 1 < s.length && V[s[i]] < V[s[i + 1]] ? -V[s[i]] : V[s[i]]; return t; },
  },
};

export default problem;
