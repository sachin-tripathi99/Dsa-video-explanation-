import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { trieViz } from '../../trieviz';

const NUMS = [3, 10, 5, 25, 2, 8];
const B = 5;
function maxXor(a: number[]) { let m = 0; for (let i = 0; i < a.length; i++) for (let j = i; j < a.length; j++) m = Math.max(m, (a[i] ^ a[j]) >>> 0); return m; }

function video() {
  const v = new Video('maximum-xor-of-two-numbers-in-an-array', 'Maximum XOR of Two Numbers in an Array');
  const ans = maxXor(NUMS);
  const bits = (x: number) => x.toString(2).padStart(B, '0');
  v.chapter('intro', 'The problem');
  v.table('b', ['number', 'binary'], NUMS.map((x) => [String(x), bits(x)]));
  v.say('Pick two numbers from the array to make their XOR as large as possible. XOR gives a one wherever the two numbers’ bits differ.');
  v.eq(`answer: 5 XOR 25 = ${bits(5)} ^ ${bits(25)} = ${bits(ans)} = ${ans}`);

  v.chapter('brute', 'Brute force: try every pair', { cx: 'O(n²)', code: ['for i: for j > i: best = max(best, a[i] ^ a[j])'] });
  v.eq(`${NUMS.length * (NUMS.length - 1) / 2} pairs here · 2·10¹⁰ for n = 2·10⁵`, 'bad').say('Checking all pairs is quadratic: far too slow for two hundred thousand numbers.');

  v.chapter('insight', 'Higher bits win: decide greedily from the top');
  v.say(`A one in bit four is worth sixteen, more than all lower bits together, which add up to at most fifteen. So for each number, we want a partner that differs from it in the highest bit possible, then the next, and so on. A trie of bits answers “is there a number that starts with these bits?” in one step per bit.`);

  v.chapter('optimal', 'Bit trie: prefer the opposite bit at every level', { cx: 'O(n · B)', code: ['insert every number’s bits, highest first', 'for x: walk down, at each bit prefer the opposite of x’s bit', '  opposite exists → XOR bit = 1; else follow the same bit', 'answer = best over all x'] });
  v.clear();
  const T = trieViz(v, 't', `bit trie (${B} bits)`);
  NUMS.forEach((x, i) => { T.insert(bits(x)); v.line(0).eq(`insert ${x} = ${bits(x)}`).counter(`${i + 1}/${NUMS.length}`); if (i === 0) v.say('Insert every number as a path of five bits, highest bit first. Numbers with the same leading bits share a path.'); else v.hold(600); });
  T.t.clearTones();
  let best = 0;
  NUMS.forEach((x, qi) => {
    const xb = bits(x);
    let p = '', xr = 0;
    T.t.clearTones().tone(T.ID(''), 'path');
    for (let i = 0; i < B; i++) {
      const want = xb[i] === '0' ? '1' : '0';
      const go = T.has(p + want) ? want : xb[i];
      T.t.tone(T.ID(p + go), go === want ? 'ok' : 'warn').edge(T.ID(p), T.ID(p + go), 'path');
      p += go;
      if (go === want) xr |= 1 << (B - 1 - i);
      if (x === 5) {
        v.line(1, 2).counter(`query ${x}`).eq(`bit ${B - 1 - i}: ${x} has ${xb[i]}, want ${want} → ${go === want ? 'take it, +' + (1 << (B - 1 - i)) : 'not there, follow ' + go}`, go === want ? 'ok' : 'warn');
        if (i === 0) v.say(`Take five, zero zero one zero one. Its top bit is zero, so we want a one there. The trie has a branch starting with one, so the XOR gets sixteen.`);
        else if (i === 1) v.say('Next, five has a zero, so we want a one again. Under the one branch there is a one: plus eight.');
        else if (i === 2) v.say('Five has a one here, so we want a zero. It exists: plus four.');
        else if (i === 3) v.say('Five has a zero, so we want a one, but no stored number continues that way. Follow the zero instead: this bit of the XOR stays zero.');
        else v.hold(700);
      }
    }
    const better = xr > best;
    if (better) best = xr;
    v.line(3).counter(`best ${best}`).eq(`${x} ⊕ ${parseInt(p, 2)} = ${xr}${better ? ' → new best' : ''}`, better ? 'ok' : undefined);
    if (x === 5) v.say(`The path spells ${words(parseInt(p, 2))}, and five XOR ${words(parseInt(p, 2))} is ${words(xr)}.`);
    else if (qi === 0) v.say(`Each number walks the trie once, always trying to go the opposite way. For three, the best partner gives ${words(xr)}.`);
    else v.hold(800);
  });
  T.t.clearTones();
  v.eq(`maximum XOR = ${best}`, 'ok').say(`The best over all numbers is ${words(best)}. Each insert and each query takes one step per bit, so the whole thing is n times the number of bits: linear for 32-bit integers.`);
  v.answer(ans);

  recap(v, [{ name: 'All pairs', time: 'O(n²)', space: 'O(1)' }, { name: 'Prefix set, bit by bit', time: 'O(n · B)', space: 'O(n)' }, { name: 'Bit trie', time: 'O(n · B)', space: 'O(n · B)' }], 'Greedy from the top bit: prefer the opposite bit.', ['Maximise XOR of a pair → bit trie'], 'Always fix the width (31 bits) and go highest bit first.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-xor-of-two-numbers-in-an-array',
  statement: 'Given an integer array `nums`, return the maximum result of `nums[i] XOR nums[j]`, where `0 ≤ i ≤ j < n`.',
  examples: [{ input: 'nums = [3,10,5,25,2,8]', output: '28' }, { input: 'nums = [14,70,53,83,49,91,36,80,92,51,66,70]', output: '127' }],
  constraints: ['1 ≤ nums.length ≤ 2 · 10⁵', '0 ≤ nums[i] ≤ 2³¹ − 1'],
  hints: ['A higher bit outweighs all lower bits.', 'Store numbers in a trie of bits and prefer the opposite bit.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All pairs', idea: 'Try every pair.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Bit trie', idea: 'Insert bits from the top; each number greedily walks to the opposite bits.', time: 'O(n · 31)', space: 'O(n · 31)' },
  ],
  takeaway: 'Maximise XOR → **bit trie, opposite bits**.',
  video,
  videoArgs: [NUMS],
  judge: {
    type: 'fn', fn: 'findMaximumXOR', params: ['int[]'], ret: 'int',
    tests: [{ args: [NUMS], out: 28 }, { args: [[14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]], out: 127 }, { args: [[0]], out: 0 }, { args: [[2147483647, 0, 1]], out: 2147483647 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 12) }, () => (r.chance(0.2) ? r.int(0, 2147483647) : r.int(0, 100)))],
    ref: (a: number[]) => maxXor(a),
  },
};

export default problem;
