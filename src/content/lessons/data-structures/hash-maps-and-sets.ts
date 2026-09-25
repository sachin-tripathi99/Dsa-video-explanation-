import type { Lesson } from '../../types';
import { Video } from '../../helpers';

const hash = (s: string) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

function video() {
  const v = new Video('hash-maps-and-sets', 'Hash maps and hash sets');
  v.chapter('intro', 'The coat check');
  v.text('t', { title: 'Find anything in one step', subtitle: 'A hash map stores key → value pairs with O(1) average lookup', big: true });
  v.say('Think of a coat check. You hand over your coat and get ticket forty-two. Later, ticket forty-two takes the attendant straight to your coat, without searching every hook. A hash map does exactly that for data.');

  v.chapter('buckets', 'How it works: buckets', { code: ['index = hash(key) % buckets', 'put the (key, value) in that bucket', 'lookup: same index → search only that bucket'] });
  v.clear();
  const B = 8;
  const rows: (string | null)[][] = Array.from({ length: B }, () => [null, null]);
  const g = v.grid('g', rows, { label: '8 buckets (an array); each bucket can hold a short chain', rowHead: Array.from({ length: B }, (_, i) => `[${i}]`), cellSize: 64 });
  v.say('Inside, a hash map is just an array of buckets. A hash function turns any key into a number, and taking it modulo the number of buckets picks one bucket.');
  const keys = ['cat', 'dog', 'emu', 'fox', 'act'];
  const fill: number[] = Array(B).fill(0);
  keys.forEach((k, i) => {
    const h = hash(k);
    const b = h % B;
    const slot = fill[b]++;
    g.clearTones().set(b, slot, k).tone(b, slot, slot > 0 ? 'warn' : 'active');
    v.line(0, 1).eq(`hash("${k}") = ${h} → ${h} % 8 = ${b}`, slot > 0 ? 'warn' : 'none');
    if (i === 0) v.say('Our toy hash adds up the character codes. Cat sums to three hundred and twelve; modulo eight, that is bucket zero.');
    else if (k === 'act') v.say('Act has the same letters as cat, so the same sum, the same bucket. That is a collision. The bucket simply keeps a short list, a chain, of everything that landed there.');
    else v.hold(800);
  });
  g.clearTones().tone(2, 0, 'ok');
  v.line(2).eq('lookup "dog": hash → bucket 2 → found', 'ok');
  v.say('To look up dog, compute the same hash, go straight to bucket two, and check the few keys there. No scanning of the whole table.');

  v.chapter('cost', 'Why O(1), and when it is not');
  v.clear();
  v.table('c', ['Situation', 'Lookup cost'], [
    ['Good hash, table not too full', 'O(1) average'],
    ['Table fills up → resize (double buckets, rehash all)', 'O(n) once, O(1) amortised'],
    ['Terrible hash: everything in one bucket', 'O(n) worst case'],
  ]).tone(0, 'ok').tone(2, 'bad');
  v.say('With a good hash function, keys spread evenly and each bucket holds only a few keys, so operations are constant time on average. When the table gets too full, it doubles and rehashes, just like a dynamic array. Only a terrible hash, with everything in one bucket, degrades to linear.');

  v.chapter('patterns', 'What hash maps are for', { code: ['seen = {}', 'for i, x in enumerate(nums):', '  if target − x in seen: return [seen[target − x], i]', '  seen[x] = i'] });
  v.clear();
  v.text('p', { title: 'Four questions a hash map answers instantly', lines: ['Have I seen this before?  → hash set', 'How many times?  → map value → count', 'Where did I see its partner?  → map value → index', 'Which group does it belong to?  → map key → list'], shown: 4 });
  v.say('Almost every hash map problem asks one of four questions. Have I seen this before? How many times? Where did I see its partner? Which group does it belong to?');
  v.clear();
  const nums = [2, 7, 11, 15];
  const a = v.array('nums', nums, { label: 'Two Sum: nums, target = 18' });
  const seen = v.map('seen', { label: 'seen: value → index' });
  v.layout('row');
  for (let i = 0; i < nums.length; i++) {
    const need = 18 - nums[i];
    a.clearTones().ptr('i', i).tone(i, 'active');
    if (seen.has(need)) {
      seen.clearTones().tone(need, 'ok');
      a.tone(Number(seen.get(need)), 'ok').tone(i, 'ok');
      v.line(2).eq(`need ${need} → seen at ${seen.get(need)} → [${seen.get(need)}, ${i}]`, 'ok');
      v.say('At eleven we need seven, and seven is in the map at index one. Answer found in a single pass. We will do this problem properly in the homework.');
      break;
    }
    seen.put(nums[i], i);
    v.line(3).eq(`need ${need}: not seen → store ${nums[i]} → ${i}`);
    if (i === 0) v.say('Here is the partner question in action. For each number, check whether its partner was seen before; if not, remember this number and its index.');
    else v.hold(700);
  }

  v.chapter('recap', 'Hash map vs other structures');
  v.clear().layout('col');
  v.table('r', ['Need', 'Use', 'Cost'], [
    ['Membership / dedupe', 'HashSet / set / unordered_set', 'O(1) avg'],
    ['Key → value, counts', 'HashMap / dict / unordered_map', 'O(1) avg'],
    ['Keys in sorted order, floor/ceiling', 'TreeMap / SortedDict / std::map', 'O(log n)'],
    ['Small fixed alphabet (a–z)', 'int[26] array', 'O(1), tiny'],
  ]);
  v.say('Use a hash set for membership, a hash map for counts and lookups. If you need keys in sorted order, use a tree map at log n. And for a small fixed alphabet, a plain array of twenty-six counts is even better.');
  return v.build();
}

