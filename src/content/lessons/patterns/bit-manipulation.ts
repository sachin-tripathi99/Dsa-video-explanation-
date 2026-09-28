import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { brow, ones } from '../../bitviz';

function video() {
  const v = new Video('bit-manipulation', 'Bits, masks and XOR tricks');
  const W = 8;

  v.chapter('intro', 'Numbers are rows of switches');
  const b = v.bits('b', [brow('13', 13, W, { note: '8 + 4 + 1', tone: ones('ok') })]);
  v.say('Every integer is stored as bits: thirteen is eight plus four plus one, so the bits for eight, four and one are on. Bit operations work on all these switches at once, in a single CPU instruction, which makes some problems collapse to a line of code.');

  v.chapter('ops', 'The six operators', { code: ['a & b   AND: 1 only where both are 1', 'a | b   OR: 1 where either is 1', 'a ^ b   XOR: 1 where they differ', '~a      NOT: flip every bit', 'a << k  shift left: multiply by 2ᵏ', 'a >> k  shift right: divide by 2ᵏ'] });
  const a = 12, c = 10;
  b.update({ rows: [brow('a = 12', a, W), brow('b = 10', c, W), brow('a & b', a & c, W, { note: '= 8', tone: ones('ok') })] });
  v.line(0).say('AND keeps a bit only where both numbers have it. Twelve and ten share only the eight.');
  b.update({ rows: [brow('a = 12', a, W), brow('b = 10', c, W), brow('a | b', a | c, W, { note: '= 14', tone: ones('ok') })] });
  v.line(1).say('OR keeps a bit where either has it: fourteen.');
  b.update({ rows: [brow('a = 12', a, W), brow('b = 10', c, W), brow('a ^ b', a ^ c, W, { note: '= 6', tone: ones('warn') })] });
  v.line(2).say('XOR keeps a bit where they differ: six. XOR is the star of many tricks, because x XOR x is zero and x XOR zero is x.');
  b.update({ rows: [brow('a = 12', a, W), brow('a << 1', a << 1, W, { note: '= 24' }), brow('a >> 2', a >> 2, W, { note: '= 3' })] });
  v.line(4, 5).say('Shifting left by one doubles a number; shifting right by two divides by four, dropping the remainder.');

  v.chapter('tricks', 'Tricks worth memorising', { code: ['x & (x − 1)   clears the lowest 1 bit', 'x & −x        keeps only the lowest 1 bit', 'x ^ x = 0,  x ^ 0 = x', '(x >> i) & 1  reads bit i'] });
  const x = 44;
  b.update({ rows: [brow('x = 44', x, W), brow('x − 1 = 43', x - 1, W, { tone: (i) => (i >= W - 3 ? 'cmp' : undefined) }), brow('x & (x−1)', x & (x - 1), W, { note: '= 40', tone: ones('ok') })] });
  v.line(0).say('Subtracting one flips the lowest one bit and every zero below it. ANDing with the original therefore erases exactly the lowest one bit. Repeating it until zero counts the one bits, and a number is a power of two exactly when this leaves zero.');
  b.update({ rows: [brow('x = 44', x, W), brow('−x', -x, W), brow('x & −x', x & -x, W, { note: '= 4', tone: ones('ok') })] });
  v.line(1).say('Negative numbers are stored in two’s complement: flip all bits and add one. So minus x agrees with x only at the lowest one bit, and x AND minus x isolates it.');

  v.chapter('xor', 'XOR cancels pairs', { code: ['result = 0', 'for x in nums: result ^= x', 'pairs cancel; the loner remains'] });
  v.clear();
  const A = [4, 1, 2, 1, 2];
  const arr = v.array('a', A, { label: 'every number twice, except one' });
  const acc = v.bits('acc', [brow('result', 0, 4, { note: '= 0' })]);
  let r = 0;
  A.forEach((y, i) => {
    r ^= y;
    arr.clearTones().tone(i, 'active');
    acc.update({ rows: [brow(`^ ${y}`, y, 4), brow('result', r, 4, { note: `= ${r}`, tone: ones('ok') })] });
    v.line(1).eq(`result ^= ${y} → ${r}`);
    if (i === 0) v.say('Start from zero and XOR in every number. The order does not matter, because XOR is commutative and associative.');
    else if (i === 3) v.say('The second one cancels the first: one XOR one is zero, so result is back to four XOR two.');
    else v.hold(800);
  });
  arr.clearTones().tone(0, 'ok');
  v.line(2).eq(`answer = ${r}`, 'ok').say(`Every pair cancels out, and the number that appears once, ${words(r)}, is left. Linear time, constant space.`);

  v.chapter('table', 'Recognising bit problems');
  v.clear();
  v.table('t', ['Clue', 'Trick'], [
    ['every element twice except one', 'XOR everything'],
    ['is n a power of two?', 'n > 0 and n & (n − 1) == 0'],
    ['count the 1 bits', 'repeat n &= n − 1'],
    ['add without + or −', 'XOR = sum without carry; (a & b) << 1 = carry'],
    ['subsets of a small set', 'masks 0 .. 2ⁿ − 1'],
    ['bits common to a whole range', 'shift both ends until they match'],
  ]);
  v.say('When a problem mentions pairs cancelling, powers of two, or forbids arithmetic, think in bits.');
  return v.build();
}

