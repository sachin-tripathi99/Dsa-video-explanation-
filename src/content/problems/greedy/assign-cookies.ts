import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const G = [4, 2, 1, 5];
const S = [3, 1, 5, 2, 1];
function ac(g: number[], s: number[]) { const a = [...g].sort((x, y) => x - y), b = [...s].sort((x, y) => x - y); let i = 0; for (let j = 0; j < b.length && i < a.length; j++) if (b[j] >= a[i]) i++; return i; }

function video() {
  const v = new Video('assign-cookies', 'Assign Cookies');
  v.chapter('intro', 'The problem');
  v.array('g', G, { label: 'greed factor of each child' });
  v.array('s', S, { label: 'cookie sizes' });
  v.say('Each child is content if they get one cookie at least as big as their greed factor. Each child gets at most one cookie. How many children can be made content?');
  v.eq(`answer: ${ac(G, S)}`);

  v.chapter('brute', 'Brute force: for each child, search all cookies', { cx: 'O(n · m)', code: ['for each child (smallest greed first):', '  scan all unused cookies for the smallest that fits'] });
  v.eq('each child rescans every cookie', 'warn').say('For every child, scan all cookies to find the smallest unused one that fits. n times m.');

  v.chapter('insight', 'Why smallest-to-smallest works');
  v.clear();
  v.text('t', { title: 'Do not waste big cookies', lines: ['The least greedy child is the easiest to satisfy', 'Give them the smallest cookie that works', 'Any bigger cookie is more useful for a greedier child'], shown: 3 });
  v.say('The least greedy child is the easiest to please. Giving them the smallest cookie that fits never hurts, because any bigger cookie would be at least as useful to someone greedier. That is an exchange argument.');

  v.chapter('optimal', 'Optimal: sort both, two pointers', { cx: 'O(n log n + m log m)', code: ['sort g, sort s', 'i = child, j = cookie', 'if s[j] ≥ g[i]: i += 1   # child content', 'j += 1                    # cookie used or too small'] });
  v.clear();
  const g = [...G].sort((a, b) => a - b), s = [...S].sort((a, b) => a - b);
  const ga = v.array('g', g, { label: 'children, sorted by greed' });
  const sa = v.array('s', s, { label: 'cookies, sorted by size' });
  let i = 0;
  let told = { fit: false, small: false };
  v.say('Sort the children by greed and the cookies by size. Walk through the cookies from smallest to largest, trying each on the least greedy child who is still waiting.');
  for (let j = 0; j < s.length && i < g.length; j++) {
    ga.ptr('i', i); sa.ptr('j', j);
    if (s[j] >= g[i]) {
      ga.tone(i, 'ok'); sa.tone(j, 'ok');
      v.line(2).counter(`content: ${i + 1}`).eq(`cookie ${s[j]} ≥ greed ${g[i]} → child content`, 'ok');
      if (!told.fit) { v.say(`Cookie ${words(s[j])} satisfies the child with greed ${words(g[i])}. Both move on.`); told.fit = true; } else v.hold(750);
      i++;
    } else {
      sa.tone(j, 'dim');
      v.line(3).counter(`content: ${i}`).eq(`cookie ${s[j]} < greed ${g[i]} → too small for anyone left, skip`, 'bad');
      if (!told.small) { v.say(`Cookie ${words(s[j])} is too small for the least greedy waiting child, so it is too small for everyone left. Throw it away.`); told.small = true; } else v.hold(750);
    }
  }
  ga.noPtr(); sa.noPtr();
  v.eq(`content children = ${i}`, 'ok').say(`${words(i)} children are content. Sorting dominates the cost.`);
  v.answer(ac(G, S));

  recap(v, [{ name: 'Scan per child', time: 'O(n · m)', space: 'O(m)' }, { name: 'Sort + two pointers', time: 'O(n log n + m log m)', space: 'O(1)' }], 'Match the smallest fitting cookie to the least greedy child.', ['Match items to requirements → sort both, two pointers'], 'Do not waste resources that someone harder to please could use.');
  return v.build();
}

const problem: Problem = {
  slug: 'assign-cookies',
  statement: 'Each child `i` has a greed factor `g[i]`, and each cookie `j` has a size `s[j]`. Child `i` is content if given a cookie with `s[j] ≥ g[i]`. Each child gets at most one cookie. Return the maximum number of content children.',
  examples: [{ input: 'g = [1,2,3], s = [1,1]', output: '1' }, { input: 'g = [1,2], s = [1,2,3]', output: '2' }],
  constraints: ['1 ≤ g.length ≤ 3 · 10⁴', '0 ≤ s.length ≤ 3 · 10⁴'],
  hints: ['Who is easiest to satisfy?', 'Sort both arrays.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan per child', idea: 'For each child (by greed), find the smallest unused cookie that fits.', time: 'O(n · m)', space: 'O(m)', bottleneck: 'Rescanning cookies.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + two pointers', idea: 'Advance the cookie pointer always; advance the child pointer on a fit.', time: 'O(n log n + m log m)', space: 'O(1)' },
  ],
  takeaway: '**Sort and match** smallest to smallest.',
  video,
  videoArgs: [G, S],
  judge: {
    type: 'fn', fn: 'findContentChildren', params: ['int[]', 'int[]'], ret: 'int',
    tests: [{ args: [[1, 2, 3], [1, 1]], out: 1 }, { args: [[1, 2], [1, 2, 3]], out: 2 }, { args: [[1], []], out: 0 }, { args: [G, S], out: ac(G, S) }],
    gen: (r: Rng) => [r.ints(r.int(1, 8), 1, 8), r.ints(r.int(0, 8), 1, 8)],
    ref: (g: number[], s: number[]) => ac(g, s),
  },
};

export default problem;
