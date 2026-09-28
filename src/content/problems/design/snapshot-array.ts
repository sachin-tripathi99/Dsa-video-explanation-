import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { opsTable } from '../../designviz';

const LEN = 3;
const OPS: [string, number[]][] = [['set', [0, 5]], ['snap', []], ['set', [0, 6]], ['set', [1, 2]], ['snap', []], ['snap', []], ['set', [0, 1]], ['snap', []], ['get', [0, 2]], ['get', [1, 0]], ['get', [0, 3]]];

type Op = { ops: string[]; args: unknown[][] };
function ref(ops: string[], args: unknown[][]) {
  let cur: number[] = [];
  const snaps: number[][] = [];
  return ops.map((op, i) => {
    const a = args[i] as number[];
    if (op === 'SnapshotArray') { cur = Array(a[0]).fill(0); return null; }
    if (op === 'set') { cur[a[0]] = a[1]; return null; }
    if (op === 'snap') { snaps.push([...cur]); return snaps.length - 1; }
    return snaps[a[1]][a[0]];
  });
}

function video() {
  const v = new Video('snapshot-array', 'Snapshot Array');
  const outs = ref(['SnapshotArray', ...OPS.map((o) => o[0])], [[LEN], ...OPS.map((o) => o[1])]).slice(1);
  v.chapter('intro', 'The problem');
  v.say(`An array of length ${words(LEN)}, all zeros, with three operations: set an index, snap, which takes a snapshot and returns its id, and get, which reads an index as it was in a given snapshot.`);
  opsTable(v, OPS.map(([op, a]) => `${op}(${a.join(', ')})`), outs);
  v.say('Like saving versions of a document: you want to open any old version without keeping a full copy of every one.');

  v.chapter('brute', 'Brute force: copy the array on every snap', { cx: 'snap O(n) time and memory', code: ['snap(): copies.append(copy of arr)', 'get(i, s): copies[s][i]'] });
  v.clear();
  const tb = v.table('tb', ['snap', ...Array.from({ length: LEN }, (_, i) => `[${i}]`)], []);
  const cur = Array(LEN).fill(0);
  let s = 0;
  OPS.forEach(([op, a]) => { if (op === 'set') cur[a[0]] = a[1]; if (op === 'snap') tb.addRow([String(s++), ...cur.map(String)]); });
  v.line(0).eq('every snap stores all n values', 'bad').say('Copying the whole array on each snap makes get trivial, but with fifty thousand elements and fifty thousand snaps that is two and a half billion stored values, most of them unchanged copies.');

  v.chapter('optimal', 'Optimal: per-index history + binary search', { cx: 'set O(1) · snap O(1) · get O(log k)', code: ['history[i] = [(−1, 0)]  (sentinel)', 'set(i, v): append (snapId, v)', '  (overwrite if same snapId)', 'snap(): snapId += 1; return snapId − 1', 'get(i, s): last snap ≤ s → value'] });
  v.clear();
  const hist: [number, number][][] = Array.from({ length: LEN }, () => [[-1, 0]]);
  const fmt = (h: [number, number][]) => h.map(([sn, x]) => `${sn}:${x}`).join('  ');
  const ht = v.table('ht', ['index', 'history (snap : value)'], hist.map((h, i) => [String(i), fmt(h)]));
  const vars = v.vars('v', { snapId: 0 });
  v.line(0).say('Only record changes. Each index keeps a list of pairs: the snapshot id during which it was set, and the value. It starts with a sentinel meaning zero before anything happened.');
  let snapId = 0;
  OPS.forEach(([op, a], k) => {
    ht.clearTones();
    if (op === 'set') {
      const h = hist[a[0]];
      const same = h[h.length - 1][0] === snapId;
      if (same) h[h.length - 1] = [snapId, a[1]]; else h.push([snapId, a[1]]);
      ht.setCell(a[0], 1, fmt(h));
      ht.tone(a[0], 'active');
      v.line(1, 2).eq(`set(${a[0]}, ${a[1]}) → history[${a[0]}] ${same ? 'overwrites' : 'gains'} (${snapId} : ${a[1]})`);
      if (k === 0) v.say(`set index zero to five while the current snapshot id is zero: append zero colon five to index zero's history. Nothing else is touched.`);
      else v.hold(800);
    } else if (op === 'snap') {
      snapId++;
      vars.set({ snapId }, 'ok');
      v.line(3).eq(`snap() → ${snapId - 1}`, 'ok');
      if (k === 1) v.say('snap just bumps a counter and returns the old id. Constant time, no copying.');
      else v.hold(700);
      vars.set({ snapId });
    } else {
      const [i, sq] = a;
      const h = hist[i];
      ht.tone(i, 'active');
      let lo = 0, hi = h.length - 1, best = 0;
      while (lo <= hi) { const mid = (lo + hi) >> 1; if (h[mid][0] <= sq) { best = mid; lo = mid + 1; } else hi = mid - 1; }
      v.line(4).eq(`get(${i}, ${sq}): last entry with snap ≤ ${sq} in [${fmt(h)}] → ${h[best][0]}:${h[best][1]} → ${h[best][1]}`, 'ok');
      if (k === 8) v.say(`get index zero in snapshot two. Its history is sorted by snapshot id, so binary search for the last entry with id at most two: one colon six. During snapshot one, index zero became six, and nothing changed it before snapshot two was taken.`);
      else if (k === 9) v.say('get index one in snapshot zero: its only real entry was written during snapshot one, too late, so the sentinel answers zero.');
      else v.hold(900);
    }
  });
  v.answer(outs.filter((x) => x !== null).join(','));

  recap(v, [{ name: 'Copy on snap', time: 'O(n) snap', space: 'O(n · snaps)' }, { name: 'History + binary search', time: 'O(1) set/snap, O(log k) get', space: 'O(n + sets)' }], 'Store only changes, tagged with the snapshot id; binary search on read.', ['Versions / snapshots → per-item history + binary search'], 'Overwrite the last entry when set is called twice in the same snapshot.');
  return v.build();
}

