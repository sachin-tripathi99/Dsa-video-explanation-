import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const S = '(*)))(';
const S2 = '(*()*)';
function vps(s: string) { let lo = 0, hi = 0; for (const c of s) { if (c === '(') { lo++; hi++; } else if (c === ')') { lo--; hi--; } else { lo--; hi++; } if (hi < 0) return false; lo = Math.max(lo, 0); } return lo === 0; }

function video() {
  const v = new Video('valid-parenthesis-string', 'Valid Parenthesis String');
  v.chapter('intro', 'The problem');
  v.array('s', S2.split(''), { label: 's' });
  v.say('The string has open brackets, close brackets and stars. Each star can be an open bracket, a close bracket, or nothing. Can the string be made into valid parentheses?');
  v.eq(`"${S2}" → ${vps(S2)} · "${S}" → ${vps(S)}`);

  v.chapter('brute', 'Brute force: try all three meanings of every star', { cx: 'O(3ᵏ · n)', code: ['for each star: try "(", ")" and ""', 'check each full string for validity'] });
  v.eq('three branches per star', 'bad').say('Each star has three meanings. Trying them all is three to the power of the number of stars.');

  v.chapter('better', 'Better: DP over (index, open count)', { cx: 'O(n²)', code: ['ok(i, open): can s[i:] be finished with open unmatched "("?', '  "(" → ok(i+1, open+1);  ")" → open > 0 and ok(i+1, open−1)', '  "*" → any of the three', 'memoise (i, open)'] });
  v.eq('n × n states', 'warn').say('Only two things matter at any point: where we are, and how many open brackets are still unmatched. Memoising on that pair gives n squared states.');

  v.chapter('optimal', 'Optimal: track the range of possible open counts', { cx: 'O(n)', code: ['lo = hi = 0   # range of open counts', '( → lo++ hi++ · ) → lo-- hi-- · * → lo-- hi++', 'if hi < 0: return false', 'lo = max(lo, 0)', 'return lo == 0'] });
  v.clear();
  const run = (str: string, first: boolean) => {
    const a = v.array('s', str.split(''), { label: `s = "${str}"` });
    const vars = v.vars('v', { lo: 0, hi: 0 });
    let lo = 0, hi = 0;
    let toldClamp = false;
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (c === '(') { lo++; hi++; } else if (c === ')') { lo--; hi--; } else { lo--; hi++; }
      a.clearTones().tone(i, 'active');
      if (hi < 0) {
        vars.set({ lo, hi }, 'bad');
        v.line(2).eq(`hi = ${hi} < 0 → too many ")" → false`, 'bad').say('Even if every star were an open bracket, there are more close brackets than opens. Nothing can fix that: false.');
        return;
      }
      const clamped = lo < 0;
      lo = Math.max(lo, 0);
      vars.set({ lo, hi });
      v.line(1, 3).eq(`'${c}' → possible open counts ${lo}..${hi}${clamped ? ' (lo clamped at 0)' : ''}`);
      if (first && i === 0) v.say('Instead of choosing what each star means, track every possibility at once: the smallest and the largest number of unmatched open brackets we could have. An open bracket raises both.');
      else if (first && c === '*' && i === 1) v.say('A star could close a bracket, lowering the count, or open one, raising it. So lo goes down and hi goes up. The count could now be anything from zero to two.');
      else if (first && clamped && i > 1 && !toldClamp) (toldClamp = true), v.say('Lo would go below zero, but a negative count is never useful: that choice would be invalid. Clamp lo at zero; the other choices are still alive.');
      else v.hold(600);
    }
    a.clearTones();
    v.line(4).eq(`end: lo = ${lo} → ${lo === 0 ? 'true' : 'false'}`, lo === 0 ? 'ok' : 'bad');
    if (first) v.say(`At the end, zero unmatched brackets must be possible, which means lo is zero. It is: true.`); else v.hold(900);
  };
  run(S2, true);
  v.clear();
  run(S, false);
  v.answer(vps(S2));

  recap(v, [{ name: 'Try every star', time: 'O(3ᵏ · n)', space: 'O(n)' }, { name: 'Memoised (i, open)', time: 'O(n²)', space: 'O(n²)' }, { name: 'Range [lo, hi]', time: 'O(n)', space: 'O(1)' }], 'Track the min and max possible open counts.', ['Wildcards with several meanings → track the range of possible states'], 'When choices only shift a counter, track its possible range instead of each choice.');
  return v.build();
}

const problem: Problem = {
  slug: 'valid-parenthesis-string',
  statement: 'Given a string `s` containing only `(`, `)` and `*`, return `true` if `s` is valid. `*` may be treated as `(`, `)`, or an empty string.',
  examples: [{ input: 's = "()"', output: 'true' }, { input: 's = "(*)"', output: 'true' }, { input: 's = "(*))"', output: 'true' }],
  constraints: ['1 ≤ n ≤ 100'],
  hints: ['The only state that matters is the number of unmatched "(".', 'Track the smallest and largest possible count.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every star', idea: 'Recurse over the three meanings of each star.', time: 'O(3ᵏ · n)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoised (i, open)', idea: 'DP on position and unmatched opens.', time: 'O(n²)', space: 'O(n²)', bottleneck: 'Quadratic states.' },
    { id: 'optimal', kind: 'optimal', name: 'Range of open counts', idea: 'lo/hi update per char; fail if hi < 0; clamp lo ≥ 0; answer lo == 0.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Track the **range** of possible states.',
  video,
  videoArgs: [S2],
  judge: {
    type: 'fn', fn: 'checkValidString', params: ['String'], ret: 'boolean',
    tests: [{ args: ['()'], out: true }, { args: ['(*)'], out: true }, { args: ['(*))'], out: true }, { args: [S], out: vps(S) }, { args: [S2], out: true }, { args: ['*('], out: false }],
    gen: (r: Rng) => [r.str(r.int(1, 10), '(()*')],
    ref: (s: string) => vps(s),
  },
};

export default problem;