const body = String.raw`
## The idea

A **hash map** (dictionary) stores **key → value** pairs. A **hash set** stores just keys. Both find, insert and delete in **O(1) on average**.

> Real-life picture: a coat check. Your ticket number sends the attendant straight to one hook. Nobody searches every hook.

## How it works

1. A **hash function** turns a key into an integer.
2. \`hash % capacity\` picks a **bucket** in an internal array.
3. Keys that land in the same bucket (**collisions**) are kept in a short list (chaining) or placed in the next free slot (open addressing).
4. When the table gets too full (the **load factor** passes ~0.75), it **resizes**: doubles the buckets and re-inserts everything. Like dynamic arrays, that's O(1) amortised.

## Operation costs

| Operation | Average | Worst |
|---|---|---|
| insert / put | O(1) | O(n) |
| lookup / contains / get | O(1) | O(n) |
| delete | O(1) | O(n) |
| iterate all | O(n) | O(n) |

The worst case needs a pathological hash; in interviews, say "O(1) average".

## In your language

\`\`\`java
Map<String, Integer> count = new HashMap<>();
count.put("a", 1);
count.merge("a", 1, Integer::sum);          // increment
count.getOrDefault("z", 0);                 // 0 if missing
count.containsKey("a");
for (Map.Entry<String, Integer> e : count.entrySet()) { e.getKey(); e.getValue(); }

Set<Integer> seen = new HashSet<>();
seen.add(5); seen.contains(5); seen.remove(5);

TreeMap<Integer, String> sorted = new TreeMap<>();   // O(log n), keys in order
sorted.floorKey(10); sorted.ceilingKey(10);
\`\`\`

\`\`\`python
count = {}
count["a"] = count.get("a", 0) + 1         # increment
from collections import Counter, defaultdict
freq = Counter("banana")                   # {'a': 3, 'n': 2, 'b': 1}
groups = defaultdict(list)                 # missing keys start as []
groups["key"].append(1)

seen = set()
seen.add(5); 5 in seen; seen.discard(5)
\`\`\`

\`\`\`cpp
unordered_map<string, int> count;
count["a"]++;                               // missing keys start at 0
count.count("z");                           // 1 if present, else 0
for (auto& [key, value] : count) { /* ... */ }

unordered_set<int> seen;
seen.insert(5); seen.count(5); seen.erase(5);

map<int, string> sorted;                    // O(log n), keys in order
auto it = sorted.lower_bound(10);           // first key >= 10
\`\`\`

## The four hash map questions

| Question | Structure | Example |
|---|---|---|
| Have I seen this before? | set | [Contains Duplicate](#/problem/contains-duplicate) |
| How many times? | map: key → count | [Valid Anagram](#/problem/valid-anagram) |
| Where is its partner? | map: value → index | [Two Sum](#/problem/two-sum) |
| Which group does it belong to? | map: signature → list | [Group Anagrams](#/problem/group-anagrams) |

A fifth, advanced use: **prefix sums + hash map** to count subarrays with a given sum ([Subarray Sum Equals K](#/problem/subarray-sum-equals-k)).

## Choosing keys

- Keys must be **immutable / hashable**: strings, numbers, tuples (Python). Lists can't be dict keys in Python; convert to a tuple or string.
- For groups, build a **signature**: sorted characters, or a count tuple.
- In Java, use \`Integer\`/\`String\` keys; for pairs, encode as a string \`"r,c"\` or a \`long\` (\`r * 100000L + c\`).

## When not to use a hash map

- You need keys **in order** or the nearest key → a tree map (O(log n)).
- The keys are small integers or a–z → a plain array is faster and smaller.
- You only need to compare neighbours in sorted data → sort instead.
`;

const lesson: Lesson = {
  slug: 'hash-maps-and-sets',
  video,
  body,
  quiz: [
    { q: 'Average cost of looking up a key in a hash map?', options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'], answer: 1, why: 'The hash sends you straight to one small bucket.' },
    { q: 'What is a collision?', options: ['Two keys with equal values', 'Two different keys landing in the same bucket', 'A key that is missing', 'Resizing the table'], answer: 1, why: 'Collisions are handled with chains or probing.' },
    { q: 'You need all keys in sorted order and the largest key ≤ x. Best structure?', options: ['HashMap', 'TreeMap / std::map', 'Array of 26', 'Hash set'], answer: 1, why: 'Balanced-tree maps keep keys ordered with O(log n) operations.' },
    { q: 'Which is a good key for grouping anagrams?', options: ['The word itself', 'The word’s sorted letters', 'The word’s length only', 'A random number'], answer: 1, why: 'All anagrams share the same sorted letters (or the same letter counts).' },
    { q: 'Two Sum with a hash map runs in…', options: ['O(n²)', 'O(n log n)', 'O(n) time, O(n) space', 'O(1)'], answer: 2, why: 'One pass; each lookup is O(1) on average.' },
  ],
};

export default lesson;
