import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { dllScene } from '../../designviz';

function video() {
  const v = new Video('designing-data-structures', 'Combining structures: LRU and friends');

  v.chapter('intro', 'The design recipe', { code: ['1. list every operation', '2. write the cost each one must have', '3. pick a structure that makes each cheap', '4. keep them in sync on every change'] });
  v.say('Design questions sound open-ended, but they follow a recipe. Write down the operations the class must support, and the cost each one must have. Then find a structure that makes each operation cheap. When no single structure does everything, use two and keep them in sync.');
  v.line(3).say('The last step is where bugs hide: every operation must update every structure, or they drift apart.');

  v.chapter('random', 'Example: insert, remove and getRandom, all O(1)', { code: ['insert(x): map[x] = len(arr); arr.append(x)', 'remove(x): i = map[x]; last = arr[−1]', '  arr[i] = last; map[last] = i', '  arr.pop(); delete map[x]', 'getRandom(): arr[random index]'] });
  v.clear();
  const arr = [10, 20, 30, 40];
  const a = v.array('a', arr, { label: 'array: values packed together' });
  const m = v.map('m', { label: 'hash map: value → index' });
  arr.forEach((x, i) => m.put(x, i));
  v.layout('row');
  v.say('A set that supports insert, remove, and returning a random element, each in constant time. A hash map alone cannot pick a random element fairly. An array alone picks randomly by index, but removing from the middle means shifting. So use both: the array holds the values, the map remembers where each value sits.');
  a.push(50).tone(4, 'ok');
  m.put(50, 4);
  m.tone(50, 'ok');
  v.line(0).eq('insert(50): append, remember index 4', 'ok').say('Insert appends to the array and records the index in the map.');
  a.clearTones().tone(1, 'bad').tone(4, 'active');
  m.clearTones();
  m.tone(20, 'bad');
  v.line(1).eq('remove(20): map says index 1; the last value is 50').say('To remove twenty, the map says it sits at index one. Removing from the middle would shift everything after it, so instead move the last value, fifty, into the hole.');
  a.set(1, 50).tone(1, 'ok');
  m.put(50, 1);
  m.tone(50, 'ok');
  v.line(2).eq('arr[1] = 50, map[50] = 1', 'ok').say('Fifty now lives at index one, so its map entry must change too. This is the keep-in-sync step.');
  a.pop();
  m.del(20);
  a.clearTones();
  v.line(3).eq('pop the last slot, delete 20 from the map', 'ok').say('Now pop the last slot and delete twenty from the map. Order in the array does not matter for a set, which is why swapping is allowed.');
  a.tone(2, 'pivot');
  v.line(4).eq('getRandom → arr[2] = 30').say('Get random picks a random index of the packed array: every value equally likely, in constant time.');

  v.chapter('lru', 'Hash map + doubly linked list: order with O(1) moves', { code: ['map: key → node', 'list: most recent … least recent', 'get(k): node = map[k]; move node to front', 'evict: remove the node before tail'] });
  v.clear();
  const d = dllScene(v, 'd', 'doubly linked list: most recent → least recent');
  const mm = v.map('mm', { label: 'hash map: key → node' });
  v.layout('col').weight('d', 1.4);
  for (const k of [3, 1, 2]) { d.back(k, `${k}`); mm.put(k, `node ${k}`); }
  v.line(0, 1).say('The famous combination: a cache that forgets the least recently used entry. The list keeps entries in order of use, most recent next to head. The map jumps straight to any node, so we never search the list.');
  d.tone(2, 'active');
  mm.tone(2, 'active');
  v.line(2).eq('get(2): map → node 2 (no scan)').say('Reading key two: the map hands us its node directly.');
  d.front(2);
  d.clearTones();
  d.tone(2, 'ok');
  v.line(2).eq('unlink node 2, relink it after head: O(1)', 'ok').say('Because every node knows both neighbours, unlinking it and relinking it after head are a few pointer changes. Constant time. And the least recently used entry is always the node just before tail.');
  d.clearTones();
  d.tone(d.keys()[d.keys().length - 1], 'bad');
  v.line(3).eq(`evict → node ${d.keys()[d.keys().length - 1]}, before tail`, 'bad').hold(1200);

  v.chapter('history', 'Sorted history + binary search: time travel', { cx: 'O(log n) per read', code: ['write: history[key] += (t, val)', 'read(key, t): last entry with time ≤ t', '  → binary search'] });
  v.clear();
  const H = [[1, 'cold'], [4, 'mild'], [7, 'warm'], [9, 'hot']] as const;
  const ha = v.array('h', H.map(([t]) => t), { label: 'history of "weather": times' });
  ha.subs(H.map(([, x]) => x));
  v.say('Another family asks for values in the past: what was this key at time t, or in snapshot s. Writes arrive in increasing time, so each key keeps its history already sorted.');
  const q = 8;
  let lo = 0, hi = H.length - 1, best = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    ha.clearTones().ptrs({ lo, hi, mid }).tone(mid, H[mid][0] <= q ? 'ok' : 'bad');
    if (H[mid][0] <= q) { best = mid; lo = mid + 1; } else hi = mid - 1;
    v.line(2).eq(`time[${mid}] = ${H[mid][0]} ${H[mid][0] <= q ? '≤' : '>'} ${q} → ${H[mid][0] <= q ? 'candidate, go right' : 'go left'}`);
    v.hold(900);
  }
  ha.noPtr().clearTones().tone(best, 'ok');
  v.line(1).eq(`read(weather, ${q}) → "${H[best][1]}"`, 'ok').say(`Reading at time ${words(q)} means the last write at or before ${words(q)}. Binary search finds it in log n steps: time ${words(H[best][0])}, value ${H[best][1]}.`);

  v.chapter('table', 'Recognising the combination');
  v.clear();
  v.table('t', ['Requirement', 'Combination'], [
    ['evict least recently used, O(1)', 'hash map + doubly linked list'],
    ['evict least frequently used, O(1)', 'map + one list per frequency + min frequency'],
    ['random element in O(1)', 'array + map of value → index'],
    ['value at time t / snapshot s', 'per-key sorted history + binary search'],
    ['k most recent across many users', 'heap merging each user’s newest items'],
  ]);
  v.say('Every one of these is two simple structures glued together, each covering the other’s weak spot.');
  return v.build();
}

