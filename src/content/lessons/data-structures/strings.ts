import type { Lesson } from '../../types';
import { Video } from '../../helpers';

function video() {
  const v = new Video('strings', 'Strings and characters');
  v.chapter('intro', 'A string is an array of characters');
  const s = v.array('s', [...'hello'], { label: 's = "hello"' });
  v.say('A string is just an array of characters. s of zero is h, s of four is o. Everything you learned about arrays applies: O of one access by index, O of n to scan.');
  s.subs(['104', '101', '108', '108', '111']);
  v.eq('each character is stored as a number (its code)');
  v.say('Under the hood, each character is a number. Lower-case a is ninety-seven, b is ninety-eight, and so on. That is why c minus a gives a letter’s position in the alphabet, from zero to twenty-five.');

  v.chapter('freq', 'Counting letters with an array of 26', { code: ['count = [0] * 26', 'for c in s:', '  count[c − "a"] += 1'] });
  v.clear();
  const w = 'banana';
  const src = v.array('w', [...w], { label: 's = "banana"' });
  const cnt = v.array('cnt', Array(26).fill(0), { label: 'count[c − a] for a … z', showIdx: false });
  cnt.subs('abcdefghijklmnopqrstuvwxyz'.split(''));
  [...w].forEach((c, i) => {
    const k = c.charCodeAt(0) - 97;
    cnt.set(k, (cnt.get(k) as number) + 1).clearTones().tone(k, 'active');
    src.clearTones().tone(i, 'active');
    v.line(2).eq(`'${c}' − 'a' = ${k} → count[${k}]++`);
    if (i === 0) v.say('A classic trick: count letters in an array of twenty-six. The index is c minus a. It is faster and smaller than a hash map when the alphabet is fixed.');
    else v.hold(420);
  });
  cnt.clearTones();
  v.eq('b:1, a:3, n:2', 'ok').say('Letter counts are the key to anagram problems, which we will meet with hash maps.');

  v.chapter('immutable', 'Immutable strings and builders', { code: ['s = ""', 'for word in words:', '  s = s + word      ← copies s every time'] });
  v.clear();
  v.bars('cost', [
    { label: 'copy 1', value: 1 }, { label: 'copy 2', value: 2 }, { label: 'copy 3', value: 3 }, { label: 'copy 4', value: 4 }, { label: 'copy n', value: 8, text: 'n chars' },
  ], { label: 'characters copied by each + in a loop' });
  v.say('In Java and Python, strings are immutable: you can not change them in place. So s equals s plus word creates a brand new string and copies everything so far. In a loop, that adds up to n squared.');
  v.clear();
  v.table('b', ['Language', 'Build strings with', 'Mutable char array'], [
    ['Java', 'StringBuilder sb; sb.append(x); sb.toString()', 's.toCharArray()'],
    ['Python', "parts.append(x); ''.join(parts)", 'list(s)'],
    ['C++', 's += x (std::string is mutable)', 'std::string itself'],
  ]);
  v.say('The fix: use a string builder in Java, or collect pieces in a list and join them in Python. C plus plus strings are mutable, so plus equals is fine there.');

  v.chapter('ops', 'What string operations cost');
  v.clear();
  v.table('ops', ['Operation', 'Cost'], [
    ['length, s[i]', 'O(1)'],
    ['s == t', 'O(n)'],
    ['substring / slice of length k', 'O(k) (copies)'],
    ['s + t', 'O(n + m) (new string)'],
    ['find / indexOf (naive)', 'O(n · m)'],
    ['split, join, reverse', 'O(n)'],
  ]);
  v.say('Know these costs. Comparing strings, slicing and concatenating all copy or scan characters. Hidden slices inside a loop are a common source of accidental n squared.');

  v.chapter('pal', 'Palindromes: two pointers', { code: ['l, r = 0, n − 1', 'while l < r:', '  if s[l] != s[r]: return false', '  l += 1; r −= 1', 'return true'] });
  v.clear();
  const p = v.array('p', [...'racecar'], { label: '"racecar"' });
  let l = 0;
  let r = 6;
  while (l < r) {
    p.clearTones().toneRange(0, l - 1, 'ok').toneRange(r + 1, 6, 'ok').ptrs({ l, r }).tone([l, r], 'cmp');
    v.line(2).eq(`'${'racecar'[l]}' == '${'racecar'[r]}'`, 'ok');
    if (l === 0) v.say('Checking whether a string is a palindrome is a two-pointer walk from both ends toward the middle.');
    else v.hold(600);
    l++;
    r--;
  }
  p.clearTones().toneRange(0, 6, 'ok').noPtr();
  v.eq('palindrome ✓', 'ok').hold(700);

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Strings in one minute', lines: ['A string is an array of characters (numbers underneath)', '`c − \'a\'` maps letters to 0…25 → count with int[26]', 'Immutable in Java/Python → build with StringBuilder / join', 'Slicing and comparing are O(length), not O(1)', 'Palindromes, reversals → two pointers'] });
  v.say('Strings are arrays with a few twists: character codes, immutability, and hidden copying. Next, hash maps, the most useful tool in interviews.');
  return v.build();
}

