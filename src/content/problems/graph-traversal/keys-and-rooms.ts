import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const R = [[1, 3], [3, 0, 1], [2], [0]];
function canVisit(rooms: number[][]) { const seen = new Set([0]); const st = [0]; while (st.length) { const x = st.pop()!; for (const k of rooms[x]) if (!seen.has(k)) { seen.add(k); st.push(k); } } return seen.size === rooms.length; }

function video() {
  const v = new Video('keys-and-rooms', 'Keys and Rooms');
  const n = R.length;
  const pos = [[20, 30], [50, 15], [80, 30], [50, 75]];
  const nodes = R.map((_, i) => ({ id: String(i), label: String(i), x: pos[i][0], y: pos[i][1] }));
  const edges = R.flatMap((ks, i) => ks.filter((k) => k !== i).map((k) => ({ a: String(i), b: String(k) })));
  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'room i → rooms its keys open', directed: true });
  v.say('Rooms are locked, except room zero. Each room holds keys to other rooms. Starting in room zero, can you get into every room? Rooms and keys form a directed graph: an arrow from a room to each room its keys open.');
  v.eq(`rooms = ${JSON.stringify(R)} → ${canVisit(R)}`);

  v.chapter('brute', 'Keep sweeping all rooms you can open', { cx: 'O(n · (n + keys))', code: ['open = {0}', 'repeat: for every open room, add the rooms its keys open', 'until nothing new opens'] });
  v.eq('each sweep may open only one new room', 'warn').say('Sweeping over all open rooms again and again until nothing changes works, but each sweep might unlock just one more room.');

  v.chapter('optimal', 'DFS from room 0', { cx: 'O(n + total keys)', code: ['seen = {0}; stack = [0]', 'while stack: room = pop', '  for key in rooms[room]: if key not seen: see it; push it', 'return len(seen) == n'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'visited rooms turn green', directed: true });
  const st = v.stack('s', [], { label: 'stack' });
  const seen = new Set([0]);
  const S = [0];
  st.push(0);
  g.tone('0', 'ok');
  v.line(0).eq('start in room 0').say('This is plain reachability: a DFS from room zero. Every key leads to a room; if we have not been there, visit it.');
  let told = 0;
  while (S.length) {
    const x = S.pop()!;
    st.pop();
    g.clearTones([]); seen.forEach((s) => g.tone(String(s), 'ok')); g.tone(String(x), 'active');
    const found: number[] = [];
    for (const k of R[x]) if (!seen.has(k)) { seen.add(k); S.push(k); st.push(k); found.push(k); g.edge(String(x), String(k), 'ok'); }
    v.line(1, 2).counter(`visited: ${seen.size}/${n}`).eq(`room ${x}: keys [${R[x].join(', ')}]${found.length ? ` → new: ${found.join(', ')}` : ' → nothing new'}`);
    if (told === 0) { v.say(`Room zero has keys to one and three. Neither has been visited, so both go on the stack.`); told++; }
    else if (x === 1 && told === 1) { v.say('Room one has keys to three, zero and one. All already seen: nothing new.'); told++; }
    else v.hold(700);
  }
  g.clearTones(); seen.forEach((s) => g.tone(String(s), 'ok'));
  v.line(3).eq(`visited ${seen.size} of ${n} → ${seen.size === n}`, seen.size === n ? 'ok' : 'bad').say(seen.size === n ? `All ${words(n)} rooms were reached. Every room is visited once and every key is looked at once: linear in rooms plus keys.` : `Only ${words(seen.size)} of the ${words(n)} rooms were reached. The only key to room ${R.map((_, i) => i).filter((i) => !seen.has(i)).map(words).join(' and ')} is locked inside it, so the answer is false. Every room is visited at most once and every key is looked at once: linear in rooms plus keys.`);
  v.answer(canVisit(R));

  recap(v, [{ name: 'Sweep until stable', time: 'O(n · (n + keys))', space: 'O(n)' }, { name: 'DFS / BFS', time: 'O(n + keys)', space: 'O(n)' }], 'Reachability from room 0; compare the count with n.', ['Can I reach everything? → one traversal, count visited'], 'Recognise the graph hiding in the story.');
  return v.build();
}

const problem: Problem = {
  slug: 'keys-and-rooms',
  statement: 'There are `n` rooms labelled 0 to n − 1; all are locked except room 0. Visiting a room gives you all the keys inside it (`rooms[i]`). Return `true` if you can visit all the rooms.',
  examples: [{ input: 'rooms = [[1],[2],[3],[]]', output: 'true' }, { input: 'rooms = [[1,3],[3,0,1],[2],[0]]', output: 'false' }],
  constraints: ['2 ≤ n ≤ 1000', 'total keys ≤ 3000'],
  hints: ['It is reachability in a directed graph.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sweep until stable', idea: 'Repeatedly open rooms whose keys you hold until nothing changes.', time: 'O(n · (n + keys))', space: 'O(n)', bottleneck: 'Many sweeps.' },
    { id: 'optimal', kind: 'optimal', name: 'DFS', idea: 'Visit rooms from 0; count them.', time: 'O(n + keys)', space: 'O(n)' },
  ],
  takeaway: 'It is just **reachability**.',
  video,
  videoArgs: [R],
  judge: {
    type: 'fn', fn: 'canVisitAllRooms', params: ['List<List<Integer>>'], ret: 'boolean',
    tests: [{ args: [[[1], [2], [3], []]], out: true }, { args: [R], out: canVisit(R) }, { args: [[[1], []]], out: true }],
    gen: (r: Rng) => { const n = r.int(2, 7); return [Array.from({ length: n }, () => r.ints(r.int(0, 2), 0, n - 1))]; },
    ref: (rooms: number[][]) => canVisit(rooms),
  },
};

export default problem;
