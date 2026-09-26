import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const A = [3, 1, 5, 4, 2];
const B = [4, 3, 2, 7, 8, 2, 3, 1];

function video() {
  const v = new Video('cyclic-sort', 'Cyclic sort: index as a hash');
  v.chapter('intro', 'Every number has a home');
  const a0 = v.array('a', A, { label: 'numbers 1..n, one of each' });
  a0.subs(A.map((x) => `home ${x - 1}`));
  v.say('When an array holds the numbers one to n, each number has a natural home: value x belongs at index x minus one. The array itself becomes a hash table, with no extra memory.');

  v.chapter('sort', 'Put each number home', { code: ['i = 0', 'while i < n:', '  home = a[i] − 1', '  if a[i] != a[home]: swap(a[i], a[home])   # send it home', '  else: i += 1'] });
  v.clear();
  const a = v.array('a', [...A], { label: 'swap each value into index value − 1' });
  const cur = [...A];
  let i = 0;
  let swaps = 0;
  let told = 0;
  v.say('Walk with i. If a of i is not at home, swap it into its home. The number that comes back might also be misplaced, so stay at i and repeat. Only move on when a of i is home.');
  while (i < cur.length) {
    const home = cur[i] - 1;
    a.clearTones().ptr('i', i);
    for (let k = 0; k < cur.length; k++) if (cur[k] === k + 1) a.tone(k, 'ok');
    if (cur[i] !== cur[home]) {
      a.tone(i, 'active').tone(home, 'cmp');
      v.line(2, 3).eq(`a[${i}] = ${cur[i]} belongs at ${home} → swap`);
      if (told === 0) { v.say(`a of zero is ${words(cur[i])}, whose home is index ${words(home)}. Swap it there. ${words(cur[home])} comes back to index zero.`); told++; }
      else v.hold(650);
      [cur[i], cur[home]] = [cur[home], cur[i]];
      a.swap(i, home);
      swaps++;
    } else {
      a.tone(i, 'ok');
      v.line(4).eq(`a[${i}] = ${cur[i]} is home → i += 1`).hold(450);
      i++;
    }
  }
  a.noPtr().clearTones().toneRange(0, cur.length - 1, 'ok');
  v.eq(`sorted with ${swaps} swaps · every swap sends one number home for good → O(n)`, 'ok').say(`Sorted with ${words(swaps)} swaps. Each swap puts at least one number in its final place, so there are at most n swaps. Linear time, constant space.`);

  v.chapter('misfits', 'With duplicates, the misfits tell the story', { code: ['cyclic sort, but skip when the home already holds the same value', 'then: for i, if a[i] != i + 1:', '  i + 1 is missing, a[i] is a duplicate'] });
  v.clear();
  const b = v.array('a', [...B], { label: 'numbers 1..8, some repeated, some missing' });
  const c = [...B];
  i = 0;
  while (i < c.length) { const h = c[i] - 1; if (c[i] !== c[h]) [c[i], c[h]] = [c[h], c[i]]; else i++; }
  v.say('Real problems are messier: some numbers repeat and others are missing. Run the same sort, but when a number’s home already holds the same value, it is a duplicate with nowhere to go, so leave it and move on.');
  b.setAll(c);
  c.forEach((x, k) => b.tone(k, x === k + 1 ? 'ok' : 'bad'));
  b.subs(c.map((x, k) => (x === k + 1 ? '' : `want ${k + 1}`)));
  const miss = c.map((x, k) => (x !== k + 1 ? k + 1 : 0)).filter(Boolean);
  const dup = c.filter((x, k) => x !== k + 1);
  v.line(1, 2).eq(`misfits: indices want ${miss.join(', ')} (missing) · hold ${dup.join(', ')} (duplicates)`, 'ok').say(`After sorting, scan once. Every index whose value is wrong is a slot whose rightful number is missing, here ${miss.map(words).join(' and ')}, and the value sitting there is a duplicate, here ${dup.map(words).join(' and ')}.`);

  v.chapter('sign', 'The sign-marking variant');
  v.clear();
  v.text('s', { title: 'Mark “seen” with a minus sign', lines: ['for each x: make a[|x| − 1] negative', 'already negative → |x| is a duplicate', 'still positive at index i → i + 1 never appeared'], shown: 3 });
  v.say('A second trick with the same idea: instead of moving numbers, visit each value x and flip the sign of the number at index x minus one. A sign that is already negative means x was seen before. An index that stays positive means its number never appeared.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.table('r', ['Signal', 'Tool'], [
    ['Values in 1..n (or 0..n), O(1) space', 'cyclic sort: a[i] belongs at a[i] − 1'],
    ['Find missing / duplicate numbers', 'sort, then scan for misfits'],
    ['Must not modify the array', 'Floyd cycle detection or math (sum / XOR)'],
    ['Values outside 1..n present', 'ignore them while sorting (first missing positive)'],
  ]);
  v.say('Whenever values fit in the range of indices, use the index as the hash. It is sorting in linear time without any extra memory.');
  return v.build();
}

