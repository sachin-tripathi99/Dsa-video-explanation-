import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'RDDRD';

function video() {
  const v = new Video('dota2-senate', 'Dota2 Senate');
  v.chapter('intro', 'The problem');
  v.array('s', [...S], { label: 'senators in voting order (R = Radiant, D = Dire)' });
  v.say('Senators vote in rounds, in order. On their turn, a senator can ban one senator of the other party, who loses all future turns. Everyone plays optimally. Which party wins, meaning all remaining senators are from one party?');
  v.eq('best move: ban the next opponent who would vote');

  v.chapter('brute', 'Simulate with a list', { cx: 'O(n²)', code: ['while both parties remain:', '  for each senator in order:', '    ban the next opponent after them (wrapping around)'] });
  v.eq('each ban searches and removes from a list → O(n) per ban', 'bad').say('The greedy rule is: ban the next opponent who is about to vote. Simulating that on a list means searching and removing, which is O of n per ban.');

  v.chapter('optimal', 'Optimal: two queues of turn numbers', { cx: 'O(n)', code: ['r = queue of indices of R, d = queue of indices of D', 'while r and d:', '  a, b = r.popleft(), d.popleft()', '  winner of this duel (smaller index) goes back with index + n'] });
  v.clear().layout('row');
  const n = S.length;
  const rq = v.queue('r', [...S].map((c, i) => (c === 'R' ? i : -1)).filter((x) => x >= 0), { label: 'R turns', ends: ['next', ''] });
  const dq = v.queue('d', [...S].map((c, i) => (c === 'D' ? i : -1)).filter((x) => x >= 0), { label: 'D turns', ends: ['next', ''] });
  const r = rq.values.map(Number);
  const d = dq.values.map(Number);
  let step = 0;
  while (r.length && d.length) {
    const a = r.shift()!;
    const b = d.shift()!;
    rq.clearTones().tone(0, a < b ? 'ok' : 'bad');
    dq.clearTones().tone(0, b < a ? 'ok' : 'bad');
    v.line(2).eq(a < b ? `R@${a} votes before D@${b} → bans D; R returns as ${a + n}` : `D@${b} votes before R@${a} → bans R; D returns as ${b + n}`, 'warn');
    if (step === 0) v.say('Keep each party’s turn numbers in a queue. The two front senators duel: whoever votes first bans the other.');
    else v.hold(900);
    rq.shift();
    dq.shift();
    if (a < b) { r.push(a + n); rq.push(a + n); }
    else { d.push(b + n); dq.push(b + n); }
    rq.clearTones();
    dq.clearTones();
    v.line(3).hold(500);
    if (step === 0) v.say('The winner votes again next round, so it rejoins its queue with turn number plus n.');
    step++;
  }
  const winner = r.length ? 'Radiant' : 'Dire';
  v.eq(`${winner} wins`, 'ok').say(`The ${winner} queue is the only one left. Each duel removes one senator, so there are at most n duels: O of n.`);
  v.answer(winner);
  recap(v, [{ name: 'Simulate on a list', time: 'O(n²)', space: 'O(n)' }, { name: 'Two queues of turn numbers', time: 'O(n)', space: 'O(n)' }], 'Queues keep each party’s turn order; +n schedules the next round.', ['Round-based turns → queue; re-enqueue with index + n for the next round', 'Greedy: act on the most immediate threat'], 'Turn-based simulations become queue problems: process the next turn, and re-queue with a later turn number.');
  return v.build();
}

const problem: Problem = {
  slug: 'dota2-senate',
  statement: 'A senate string of `R` (Radiant) and `D` (Dire) senators votes in rounds, in order. On their turn a senator (still active) may ban one senator of the other party, removing all of that senator’s future rights. When all remaining senators are from one party, that party wins. Everyone plays optimally. Return `"Radiant"` or `"Dire"`.',
  examples: [{ input: 'senate = "RD"', output: '"Radiant"' }, { input: 'senate = "RDD"', output: '"Dire"' }],
  constraints: ['1 ≤ n ≤ 10⁴'],
  hints: ['Who is the most dangerous opponent to ban?', 'Keep each party’s upcoming turn numbers in a queue.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Simulate on a list', idea: 'Repeatedly go through the list; each active senator bans the next opponent after them (wrapping).', time: 'O(n²)', space: 'O(n)', bottleneck: 'Finding and removing the next opponent is O(n) each time.' },
    { id: 'optimal', kind: 'optimal', name: 'Two queues', idea: 'Queues of indices per party. Pop both fronts; the smaller index wins and re-enters with `index + n`.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Turn-based rounds → **queues of turn numbers**; add n to schedule the next round.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'predictPartyVictory', params: ['String'], ret: 'String',
    tests: [{ args: ['RD'], out: 'Radiant' }, { args: ['RDD'], out: 'Dire' }, { args: ['DDRRR'], out: 'Dire' }],
    gen: (r) => [r.str(r.int(1, 12), 'RD')],
    ref: (s: string) => { const n = s.length; const r: number[] = []; const d: number[] = []; [...s].forEach((c, i) => (c === 'R' ? r : d).push(i)); while (r.length && d.length) { const a = r.shift()!; const b = d.shift()!; if (a < b) r.push(a + n); else d.push(b + n); } return r.length ? 'Radiant' : 'Dire'; },
  },
};

export default problem;
