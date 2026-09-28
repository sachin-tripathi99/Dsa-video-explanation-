import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const KEY = 'stock';
const H: [number, string][] = [[2, '150'], [5, '152'], [8, '149'], [11, '155'], [14, '158']];
const QS = [12, 1];

type Op = { ops: string[]; args: unknown[][] };
function ref(ops: string[], args: unknown[][]) {
  const m = new Map<string, [number, string][]>();
  return ops.map((op, i) => {
    const a = args[i];
    if (op === 'TimeMap') return null;
    if (op === 'set') { const k = a[0] as string; if (!m.has(k)) m.set(k, []); m.get(k)!.push([a[2] as number, a[1] as string]); return null; }
    const h = m.get(a[0] as string) ?? [];
    let best = '';
    for (const [t, val] of h) if (t <= (a[1] as number)) best = val;
    return best;
  });
}

function video() {
  const v = new Video('time-based-key-value-store', 'Time Based Key-Value Store');
  v.chapter('intro', 'The problem');
  v.say('Store values for keys at timestamps, and answer: what was the value of this key at time t? That is the value from the latest set at or before t, or an empty string if there is none. Timestamps of set calls strictly increase.');
  v.table('h0', ['time', KEY], H.map(([t, x]) => [String(t), x]));
  v.say('Like a stock ticker: the price at time twelve is the last price posted at or before twelve.');

  v.chapter('brute', 'Brute force: scan the key’s history', { cx: 'get O(n)', code: ['set: history[key].append((t, value))', 'get: walk history[key] from the end', '  first entry with time ≤ t → its value'] });
  v.clear();
  const b = v.array('h', H.map(([t]) => t), { label: `history["${KEY}"]: times (values underneath)` });
  b.subs(H.map(([, x]) => x));
  let i = H.length - 1;
  for (; i >= 0 && H[i][0] > QS[0]; i--) { b.tone(i, 'bad'); }
  b.tone(i, 'ok');
  v.line(1, 2).eq(`get(${KEY}, ${QS[0]}): scan back → time ${H[i][0]} → "${H[i][1]}"`, 'ok').say('Keep a list of (time, value) per key; sets append, so it stays sorted by time. A get can walk back from the newest entry. With a long history, that walk is linear.');

  v.chapter('optimal', 'Optimal: binary search the sorted history', { cx: 'set O(1) · get O(log n)', code: ['set: history[key].append((t, value))', 'get: lo, hi = 0, len − 1; ans = ""', '  mid time ≤ t → ans = value; lo = mid + 1', '  else hi = mid − 1'] });
  v.clear();
  const a = v.array('h', H.map(([t]) => t), { label: `history["${KEY}"]: times (values underneath)` });
  a.subs(H.map(([, x]) => x));
  const vars = v.vars('v', { t: QS[0], ans: '""' });
  v.line(0).say('Because timestamps only grow, each history is sorted for free. So a get is a binary search for the last time that is at most t.');
  QS.forEach((q, qi) => {
    vars.set({ t: q, ans: '""' });
    let lo = 0, hi = H.length - 1, best = -1, step = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      step++;
      const ok = H[mid][0] <= q;
      a.clearTones().ptrs({ lo, hi, mid }).tone(mid, ok ? 'ok' : 'bad');
      if (ok) { best = mid; vars.set({ t: q, ans: `"${H[mid][1]}"` }, 'ok'); }
      v.line(ok ? 2 : 3).eq(`get(${KEY}, ${q}): time[${mid}] = ${H[mid][0]} ${ok ? '≤' : '>'} ${q} → ${ok ? `ans = "${H[mid][1]}", go right` : 'go left'}`, ok ? 'ok' : undefined);
      if (qi === 0 && step === 1) v.say(`Asking for time ${words(q)}. The middle entry, time ${words(H[mid][0])}, is not after ${words(q)}, so it is a candidate. A later one might also qualify, so look right.`);
      else if (qi === 0 && !ok && step === 2) v.say(`Time ${words(H[mid][0])} is after ${words(q)}: too late, look left.`);
      else v.hold(750);
      if (ok) lo = mid + 1; else hi = mid - 1;
    }
    a.noPtr().clearTones();
    if (best >= 0) a.tone(best, 'ok');
    v.eq(`get(${KEY}, ${q}) = "${best >= 0 ? H[best][1] : ''}"`, 'ok');
    if (qi === 0) v.say(`The search ends on time ${words(H[best][0])}: the value is ${H[best][1]}.`);
    else v.say(`At time ${words(q)} nothing had been set yet: every entry is too late, so the answer stays the empty string.`);
  });
  v.answer(`"${H[3][1]}", ""`);

  recap(v, [{ name: 'Scan history', time: 'O(1) set, O(n) get', space: 'O(n)' }, { name: 'Binary search history', time: 'O(1) set, O(log n) get', space: 'O(n)' }], 'Appends in time order keep each history sorted: binary search the last time ≤ t.', ['“Value at time t” → per-key sorted list + binary search'], 'Search for the last time ≤ t (upper bound − 1), not the first ≥ t.');
  return v.build();
}