const body = String.raw`
## The recipe

1. List the operations and the complexity each must have.
2. For each operation, name the structure that makes it cheap.
3. If one structure cannot do all of them, combine two.
4. On every mutation, update **all** structures (this is where bugs live).

> Real-life picture: a library keeps books on shelves (fast browsing in order) and a catalogue card index (fast lookup by title). Every new book updates both.

## Insert / remove / getRandom in O(1)

\`\`\`java
class RandomizedSet {
    List<Integer> arr = new ArrayList<>();
    Map<Integer, Integer> pos = new HashMap<>();
    Random rnd = new Random();

    boolean insert(int x) {
        if (pos.containsKey(x)) return false;
        pos.put(x, arr.size()); arr.add(x);
        return true;
    }
    boolean remove(int x) {
        Integer i = pos.remove(x);
        if (i == null) return false;
        int last = arr.remove(arr.size() - 1);
        if (i < arr.size()) { arr.set(i, last); pos.put(last, i); }   // move last into the hole
        return true;
    }
    int getRandom() { return arr.get(rnd.nextInt(arr.size())); }
}
\`\`\`

\`\`\`python
class RandomizedSet:
    def __init__(self):
        self.arr, self.pos = [], {}

    def insert(self, x):
        if x in self.pos:
            return False
        self.pos[x] = len(self.arr)
        self.arr.append(x)
        return True

    def remove(self, x):
        if x not in self.pos:
            return False
        i, last = self.pos.pop(x), self.arr.pop()
        if i < len(self.arr):                   # move last into the hole
            self.arr[i], self.pos[last] = last, i
        return True

    def getRandom(self):
        return random.choice(self.arr)
\`\`\`

\`\`\`cpp
class RandomizedSet {
    vector<int> arr;
    unordered_map<int, int> pos;
public:
    bool insert(int x) {
        if (pos.count(x)) return false;
        pos[x] = arr.size(); arr.push_back(x);
        return true;
    }
    bool remove(int x) {
        auto it = pos.find(x);
        if (it == pos.end()) return false;
        int i = it->second, last = arr.back();
        arr[i] = last; pos[last] = i;                        // move last into the hole
        arr.pop_back(); pos.erase(x);
        return true;
    }
    int getRandom() { return arr[rand() % arr.size()]; }
};
\`\`\`

## Common combinations

| Requirement | Structures |
|---|---|
| LRU eviction | hash map + doubly linked list (sentinels make edge cases vanish) |
| LFU eviction | key → (value, freq), freq → ordered keys, \`minFreq\` |
| time travel / snapshots | per-key list of (time, value) + binary search |
| merged recent feeds | per-user lists + heap |

## Pitfalls

- Forgetting to update the second structure (map entry of the moved element, stale nodes).
- Removing the last element in RandomizedSet: the swap must handle \`i == last index\`.
- Head/tail **sentinel** nodes remove every null check from linked-list code.
`;

const lesson: Lesson = {
  slug: 'designing-data-structures',
  video,
  body,
  quiz: [
    { q: 'Why a doubly (not singly) linked list for LRU?', options: ['Less memory', 'To unlink a node in O(1) given only the node', 'To sort keys', 'For binary search'], answer: 1, why: 'Unlinking needs the previous node; a singly linked list would have to search for it.' },
    { q: 'RandomizedSet.remove(x) runs in O(1) by…', options: ['shifting the array', 'swapping x with the last element and popping', 'marking x as deleted', 'rebuilding the map'], answer: 1, why: 'Order does not matter, so fill the hole with the last element.' },
    { q: 'Value of a key at time t (writes in increasing time)?', options: ['Scan all keys', 'Binary search the key’s history', 'Heap of times', 'Sort on every read'], answer: 1, why: 'Each key’s history is already sorted by time.' },
    { q: 'In LRU, the entry to evict is…', options: ['right after head', 'right before tail', 'the smallest key', 'random'], answer: 1, why: 'Most recent entries are moved next to head, so the oldest drifts to the tail.' },
  ],
};

export default lesson;