const body = String.raw`
## The idea

A **string** is a sequence of characters, stored like an array. \`s[i]\` is O(1); scanning is O(n). Each character is stored as a number (its character code): \`'a'\` is 97, \`'A'\` is 65, \`'0'\` is 48.

> Real-life picture: a string is a row of letter tiles in Scrabble. You can read any tile instantly, but to insert a tile in the middle you have to slide the rest over.

## Character arithmetic

| Trick | Meaning |
|---|---|
| \`c - 'a'\` | position of a lowercase letter, 0…25 |
| \`c - '0'\` | numeric value of a digit character |
| \`(char)('a' + k)\` / \`chr(ord('a') + k)\` | k-th letter |
| \`Character.isLetterOrDigit(c)\` / \`c.isalnum()\` / \`isalnum(c)\` | letter or digit test |
| \`Character.toLowerCase(c)\` / \`c.lower()\` / \`tolower(c)\` | case-insensitive comparisons |

Counting letters in an \`int[26]\` is faster and smaller than a hash map when the alphabet is known.

## Immutability and building strings

Java and Python strings are **immutable**. \`s = s + x\` in a loop copies the whole string every time: O(n²) total.

\`\`\`java
StringBuilder sb = new StringBuilder();
for (String w : words) sb.append(w).append(' ');
String result = sb.toString().trim();
char[] chars = s.toCharArray();          // mutable copy when you need to edit
\`\`\`

\`\`\`python
parts = []
for w in words:
    parts.append(w)
result = " ".join(parts)
chars = list(s)                          # mutable copy when you need to edit
\`\`\`

\`\`\`cpp
string result;                           // std::string is mutable
for (auto& w : words) { result += w; result += ' '; }
if (!result.empty()) result.pop_back();
\`\`\`

## Operation costs

| Operation | Cost |
|---|---|
| length, index access | O(1) |
| equality check | O(n) |
| substring / slice of length k | O(k) |
| concatenation | O(n + m) |
| naive find / indexOf / \`in\` | O(n · m) worst case |
| split, join, reverse, toLowerCase | O(n) |

## Patterns on strings

- **Two pointers** for palindromes and reversals.
- **Frequency counts** (\`int[26]\` or a hash map) for anagrams and permutations.
- **Sliding window** for the longest/shortest substring with a property.
- **Stack** for brackets and nested encodings.
- **DP** for subsequences and edit distance.
- **KMP / rolling hash** for fast pattern matching ([String matching](#/learn/string-matching)).

## Pitfalls

- Comparing strings with \`==\` in Java compares references; use \`.equals()\`.
- Forgetting that \`substring\` / slicing copies: slicing inside a loop can make an O(n) algorithm O(n²).
- Unicode: in interviews assume ASCII unless told otherwise, but mention it.
- Leading, trailing and repeated spaces when splitting.
`;

const lesson: Lesson = {
  slug: 'strings',
  video,
  body,
  quiz: [
    { q: "What is `'e' - 'a'`?", options: ['4', '5', '101', 'e'], answer: 0, why: 'Letters are consecutive codes, so e is 4 positions after a.' },
    { q: 'Building a string with `s = s + c` inside a loop of n steps in Java costs…', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 2, why: 'Each + copies the whole string so far. Use StringBuilder.' },
    { q: 'How much does taking a substring of length k cost?', options: ['O(1)', 'O(k)', 'O(n²)', 'O(log k)'], answer: 1, why: 'It copies k characters.' },
    { q: 'Best structure to count lowercase letters?', options: ['A sorted list', 'An int array of size 26', 'A linked list', 'A 2D array'], answer: 1, why: 'Index with c − a: O(1) updates, tiny memory.' },
  ],
};

export default lesson;
