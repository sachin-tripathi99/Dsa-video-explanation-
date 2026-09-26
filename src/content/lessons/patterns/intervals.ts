import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

type I = [number, number];
const M: I[] = [[6, 8], [1, 3], [10, 12], [2, 5], [7, 9]];

function video() {
  const v = new Video('intervals', 'Merging and scheduling intervals');
  v.chapter('intro', 'Intervals are ranges on a line');
  v.intervals('iv', M, { label: 'meetings (start, end)', min: 0, max: 13 });
  v.say('An interval is a range with a start and an end, like a meeting from one o’clock to three. Interview problems hand you a list of them and ask you to merge them, count how many overlap at once, or remove as few as possible so none overlap.');
  v.eq('almost every interval problem starts with a sort').say('Almost every interval problem starts the same way: sort. The only real question is whether to sort by start or by end.');

  v.chapter('overlap', 'When do two intervals overlap?');
  v.clear();
  const o = v.intervals('o', [[1, 4], [3, 7]], { label: 'a and b', min: 0, max: 9 });
  o.tone(0, 'active').tone(1, 'cmp');
  v.eq('a = [1,4], b = [3,7]: 3 ≤ 4 and 1 ≤ 7 → overlap', 'ok').say('Two intervals overlap when each one starts before the other one ends: a’s start is at most b’s end, and b’s start is at most a’s end. Here three is at most four, and one is at most seven, so they overlap.');
  o.set(1, 5, 7);
  v.eq('a = [1,4], b = [5,7]: 5 > 4 → disjoint', 'bad').say('Move b to start at five. Now b starts after a ends, so there is a gap: no overlap.');
  o.set(1, 4, 7);
  v.eq('a = [1,4], b = [4,7]: touching, read the problem!', 'warn').say('The tricky case is touching: a ends at four and b starts at four. For meetings, that is fine, one ends as the other begins. For closed intervals, like balloons on a line, they share the point four. Always check which one the problem means.');
  v.eq('after sorting by start: next overlaps ⇔ next.start ≤ current.end').say('Once intervals are sorted by start, the test becomes one comparison: the next interval overlaps the current group exactly when its start is at most the group’s end.');

  v.chapter('merge', 'Sort by start, then sweep', { code: ['sort by start', 'for [s, e] in intervals:', '  if merged and s ≤ merged.last.end:', '    merged.last.end = max(merged.last.end, e)', '  else: merged.append([s, e])'] });
  v.clear();
  const order = M.map((x, i) => i).sort((a, b) => M[a][0] - M[b][0]);
  const inp = v.intervals('in', M, { label: 'input', min: 0, max: 13 });
  v.line(0).say('Start with the meetings in their original order.');
  order.forEach((k, r) => inp.row(k, r));
  v.eq(`sorted: ${order.map((k) => `[${M[k]}]`).join(' ')}`).say('Sort them by start time. Now overlapping meetings sit next to each other.');
  const out = v.intervals('out', [], { label: 'merged', min: 0, max: 13 });
  const merged: I[] = [];
  let told = 0;
  order.forEach((k) => {
    const [s, e] = M[k];
    inp.clearTones().tone(k, 'active').cursor(s);
    out.clearTones();
    const last = merged[merged.length - 1];
    if (last && s <= last[1]) {
      const old = last[1];
      last[1] = Math.max(last[1], e);
      out.set(merged.length - 1, last[0], last[1]).tone(merged.length - 1, 'ok');
      v.line(2, 3).eq(`${s} ≤ ${old} → overlap: extend to [${last[0]},${last[1]}]`, 'ok');
      if (told < 2) { v.say(`The meeting from ${words(s)} to ${words(e)} starts before the current group ends at ${words(old)}. Extend the group to end at ${words(last[1])}.`); told = 2; } else v.hold(800);
    } else {
      merged.push([s, e]);
      out.add(merged.length - 1, s, e, 0).tone(merged.length - 1, 'active');
      v.line(4).eq(last ? `${s} > ${last[1]} → gap: new group [${s},${e}]` : `first interval → new group [${s},${e}]`);
      if (told === 0) { v.say('The first meeting starts the first group.'); told = 1; } else if (last && told === 2) { v.say(`${words(s)} is after ${words(last[1])}, so there is a gap. Start a new group.`); told = 3; } else v.hold(800);
    }
  });
  inp.clearTones().cursor(null);
  out.clearTones();
  v.eq(`merged: ${merged.map((x) => `[${x}]`).join(' ')} · O(n log n) for the sort, O(n) for the sweep`, 'ok').say('The sweep is linear; the sort dominates. Merging always costs n log n.');

  v.chapter('by-end', 'Sort by end: keep the most intervals');
  v.clear();
  const G: I[] = [[1, 11], [2, 3], [4, 5], [6, 7], [8, 9]];
  const g = v.intervals('g', G, { label: 'keep as many non-overlapping meetings as possible', min: 0, max: 12 });
  g.tone(0, 'bad');
  v.eq('sort by start → take [1,11] first → it blocks everything', 'bad').say('Now a different question: keep as many meetings as possible with no overlap. Sorting by start would grab the meeting from one to eleven first, and it blocks all the others.');
  let end = -Infinity;
  let kept = 0;
  g.clearTones();
  [1, 2, 3, 4, 0].forEach((k) => {
    const [s, e] = G[k];
    if (s >= end) { end = e; kept++; g.tone(k, 'ok'); } else g.tone(k, 'bad');
  });
  g.cursor(null);
  v.eq(`sort by end → keep ${kept}, remove ${G.length - kept}`, 'ok').say(`Instead, sort by end and always keep the meeting that finishes first. It leaves the most room for everything after it. Here that keeps ${words(kept)} meetings and removes only the long one.`);

  v.chapter('sweep', 'Sweep line: how many overlap at once?');
  v.clear();
  const R: I[] = [[1, 4], [2, 6], [3, 5], [7, 9], [8, 10]];
  const rv = v.intervals('r', R, { label: 'meetings: how many rooms?', min: 0, max: 11 });
  const events = R.flatMap(([s, e], k) => [{ t: s, d: 1, k }, { t: e, d: -1, k }]).sort((a, b) => a.t - b.t || a.d - b.d);
  let cur = 0;
  let best = 0;
  v.say('A third question: what is the largest number of meetings happening at the same time? That is the number of rooms we need. Turn every meeting into two events: a start adds one, an end subtracts one. Sort the events by time and sweep a line across them.');
  events.forEach((ev) => {
    cur += ev.d;
    best = Math.max(best, cur);
    rv.cursor(ev.t);
    if (ev.d > 0) rv.tone(ev.k, 'active'); else rv.tone(ev.k, 'dim');
    v.counter(`in use: ${cur} · max: ${best}`).eq(`t = ${ev.t}: ${ev.d > 0 ? 'start' : 'end'} of [${R[ev.k]}] → ${cur} room${cur === 1 ? '' : 's'} in use`, cur === best && ev.d > 0 ? 'ok' : undefined);
    if (cur === 3 && ev.d > 0) v.say('At time three, three meetings are running at once. That is the peak.');
    else v.hold(650);
  });
  rv.cursor(null);
  v.eq(`rooms needed = ${best}`, 'ok').say(`The maximum ever in use is ${words(best)}. When a start and an end happen at the same time, process the end first if touching meetings may share a room.`);

  v.chapter('cheat', 'Which sort for which question?');
  v.clear();
  v.table('t', ['Question', 'Technique'], [
    ['merge / insert overlapping ranges', 'sort by start, extend the last group'],
    ['keep max non-overlapping / min removals', 'sort by end, greedy keep'],
    ['min arrows / points to hit all', 'sort by end, shoot at the end'],
    ['max overlap / rooms / groups', 'sweep line or min-heap of end times'],
    ['intersect two sorted lists', 'two pointers, advance the one ending first'],
  ]);
  v.say('Merging sorts by start. Choosing or stabbing intervals greedily sorts by end. Counting overlaps sweeps events or keeps a heap of end times. And two sorted lists use two pointers.');
  return v.build();
}