const problem: Problem = {
  slug: 'time-based-key-value-store',
  statement: 'Design a time-based key-value data structure.\n\n- `TimeMap()` initialises the object.\n- `void set(String key, String value, int timestamp)` stores the key with the value at the given time.\n- `String get(String key, int timestamp)` returns the value such that `set` was called previously with `timestamp_prev ≤ timestamp`, choosing the largest `timestamp_prev`. If there is none, return "".\n\nAll timestamps passed to `set` are strictly increasing.',
  examples: [{ input: '["TimeMap","set","get","get","set","get","get"]\n[[],["foo","bar",1],["foo",1],["foo",3],["foo","bar2",4],["foo",4],["foo",5]]', output: '[null,null,"bar","bar",null,"bar2","bar2"]' }],
  constraints: ['1 ≤ key.length, value.length ≤ 100', '1 ≤ timestamp ≤ 10⁷', 'set timestamps strictly increase', 'at most 2 · 10⁵ calls'],
  hints: ['Each key’s history is sorted by time automatically.', 'Binary search for the last time ≤ t.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan history', idea: 'Walk the key’s list from the end.', time: 'O(n) get', space: 'O(n)', bottleneck: 'Linear gets.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search', idea: 'Upper-bound search on the key’s sorted times.', time: 'O(log n) get', space: 'O(n)' },
  ],
  takeaway: 'Sorted history → **binary search** the last time ≤ t.',
  video,
  judge: {
    type: 'design', cls: 'TimeMap', ctor: [],
    methods: { set: { params: ['String', 'String', 'int'], ret: 'void' }, get: { params: ['String', 'int'], ret: 'String' } },
    tests: [
      { ops: ['TimeMap', 'set', 'get', 'get', 'set', 'get', 'get'], args: [[], ['foo', 'bar', 1], ['foo', 1], ['foo', 3], ['foo', 'bar2', 4], ['foo', 4], ['foo', 5]], out: [null, null, 'bar', 'bar', null, 'bar2', 'bar2'] },
      { ops: ['TimeMap', 'set', 'set', 'get', 'get', 'get', 'get', 'get'], args: [[], ['love', 'high', 10], ['love', 'low', 20], ['love', 5], ['love', 10], ['love', 15], ['love', 20], ['love', 25]], out: [null, null, null, '', 'high', 'high', 'low', 'low'] },
      { ops: ['TimeMap', 'get'], args: [[], ['x', 3]], out: [null, ''] },
    ],
    gen: (r: Rng): Op => {
      const ops = ['TimeMap'];
      const args: unknown[][] = [[]];
      let t = 0;
      for (let k = 0; k < 25; k++) {
        if (r.int(0, 1)) { t += r.int(1, 3); ops.push('set'); args.push([r.pick(['a', 'b', 'c']), r.str(r.int(1, 3), 'xyz'), t]); }
        else { ops.push('get'); args.push([r.pick(['a', 'b', 'c']), r.int(1, t + 3)]); }
      }
      return { ops, args };
    },
    ref,
  },
};

export default problem;