const body = String.raw`
## The operators

| Op | Meaning | Example (12, 10) |
|---|---|---|
| \`&\` | both 1 | 1100 & 1010 = 1000 |
| \`|\` | either 1 | 1110 |
| \`^\` | different | 0110 |
| \`~\` | flip all | |
| \`<< k\` | × 2ᵏ | |
| \`>> k\` | ÷ 2ᵏ (arithmetic in Java/C++ for negatives; \`>>>\` is logical in Java) | |

> Real-life picture: a row of light switches. AND/OR/XOR combine two rows switch by switch.

## Tricks

\`\`\`java
boolean isPow2 = n > 0 && (n & (n - 1)) == 0;
int lowest = x & -x;                                   // lowest set bit
int count = 0; while (x != 0) { x &= x - 1; count++; } // popcount
int single = 0; for (int y : nums) single ^= y;        // pairs cancel
\`\`\`

\`\`\`python
is_pow2 = n > 0 and n & (n - 1) == 0
lowest = x & -x                                        # lowest set bit
count = bin(x).count("1")                              # popcount
single = functools.reduce(operator.xor, nums)          # pairs cancel
\`\`\`

\`\`\`cpp
bool isPow2 = n > 0 && (n & (n - 1)) == 0;
int lowest = x & -x;                                   // lowest set bit
int count = __builtin_popcount(x);                     // popcount
int single = 0; for (int y : nums) single ^= y;        // pairs cancel
\`\`\`

## Pitfalls

- Operator precedence: \`x & 1 == 0\` parses as \`x & (1 == 0)\` in Java/C++. Use parentheses.
- Python integers are unbounded: mask with \`0xFFFFFFFF\` to imitate 32-bit behaviour.
- \`1 << 31\` overflows a signed 32-bit int; use \`1L << 31\` when needed.
`;

const lesson: Lesson = {
  slug: 'bit-manipulation',
  video,
  body,
  quiz: [
    { q: 'x & (x − 1) …', options: ['doubles x', 'clears the lowest set bit', 'sets all bits', 'negates x'], answer: 1, why: 'Subtracting one flips the lowest 1 and the zeros below it.' },
    { q: 'a ^ a equals…', options: ['a', '0', '2a', '−a'], answer: 1, why: 'Every bit differs from itself nowhere.' },
    { q: 'Power of two test?', options: ['n % 2 == 0', 'n > 0 && (n & (n − 1)) == 0', 'n & 1', '(n >> 1) == 0'], answer: 1, why: 'A power of two has exactly one set bit.' },
    { q: 'x & −x gives…', options: ['the highest set bit', 'the lowest set bit', 'zero', 'x'], answer: 1, why: 'Two’s complement agrees with x only at the lowest set bit.' },
  ],
};

export default lesson;
