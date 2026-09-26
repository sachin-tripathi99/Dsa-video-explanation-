import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const S = 'abacbdefegdh';
function pl(s: string) { const last = new Map<string, number>(); [...s].forEach((c, i) => last.set(c, i)); const out: number[] = []; let st = 0, end = 0; [...s].forEach((c, i) => { end = Math.max(end, last.get(c)!); if (i === end) { out.push(end - st + 1); st = i + 1; } }); return out; }

function video() {
  const v = new Video('partition-labels', 'Partition Labels');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Split the string into as many parts as possible so that each letter appears in at most one part. Return the sizes of the parts.');
  v.eq(`answer: [${pl(S).join(', ')}]`);

  v.chapter('brute', 'Brute force: grow each part by rescanning', { cx: 'O(n²)', code: ['start a part at i; end = i', 'for each char in the part: scan the rest of s for its later copies', '  push end past them'] });
  v.eq('rescanning the tail of s for every character', 'warn').say('Start a part, and for every character inside it, scan the rest of the string for later copies, pushing the end outwards. Quadratic.');

  v.chapter('optimal', 'Optimal: last occurrence + extend', { cx: 'O(n)', code: ['last[c] = last index of c', 'start = end = 0', 'for i, c in s: end = max(end, last[c])', '  if i == end: cut here; start = i + 1'] });
  v.clear();
  const last = new Map<string, number>();
  [...S].forEach((c, i) => last.set(c, i));
  const a = v.array('s', S.split(''), { label: 's' });
  const m = v.map('m', { label: 'last index of each letter' });
  [...last.entries()].forEach(([c, i]) => m.put(c, i));
  v.say('First record the last index of every letter. A part that contains a letter must stretch at least to that letter’s last occurrence.');
  let st = 0, end = 0;
  const out: number[] = [];
  let told = 0;
  [...S].forEach((c, i) => {
    const ne = Math.max(end, last.get(c)!);
    a.clearTones().noWin().win(st, ne, 'win').tone(i, 'active');
    m.clearTones().tone(c, 'active');
    v.line(2).counter(`parts: [${out.join(', ')}]`).eq(`'${c}' last at ${last.get(c)} → end = ${ne}`);
    if (told === 0) { v.say(`The letter a last appears at index ${words(last.get('a')!)}, so this part must reach at least there.`); told++; }
    else if (ne > end && told === 1) { v.say(`The letter ${c} appears again at index ${words(last.get(c)!)}, which pushes the end further out, to ${words(ne)}.`); told++; }
    else v.hold(500);
    end = ne;
    if (i === end) {
      out.push(end - st + 1);
      a.noWin().win(st, end, 'ok', `${end - st + 1}`);
      v.line(3).counter(`parts: [${out.join(', ')}]`).eq(`i == end → cut: part of size ${end - st + 1}`, 'ok');
      if (told === 2) { v.say(`We reached the end of the part: every letter inside it has no copies further right. Cut here. Size ${words(end - st + 1)}.`); told++; } else v.hold(700);
      st = i + 1;
    }
  });
  a.clearTones().noWin();
  m.clearTones();
  v.eq(`[${out.join(', ')}]`, 'ok').say('Cutting as early as possible gives the most parts. Two linear passes.');
  v.answer(pl(S));

  recap(v, [{ name: 'Rescan for later copies', time: 'O(n²)', space: 'O(1)' }, { name: 'Last occurrence + extend', time: 'O(n)', space: 'O(σ)' }], 'end = max(end, last[c]); cut when i == end.', ['Each item must stay in one group → extend to last occurrences'], 'Cut as soon as nothing inside the part appears later.');
  return v.build();
}

const problem: Problem = {
  slug: 'partition-labels',
  statement: 'You are given a string `s`. Partition it into as many parts as possible so that each letter appears in at most one part. Return a list of the sizes of these parts.',
  examples: [{ input: 's = "ababcbacadefegdehijhklij"', output: '[9,7,8]' }, { input: 's = "eccbbbbdec"', output: '[10]' }],
  constraints: ['1 ≤ n ≤ 500', 'lowercase letters'],
  hints: ['Where must a part containing letter c end, at the earliest?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Rescan', idea: 'Grow each part by scanning the rest of s for later copies of its letters.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Rescans.' },
    { id: 'optimal', kind: 'optimal', name: 'Last occurrence', idea: 'Precompute last[c]; extend end; cut when i == end.', time: 'O(n)', space: 'O(σ)' },
  ],
  takeaway: 'Extend to the **last occurrence**; cut when you reach it.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'partitionLabels', params: ['String'], ret: 'List<Integer>',
    tests: [{ args: ['ababcbacadefegdehijhklij'], out: [9, 7, 8] }, { args: ['eccbbbbdec'], out: [10] }, { args: [S], out: pl(S) }],
    gen: (r: Rng) => [r.str(r.int(1, 14), 'abcdefg')],
    ref: (s: string) => pl(s),
  },
};

export default problem;
