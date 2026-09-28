import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { dllScene, opsTable } from '../../designviz';

const CAP = 2;
const OPS: [string, number[]][] = [['put', [1, 1]], ['put', [2, 2]], ['get', [1]], ['put', [3, 3]], ['get', [2]], ['put', [4, 4]], ['get', [1]], ['get', [3]], ['get', [4]]];

type Op = { ops: string[]; args: unknown[][] };
function ref(ops: string[], args: unknown[][]) {
  let cap = 0;
  const m = new Map<number, number>();
  return ops.map((op, i) => {
    const a = args[i] as number[];
    if (op === 'LRUCache') { cap = a[0]; return null; }
    if (op === 'get') { if (!m.has(a[0])) return -1; const val = m.get(a[0])!; m.delete(a[0]); m.set(a[0], val); return val; }
    m.delete(a[0]); m.set(a[0], a[1]);
    if (m.size > cap) m.delete(m.keys().next().value!);
    return null;
  });
}

function video() {
  const v = new Video('lru-cache', 'LRU Cache');
  const outs = ref(['LRUCache', ...OPS.map((o) => o[0])], [[CAP], ...OPS.map((o) => o[1])]).slice(1);
  v.chapter('intro', 'The problem');
  v.say(`Build a cache with a fixed capacity, here ${words(CAP)}. get returns a key's value or minus one. put inserts or updates a key, and when the cache is over capacity it evicts the least recently used key. Both must run in constant time on average.`);
  opsTable(v, OPS.map(([op, a]) => `${op}(${a.join(', ')})`), outs);
  v.say('Think of a desk that holds two books. Whenever you need a third, the book you have not touched for the longest goes back on the shelf.');

  v.chapter('brute', 'Brute force: timestamps, scan to evict', { cx: 'get O(1) · put O(capacity)', code: ['map: key → (value, last used)', 'get / put: stamp the key with ++time', 'full on a new key: scan for the oldest stamp, evict it'] });
  v.clear();
  const tb = v.table('tb', ['key', 'value', 'last used'], [['1', '1', '3'], ['2', '2', '2']]);
  v.line(0, 1).say('Store each key with the time it was last used. Reading and writing just refresh the time.');
  tb.tone(1, 'bad');
  v.line(2).eq('put(3, 3): scan all keys → key 2 is oldest → evict', 'bad').say('But when the cache is full, finding the least recently used key means scanning every key for the oldest time. With a capacity of three thousand, every eviction costs three thousand steps.');

  v.chapter('optimal', 'Optimal: hash map + doubly linked list', { cx: 'O(1) each', code: ['get(k): not in map → −1', '  else move node to front; return its value', 'put(k, v): in map → update value, move to front', '  else add node at front; map[k] = node', '  over capacity → remove node before tail'] });
  v.clear();
  const d = dllScene(v, 'd', 'most recent → least recent');
  const m = v.map('m', { label: 'key → node' });
  v.layout('col').weight('d', 1.3);
  v.say('Keep keys in a doubly linked list ordered by use: most recent right after head, least recent right before tail. A hash map points from each key to its node, so we never search the list.');
  const vals = new Map<number, number>();
  OPS.forEach(([op, a], i) => {
    d.clearTones();
    m.clearTones();
    const k = a[0];
    if (op === 'get') {
      if (!vals.has(k)) {
        v.line(0).counter(`op ${i + 1}`).eq(`get(${k}) → not in map → −1`, 'bad');
        if (k === 2) v.say('get two: two was evicted, so the map has no entry. Minus one.');
        else v.hold(900);
        return;
      }
      d.front(k);
      d.tone(k, 'ok');
      m.tone(k, 'ok');
      v.line(1).counter(`op ${i + 1}`).eq(`get(${k}) → ${vals.get(k)}; node ${k} moves to front`, 'ok');
      if (i === 2) v.say('get one: the map finds node one. It was just used, so unlink it and relink it after head. Every node knows its neighbours, so that is a few pointer changes. Now two is the least recently used.');
      else v.hold(900);
      return;
    }
    const fresh = !vals.has(k);
    vals.set(k, a[1]);
    d.front(k, `${k}:${a[1]}`);
    m.put(k, `node ${k}`);
    d.tone(k, 'active');
    m.tone(k, 'active');
    v.line(fresh ? 3 : 2).counter(`op ${i + 1}`).eq(`put(${k}, ${a[1]}) → node ${k} at front`);
    if (i === 0) v.say('put one: a new node right after head, and a map entry pointing to it. The labels show key colon value.');
    else v.hold(800);
    if (vals.size > CAP) {
      const keys = d.keys();
      const old = Number(keys[keys.length - 1]);
      d.tone(old, 'bad');
      m.tone(old, 'bad');
      v.line(4).eq(`size ${vals.size} > ${CAP} → evict node ${old} (before tail)`, 'bad');
      if (i === 3) v.say(`put three makes three keys, one too many. The least recently used key is always the node just before tail: ${words(old)}. Remove it from the list and from the map.`);
      else v.hold(900);
      d.remove(old);
      m.del(old);
      vals.delete(old);
    }
  });
  d.clearTones();
  m.clearTones();
  v.eq(`outputs: ${outs.filter((x) => x !== null).join(', ')}`, 'ok').say('Every operation was a map lookup plus a few pointer changes: constant time.');
  v.answer(outs.map((x) => (x === null ? 'null' : x)).join(','));

  recap(v, [{ name: 'Timestamps + scan', time: 'O(1) get, O(cap) put', space: 'O(cap)' }, { name: 'Map + doubly linked list', time: 'O(1) each', space: 'O(cap)' }], 'Map finds the node; the list keeps recency order.', ['Evict least recently used in O(1) → map + DLL'], 'Sentinel head/tail nodes remove the empty-list special cases. Java LinkedHashMap and Python OrderedDict do this internally.');
  return v.build();
}