const problem: Problem = {
  slug: 'snapshot-array',
  statement: 'Implement `SnapshotArray`:\n\n- `SnapshotArray(int length)` initialises an array of the given length, all zeros.\n- `void set(int index, int val)` sets the element at `index` to `val`.\n- `int snap()` takes a snapshot and returns its id: the number of times `snap()` was called minus 1.\n- `int get(int index, int snap_id)` returns the value at `index` at the time the snapshot `snap_id` was taken.',
  examples: [{ input: '["SnapshotArray","set","snap","set","get"]\n[[3],[0,5],[],[0,6],[0,0]]', output: '[null,null,0,null,5]' }],
  constraints: ['1 ≤ length ≤ 5 · 10⁴', '0 ≤ val ≤ 10⁹', '0 ≤ snap_id < number of snaps so far', 'at most 5 · 10⁴ calls'],
  hints: ['Do not copy the array.', 'Each index keeps (snap_id, value) pairs; binary search on get.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Copy on snap', idea: 'Store a full copy per snapshot.', time: 'O(n) snap', space: 'O(n · snaps)', bottleneck: 'Time and memory per snap.' },
    { id: 'optimal', kind: 'optimal', name: 'Per-index history', idea: 'Append (snapId, val) on set; binary search the last snap ≤ s on get.', time: 'O(1) set/snap, O(log k) get', space: 'O(n + sets)' },
  ],
  takeaway: 'Store **changes**, not copies; binary search the version.',
  video,
  judge: {
    type: 'design', cls: 'SnapshotArray', ctor: ['int'],
    methods: { set: { params: ['int', 'int'], ret: 'void' }, snap: { params: [], ret: 'int' }, get: { params: ['int', 'int'], ret: 'int' } },
    tests: [
      { ops: ['SnapshotArray', 'set', 'snap', 'set', 'get'], args: [[3], [0, 5], [], [0, 6], [0, 0]], out: [null, null, 0, null, 5] },
      { ops: ['SnapshotArray', ...OPS.map((o) => o[0])], args: [[LEN], ...OPS.map((o) => o[1])], out: [null, null, 0, null, null, 1, 2, null, 3, 6, 0, 1] },
      { ops: ['SnapshotArray', 'snap', 'snap', 'get', 'set', 'set', 'snap', 'get'], args: [[1], [], [], [0, 1], [0, 4], [0, 7], [], [0, 2]], out: [null, 0, 1, 0, null, null, 2, 7] },
    ],
    gen: (r: Rng): Op => {
      const n = r.int(1, 4);
      const ops = ['SnapshotArray'];
      const args: unknown[][] = [[n]];
      let snaps = 0;
      for (let k = 0; k < 30; k++) {
        const op = snaps === 0 ? r.pick(['set', 'snap']) : r.pick(['set', 'snap', 'get', 'get']);
        ops.push(op);
        if (op === 'set') args.push([r.int(0, n - 1), r.int(0, 9)]);
        else if (op === 'snap') { args.push([]); snaps++; }
        else args.push([r.int(0, n - 1), r.int(0, snaps - 1)]);
      }
      return { ops, args };
    },
    ref,
  },
};

export default problem;