const body = String.raw`
## The idea

An interval is \`[start, end]\`. Interval problems almost always begin with a **sort**, followed by one linear sweep.

> Real-life picture: a calendar. Merging busy blocks, finding how many meeting rooms you need, or cancelling the fewest meetings so none clash.

## Overlap test

Two intervals \`a\` and \`b\` overlap when \`a.start <= b.end && b.start <= a.end\`. After sorting by start, you only need \`next.start <= current.end\`.

Decide whether **touching** intervals (\`[1,4]\` and \`[4,7]\`) overlap: closed intervals share a point; meetings usually don't.

## Merge (sort by start)

\`\`\`java
Arrays.sort(iv, (a, b) -> Integer.compare(a[0], b[0]));
List<int[]> out = new ArrayList<>();
for (int[] cur : iv) {
    if (!out.isEmpty() && cur[0] <= out.get(out.size() - 1)[1])
        out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], cur[1]);
    else out.add(cur);
}
\`\`\`

\`\`\`python
iv.sort(key=lambda x: x[0])
out = []
for s, e in iv:
    if out and s <= out[-1][1]:
        out[-1][1] = max(out[-1][1], e)
    else:
        out.append([s, e])
\`\`\`

\`\`\`cpp
sort(iv.begin(), iv.end());
vector<vector<int>> out;
for (auto& c : iv) {
    if (!out.empty() && c[0] <= out.back()[1]) out.back()[1] = max(out.back()[1], c[1]);
    else out.push_back(c);
}
\`\`\`

## Choosing the sort

| Question | Sort by | Why |
|---|---|---|
| merge, insert | start | overlapping intervals become neighbours |
| max non-overlapping, min removals | end | finishing earliest leaves the most room |
| min arrows / points | end | shoot at the earliest end, it hits everything that started before it |
| rooms / groups | events (sweep) or start + min-heap of ends | count simultaneous intervals |

## Pitfalls

- Java comparators: use \`Integer.compare(a[0], b[0])\`, not \`a[0] - b[0]\`, which overflows for large values.
- Touching intervals: \`<\` vs \`<=\` decides whether they overlap.
- In a sweep, when a start and an end share a time, order them according to that rule.
`;

const lesson: Lesson = {
  slug: 'intervals',
  video,
  body,
  quiz: [
    { q: 'After sorting by start, when does interval b overlap the current merged group ending at E?', options: ['b.end ≤ E', 'b.start ≤ E', 'b.start ≥ E', 'always'], answer: 1, why: 'b starts before the group ends.' },
    { q: 'To keep the maximum number of non-overlapping intervals, sort by…', options: ['start', 'end', 'length', 'nothing'], answer: 1, why: 'Finishing first leaves the most room.' },
    { q: 'How do you count the maximum number of simultaneous meetings?', options: ['merge them', 'sweep line over +1/−1 events', 'binary search', 'sort by length'], answer: 1, why: 'The running sum of events is the number in progress.' },
    { q: 'Why avoid `a[0] - b[0]` in a Java comparator?', options: ['slower', 'overflow on large values', 'not stable', 'it sorts descending'], answer: 1, why: 'Subtracting large ints can overflow; use Integer.compare.' },
  ],
};

export default lesson;