const problem: Problem = {
  slug: 'lru-cache',
  statement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\n- `LRUCache(int capacity)` initialises the cache with a positive size.\n- `int get(int key)` returns the value of the key if it exists, otherwise -1.\n- `void put(int key, int value)` updates the value if the key exists, otherwise adds the key-value pair. If the number of keys exceeds the capacity, evict the least recently used key.\n\n`get` and `put` must each run in O(1) average time.',
  examples: [{ input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', output: '[null,null,null,1,null,-1,null,-1,3,4]' }],
  constraints: ['1 ≤ capacity ≤ 3000', '0 ≤ key ≤ 10⁴', '0 ≤ value ≤ 10⁵', 'at most 2 · 10⁵ calls'],
  hints: ['A hash map gives O(1) lookup but no order.', 'A doubly linked list keeps order and removes a known node in O(1).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Timestamps', idea: 'Store the last-used time per key; scan for the oldest on eviction.', time: 'O(1) get, O(capacity) put', space: 'O(capacity)', bottleneck: 'Eviction scans every key.' },
    { id: 'optimal', kind: 'optimal', name: 'Map + doubly linked list', idea: 'Map key → node; move used nodes after head; evict the node before tail.', time: 'O(1)', space: 'O(capacity)' },
  ],
  takeaway: '**Hash map + doubly linked list** = O(1) recency order.',
  video,
  judge: {
    type: 'design', cls: 'LRUCache', ctor: ['int'],
    methods: { get: { params: ['int'], ret: 'int' }, put: { params: ['int', 'int'], ret: 'void' } },
    tests: [
      { ops: ['LRUCache', ...OPS.map((o) => o[0])], args: [[CAP], ...OPS.map((o) => o[1])], out: [null, null, null, 1, null, -1, null, -1, 3, 4] },
      { ops: ['LRUCache', 'put', 'put', 'put', 'get', 'get'], args: [[1], [2, 1], [2, 2], [3, 3], [2], [3]], out: [null, null, null, null, -1, 3] },
      { ops: ['LRUCache', 'put', 'put', 'put', 'put', 'get', 'get'], args: [[2], [2, 1], [1, 1], [2, 3], [4, 1], [1], [2]], out: [null, null, null, null, null, -1, 3] },
    ],
    gen: (r: Rng): Op => {
      const ops = ['LRUCache'];
      const args: unknown[][] = [[r.int(1, 3)]];
      for (let k = 0; k < 30; k++) {
        if (r.int(0, 1)) { ops.push('get'); args.push([r.int(0, 5)]); }
        else { ops.push('put'); args.push([r.int(0, 5), r.int(0, 20)]); }
      }
      return { ops, args };
    },
    ref,
  },
};

export default problem;
