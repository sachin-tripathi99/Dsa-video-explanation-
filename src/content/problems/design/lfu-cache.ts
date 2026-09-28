import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { opsTable } from '../../designviz';

const CAP = 2;
const OPS: [string, number[]][] = [['put', [1, 1]], ['put', [2, 2]], ['get', [1]], ['put', [3, 3]], ['get', [2]], ['get', [3]], ['put', [4, 4]], ['get', [1]], ['get', [3]], ['get', [4]]];

type Op = { ops: string[]; args: unknown[][] };
function ref(ops: string[], args: unknown[][]) {
  let cap = 0, clock = 0;
  const m = new Map<number, { v: number; f: number; t: number }>();
  return ops.map((op, i) => {
    const a = args[i] as number[];
    if (op === 'LFUCache') { cap = a[0]; return null; }
    const e = m.get(a[0]);
    if (op === 'get') { if (!e) return -1; e.f++; e.t = ++clock; return e.v; }
    if (e) { e.v = a[1]; e.f++; e.t = ++clock; return null; }
    if (m.size === cap) {
      let worst = -1;
      for (const [k, x] of m) { const w = m.get(worst); if (!w || x.f < w.f || (x.f === w.f && x.t < w.t)) worst = k; }
      m.delete(worst);
    }
    m.set(a[0], { v: a[1], f: 1, t: ++clock });
    return null;
  });
}

function video() {
  const v = new Video('lfu-cache', 'LFU Cache');
  const outs = ref(['LFUCache', ...OPS.map((o) => o[0])], [[CAP], ...OPS.map((o) => o[1])]).slice(1);
  v.chapter('intro', 'The problem');
  opsTable(v, OPS.map(([op, a]) => `${op}(${a.join(', ')})`), outs);
  v.say(`Like LRU, but eviction removes the least frequently used key: the one used the fewest times. If several keys tie, remove the least recently used of them. Capacity ${words(CAP)}, and get and put must be constant time.`);

  v.chapter('brute', 'Brute force: counts and timestamps, scan to evict', { cx: 'O(capacity) put', code: ['map: key → (value, uses, last used)', 'evict: scan for fewest uses, then oldest'] });
  v.clear();
  const tb = v.table('tb', ['key', 'value', 'uses', 'last used'], [['1', '1', '2', '3'], ['2', '2', '1', '2']]);
  tb.tone(1, 'bad');
  v.line(1).eq('put(3, 3): scan → key 2 has the fewest uses → evict', 'bad').say('Counting uses per key is easy. The hard part is finding the key to evict without scanning all of them.');

  v.chapter('optimal', 'Optimal: one LRU list per frequency', { cx: 'O(1) each', code: ['key → (value, freq); freq → keys, oldest first', 'use(k): move k from bucket f to bucket f + 1', '  bucket f empty and f == minFreq → minFreq += 1', 'put new: full → evict oldest key of bucket minFreq', '  insert with freq 1; minFreq = 1'] });
  v.clear();
  const vals = new Map<number, number>(), freq = new Map<number, number>();
  const buckets = new Map<number, number[]>();
  let minF = 0;
  const bt = v.table('bt', ['uses', 'keys (least → most recent)'], []);
  const m = v.map('m', { label: 'key → value, uses' });
  const vars = v.vars('v', { minFreq: 0 });
  v.layout('row');
  const draw = (hot?: number, tone: 'active' | 'ok' | 'bad' = 'active') => {
    const fs = [...buckets.keys()].filter((f) => buckets.get(f)!.length).sort((a, b) => a - b);
    bt.rows(fs.map((f) => [String(f), buckets.get(f)!.join(', ')]));
    bt.clearTones();
    fs.forEach((f, r) => { if (f === minF) bt.tone(r, 'warn'); });
    if (hot !== undefined && freq.has(hot)) bt.tone(fs.indexOf(freq.get(hot)!), tone);
    m.clearTones();
    if (hot !== undefined && freq.has(hot)) m.tone(hot, tone);
    vars.set({ minFreq: minF });
  };
  const bump = (k: number) => {
    const f = freq.get(k)!;
    buckets.set(f, buckets.get(f)!.filter((x) => x !== k));
    if (!buckets.get(f)!.length && f === minF) minF++;
    freq.set(k, f + 1);
    if (!buckets.has(f + 1)) buckets.set(f + 1, []);
    buckets.get(f + 1)!.push(k);
    m.put(k, `${vals.get(k)}, ${f + 1}`);
  };
  v.say('Group keys by how often they were used. Each group is a small LRU list, oldest first. A map from key to value and count finds any key, and we remember the lowest count that still has keys: eviction always happens in that group.');
  let movedSaid = false;
  OPS.forEach(([op, a], i) => {
    const k = a[0];
    if (op === 'get') {
      if (!vals.has(k)) {
        draw();
        v.line(0).counter(`op ${i + 1}`).eq(`get(${k}) → −1`, 'bad');
        v.hold(800);
        return;
      }
      const before = minF;
      bump(k);
      draw(k, 'ok');
      v.line(1, 2).counter(`op ${i + 1}`).eq(`get(${k}) = ${vals.get(k)} → uses ${freq.get(k)}${minF !== before ? `, minFreq → ${minF}` : ''}`, 'ok');
      if (i === 2) v.say(`get one returns one, and key one moves from the group used once to the group used twice.`);
      else if (minF !== before && !movedSaid) { movedSaid = true; v.say(`get ${words(k)} moves it up to ${words(freq.get(k)!)} uses. The group for ${words(before)} use is now empty and it was the minimum, so the minimum moves up to ${words(minF)}.`); }
      else v.hold(800);
      return;
    }
    if (vals.has(k)) {
      vals.set(k, a[1]);
      bump(k);
      draw(k);
      v.line(1).counter(`op ${i + 1}`).eq(`put(${k}, ${a[1]}) updates → uses ${freq.get(k)}`).hold(800);
      return;
    }
    if (vals.size === CAP) {
      const old = buckets.get(minF)![0];
      draw(old, 'bad');
      v.line(3).counter(`op ${i + 1}`).eq(`put(${k}, ${a[1]}): full → evict oldest in bucket ${minF}: key ${old}`, 'bad');
      if (i === 3) v.say(`put three on a full cache. The lowest count is one, and the only key used once is two, so evict two.`);
      else v.say(`put four: now the lowest count is two, and both one and three were used twice. The tie goes to the least recent in that group, key one, at the front of the list.`);
      buckets.set(minF, buckets.get(minF)!.slice(1));
      vals.delete(old); freq.delete(old); m.del(old);
    }
    vals.set(k, a[1]);
    freq.set(k, 1);
    if (!buckets.has(1)) buckets.set(1, []);
    buckets.get(1)!.push(k);
    minF = 1;
    m.put(k, `${a[1]}, 1`);
    draw(k);
    v.line(4).counter(`op ${i + 1}`).eq(`put(${k}, ${a[1]}) → uses 1, minFreq = 1`);
    if (i === 0) v.say('A new key has been used once: it joins group one, and the minimum resets to one.');
    else v.hold(800);
  });
  v.eq(`outputs: ${outs.filter((x) => x !== null).join(', ')}`, 'ok').say('Every step touched one key, two groups and the minimum: constant time.');
  v.answer(outs.filter((x) => x !== null).join(','));

  recap(v, [{ name: 'Counts + scan', time: 'O(capacity) put', space: 'O(capacity)' }, { name: 'Frequency buckets of LRU lists', time: 'O(1)', space: 'O(capacity)' }], 'Buckets by frequency, LRU order inside each, and the minimum count.', ['Evict least frequently used → freq → ordered keys + minFreq'], 'The minimum count only moves up by one on use, and resets to 1 on every insert.');
  return v.build();
}