const body = String.raw`
## The idea

If the values are exactly (or mostly) the numbers **1..n**, value \`x\` belongs at index \`x − 1\`. Swapping every value to its home sorts the array in O(n) time and O(1) space; afterwards, any index holding the wrong value reveals a missing number and a duplicate.

> Real-life picture: numbered lockers. Each student holds a key with a locker number. Walk down the row and send everyone to their own locker; empty lockers are missing students, and a second person at a locker is a duplicate.

## Template

\`\`\`python
i = 0
while i < n:
    home = a[i] - 1
    if 0 <= home < n and a[i] != a[home]:      # in range and not already a duplicate
        a[i], a[home] = a[home], a[i]
    else:
        i += 1
# now: a[i] != i + 1 → i + 1 is missing (and a[i] is extra)
\`\`\`

\`\`\`java
int i = 0;
while (i < n) {
    int home = a[i] - 1;
    if (home >= 0 && home < n && a[i] != a[home]) {
        int t = a[i]; a[i] = a[home]; a[home] = t;
    } else i++;
}
\`\`\`

\`\`\`cpp
int i = 0;
while (i < n) {
    int home = a[i] - 1;
    if (home >= 0 && home < n && a[i] != a[home]) swap(a[i], a[home]);
    else i++;
}
\`\`\`

**Why O(n):** every swap puts at least one value into its final home, so there are at most n swaps, plus n increments of \`i\`.

## Variants

| Problem | After sorting / marking |
|---|---|
| Missing number (0..n) | Gauss sum or XOR is even simpler |
| All disappeared numbers | indices with a[i] ≠ i + 1 |
| All duplicates | values a[i] at wrong indices (or sign marking) |
| Set mismatch | the one misfit gives both answers |
| First missing positive | ignore values outside 1..n; first misfit index + 1 |
| Find the duplicate (read-only) | Floyd’s cycle detection on i → a[i] |

## Sign marking

\`\`\`python
for x in a:
    j = abs(x) - 1
    if a[j] < 0: duplicate(abs(x))
    else: a[j] = -a[j]
\`\`\`

## Pitfalls

- Using \`for\` with \`i++\` after every swap misses values that arrive by swap: only advance when \`a[i]\` is settled.
- Without the \`a[i] != a[home]\` check, duplicates swap forever.
`;

const lesson: Lesson = {
  slug: 'cyclic-sort',
  video,
  body,
  quiz: [
    { q: 'In cyclic sort on values 1..n, where does value x belong?', options: ['index x', 'index x − 1', 'index n − x', 'anywhere'], answer: 1, why: 'Zero-based indexing: 1 → 0, …, n → n − 1.' },
    { q: 'Why is cyclic sort O(n) despite the while loop with swaps?', options: ['It is O(n²)', 'Each swap places at least one value permanently, so ≤ n swaps', 'Random luck', 'Because of hashing'], answer: 1, why: 'A value placed at home is never moved again.' },
    { q: 'What prevents infinite swapping with duplicates?', options: ['Sorting first', 'Skip when a[home] already equals a[i]', 'Using a set', 'Nothing'], answer: 1, why: 'A duplicate’s home is already taken by an equal value.' },
    { q: 'After cyclic sort, index i holds a value ≠ i + 1. Then…', options: ['i + 1 is missing', 'the array is invalid', 'i is a duplicate', 'sort again'], answer: 0, why: 'Its rightful value never arrived.' },
  ],
};

export default lesson;
