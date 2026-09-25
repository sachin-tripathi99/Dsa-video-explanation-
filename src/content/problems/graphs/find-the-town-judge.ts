import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const N = 4;
const TR = [[1, 3], [1, 4], [2, 3], [2, 4], [4, 3]];

function judge(n: number, trust: number[][]) {
  const score = Array(n + 1).fill(0);
  for (const [a, b] of trust) { score[a]--; score[b]++; }
  for (let i = 1; i <= n; i++) if (score[i] === n - 1) return i;
  return -1;
}

function video() {
  const v = new Video('town-judge', 'Find the Town Judge');
  v.chapter('intro', 'The problem');
  const pos = [[15, 20], [15, 80], [85, 80], [85, 20]];
  const nodes = Array.from({ length: N }, (_, i) => ({ id: String(i + 1), label: String(i + 1), x: pos[i][0], y: pos[i][1] }));
  const g = v.graph('g', nodes, TR.map(([a, b]) => ({ a: String(a), b: String(b) })), { label: 'a → b means "a trusts b"', directed: true });
  v.say('In a town of n people, the judge trusts nobody, and everybody else trusts the judge. Given who trusts whom, find the judge, or return minus one.');

  v.chapter('brute', 'Brute force: check every candidate', { cx: 'O(n · E)', code: ['for each person p:', '  scan all trust pairs: does p trust anyone? do all others trust p?'] });
  v.eq('n candidates × all trust pairs').say('For each person, scan all trust pairs to see whether they trust anyone and whether everyone else trusts them. That repeats the whole scan n times.');

  v.chapter('optimal', 'In-degree minus out-degree', { cx: 'O(n + E)', code: ['score = [0] * (n + 1)', 'for a, b in trust: score[a] −= 1; score[b] += 1', 'return the i with score[i] == n − 1, else −1'] });
  v.clear().layout('row');
  const g2 = v.graph('g', nodes, TR.map(([a, b]) => ({ a: String(a), b: String(b) })), { label: 'trust graph', directed: true });
  const sc = v.array('score', Array(N).fill(0), { label: 'score of persons 1…n', showIdx: false });
  sc.subs(Array.from({ length: N }, (_, i) => `p${i + 1}`));
  const score = Array(N + 1).fill(0);
  TR.forEach(([a, b], i) => {
    score[a]--;
    score[b]++;
    sc.set(a - 1, score[a]).set(b - 1, score[b]).clearTones().tone(a - 1, 'bad').tone(b - 1, 'ok');
    g2.clearTones().edge(String(a), String(b), 'active');
    v.line(1).eq(`${a} trusts ${b}: score[${a}] −1, score[${b}] +1`);
    if (i === 0) v.say('Give every person a score: plus one for each person who trusts them, minus one for each person they trust.');
    else v.hold(600);
  });
  g2.clearTones();
  const j = judge(N, TR);
  sc.clearTones();
  if (j > 0) { sc.tone(j - 1, 'ok'); g2.tone(String(j), 'ok'); }
  v.line(2).eq(j > 0 ? `score[${j}] = ${N - 1} = n − 1 → judge is ${j}` : 'nobody reaches n − 1 → −1', 'ok');
  v.say(`The judge is trusted by all n minus one others and trusts nobody, so only the judge can reach a score of n minus one. Person ${j} does. One pass over the pairs: O of n plus E.`);
  v.answer(j);
  recap(v, [{ name: 'Check every candidate', time: 'O(n · E)', space: 'O(1)' }, { name: 'Score = in − out degree', time: 'O(n + E)', space: 'O(n)' }], 'Degrees summarise the whole trust graph in one pass.', ['Directed graph questions often reduce to in-degree / out-degree counts'], 'Before running a traversal, check whether counting degrees already answers the question.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-the-town-judge',
  statement: 'In a town of `n` people labelled `1…n`, the **town judge** (if one exists) trusts nobody, and is trusted by everybody else. Exactly one person satisfies both. Given `trust[i] = [a, b]` meaning `a` trusts `b`, return the judge’s label or `-1`.',
  examples: [{ input: 'n = 2, trust = [[1,2]]', output: '2' }, { input: 'n = 3, trust = [[1,3],[2,3]]', output: '3' }, { input: 'n = 3, trust = [[1,3],[2,3],[3,1]]', output: '-1' }],
  constraints: ['1 ≤ n ≤ 1000', 'all trust pairs are unique, a ≠ b'],
  hints: ['Think of trust as a directed edge.', 'What are the judge’s in-degree and out-degree?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Check every candidate', idea: 'For each person, scan all pairs to verify both conditions.', time: 'O(n · E)', space: 'O(1)', bottleneck: 'Rescans the pairs for every candidate.' },
    { id: 'optimal', kind: 'optimal', name: 'Degree score', idea: '`score[b]++`, `score[a]--` for every pair; the judge is the person with score `n − 1`.', time: 'O(n + E)', space: 'O(n)' },
  ],
  takeaway: 'Directed-graph conditions often reduce to **in-degree − out-degree**.',
  video,
  videoArgs: [N, TR],
  judge: {
    type: 'fn', fn: 'findJudge', params: ['int', 'int[][]'], ret: 'int',
    tests: [{ args: [2, [[1, 2]]], out: 2 }, { args: [3, [[1, 3], [2, 3]]], out: 3 }, { args: [3, [[1, 3], [2, 3], [3, 1]]], out: -1 }, { args: [1, []], out: 1 }],
    gen: (r) => { const n = r.int(1, 7); const pairs: number[][] = []; for (let a = 1; a <= n; a++) for (let b = 1; b <= n; b++) if (a !== b && r.chance(0.35)) pairs.push([a, b]); if (r.chance(0.5) && n > 1) { const j = r.int(1, n); const rest = pairs.filter(([a]) => a !== j); for (let a = 1; a <= n; a++) if (a !== j && !rest.some(([x, y]) => x === a && y === j)) rest.push([a, j]); return [n, rest]; } return [n, pairs]; },
    ref: (n: number, t: number[][]) => judge(n, t),
  },
};

export default problem;