const problem: Problem = {
  slug: 'lfu-cache',
  statement: 'Design a Least Frequently Used (LFU) cache.\n\n- `LFUCache(int capacity)` initialises the cache.\n- `int get(int key)` returns the value of the key if it exists, otherwise -1.\n- `void put(int key, int value)` updates or inserts the key. When the cache reaches capacity, before inserting a new key, evict the least frequently used key; on a tie, evict the least recently used among them.\n\nEach `get` or `put` of a key counts as a use. Both operations must run in O(1) average time.',
  examples: [{ input: '["LFUCache","put","put","get","put","get","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[3],[4,4],[1],[3],[4]]', output: '[null,null,null,1,null,-1,3,null,-1,3,4]' }],
  constraints: ['1 ≤ capacity ≤ 10⁴', '0 ≤ key ≤ 10⁵', '0 ≤ value ≤ 10⁹', 'at most 2 · 10⁵ calls'],
  hints: ['Group keys by use count.', 'Keep each group in recency order and remember the minimum count.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Counts + scan', idea: 'Store uses and last-used time per key; scan to evict.', time: 'O(capacity) put', space: 'O(capacity)', bottleneck: 'Eviction scans every key.' },
    { id: 'optimal', kind: 'optimal', name: 'Frequency buckets', idea: 'key → (value, freq); freq → ordered keys; minFreq.', time: 'O(1)', space: 'O(capacity)' },
  ],
  takeaway: 'LFU = **frequency buckets**, each an LRU list, plus **minFreq**.',
  video,
  judge: {
    type: 'design', cls: 'LFUCache', ctor: ['int'],
    methods: { get: { params: ['int'], ret: 'int' }, put: { params: ['int', 'int'], ret: 'void' } },
    tests: [
      { ops: ['LFUCache', ...OPS.map((o) => o[0])], args: [[CAP], ...OPS.map((o) => o[1])], out: [null, null, null, 1, null, -1, 3, null, -1, 3, 4] },
      { ops: ['LFUCache', 'put', 'get', 'put', 'get', 'get'], args: [[1], [1, 1], [1], [2, 2], [1], [2]], out: [null, null, 1, null, -1, 2] },
      { ops: ['LFUCache', 'put', 'put', 'put', 'put', 'get', 'get'], args: [[2], [3, 1], [2, 1], [2, 2], [4, 4], [2], [3]], out: [null, null, null, null, null, 2, -1] },
    ],
    gen: (r: Rng): Op => {
      const ops = ['LFUCache'];
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
