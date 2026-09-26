import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = '3[a2[c]]b';
function decode(s: string): string {
  const st: [string, number][] = [];
  let cur = '', k = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') k = k * 10 + Number(c);
    else if (c === '[') { st.push([cur, k]); cur = ''; k = 0; }
    else if (c === ']') { const [prev, n] = st.pop()!; cur = prev + cur.repeat(n); }
    else cur += c;
  }
  return cur;
}

function video() {
  const v = new Video('decode-string', 'Decode String');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 'k[encoded] means: repeat "encoded" k times' });
  v.say('Decode strings like three, open bracket, a, two, open bracket, c, close, close, b. The part inside brackets is repeated the number of times written before them, and brackets can nest.');
  v.eq(`"${S}" → "${decode(S)}"`);

  v.chapter('brute', 'Brute force: expand the innermost bracket, repeat', { cx: 'O(output · depth)', code: ['while "[" in s:', '  find an innermost k[...] (no brackets inside)', '  replace it by its expansion'] });
  v.eq('rebuilds the whole string at every level', 'warn').say('Repeatedly finding an innermost bracket pair and replacing it with its expansion works, but rebuilds the whole string many times.');

  v.chapter('optimal', 'Optimal: a stack of outer contexts', { cx: 'O(output)', code: ['digit → k = k·10 + d', '"[" → push (cur, k); cur = ""; k = 0', '"]" → (prev, n) = pop; cur = prev + cur × n', 'letter → cur += letter'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const st = v.stack('st', [], { label: 'saved (outer string, repeat)' });
  const vars = v.vars('v', { cur: '""', k: 0 });
  const stack: [string, number][] = [];
  let cur = '';
  let k = 0;
  v.say('Keep cur, the string being built at the current depth, and k, the number being read. An opening bracket means we go one level deeper, so save the outer string and its repeat count on a stack.');
  [...S].forEach((c, i) => {
    a.clearTones().tone(i, 'active');
    if (c >= '0' && c <= '9') { k = k * 10 + Number(c); v.line(0).eq(`k = ${k}`).hold(400); }
    else if (c === '[') {
      stack.push([cur, k]);
      st.push(`("${cur}", ${k})`);
      v.line(1).eq(`save ("${cur}", ${k}), start fresh`);
      v.say(stack.length === 1 ? 'The first opening bracket: save the empty outer string with repeat three, and start a fresh inner string.' : `Another level: save "${cur}" with repeat ${k}.`);
      cur = '';
      k = 0;
    } else if (c === ']') {
      const [prev, n] = stack.pop()!;
      st.pop();
      const inner = cur;
      cur = prev + cur.repeat(n);
      v.line(2).eq(`pop ("${prev}", ${n}) → "${prev}" + "${inner}" × ${n} = "${cur}"`, 'ok');
      v.say(`Closing bracket: pop the saved context. The inner string ${inner.split('').join(', ')}, repeated ${n} times, is appended to the saved outer string. Now cur is ${cur.length > 8 ? `${cur.length} letters long` : cur.split('').join(', ')}.`);
    } else { cur += c; v.line(3).eq(`cur = "${cur}"`).hold(400); }
    vars.set({ cur: `"${cur}"`, k });
  });
  a.clearTones();
  v.eq(`"${cur}"`, 'ok');
  v.answer(decode(S));

  recap(v, [{ name: 'Expand innermost repeatedly', time: 'O(output · depth)', space: 'O(output)' }, { name: 'Stack of contexts', time: 'O(output)', space: 'O(output)' }], 'Push the outer context on “[”, combine on “]”.', ['Nested structure → stack of saved contexts (or recursion)'], 'A stack of contexts is exactly what recursion would keep on the call stack.');
  return v.build();
}

const problem: Problem = {
  slug: 'decode-string',
  statement: 'Given an encoded string, return its decoded string. The encoding rule is `k[encoded_string]`, where the `encoded_string` inside the brackets is repeated exactly `k` times (`k` is a positive integer). The input is always valid; digits only appear as repeat counts.',
  examples: [{ input: 's = "3[a]2[bc]"', output: '"aaabcbc"' }, { input: 's = "3[a2[c]]"', output: '"accaccacc"' }, { input: 's = "2[abc]3[cd]ef"', output: '"abcabccdcdcdef"' }],
  constraints: ['1 ≤ s.length ≤ 30', '1 ≤ k ≤ 300', 'output length ≤ 10⁵'],
  hints: ['On “[” you go one level deeper. What must you remember?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Expand innermost repeatedly', idea: 'Replace an innermost k[...] with its expansion until no brackets remain.', time: 'O(output · depth)', space: 'O(output)', bottleneck: 'Rebuilds the string per level.' },
    { id: 'optimal', kind: 'optimal', name: 'Stack of contexts', idea: 'On “[” push (cur, k) and reset; on “]” pop (prev, n) and set cur = prev + cur × n.', time: 'O(output)', space: 'O(output)' },
  ],
  pitfalls: ['Multi-digit counts like 12[a]: accumulate k = k·10 + d.'],
  takeaway: 'Nesting → **push the outer context**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'decodeString', params: ['String'], ret: 'String',
    tests: [{ args: ['3[a]2[bc]'], out: 'aaabcbc' }, { args: ['3[a2[c]]'], out: 'accaccacc' }, { args: ['2[abc]3[cd]ef'], out: 'abcabccdcdcdef' }, { args: ['10[a]'], out: 'aaaaaaaaaa' }],
    gen: (r: Rng) => {
      const gen = (d: number): string => { let s = ''; const parts = r.int(1, 3); for (let i = 0; i < parts; i++) s += d > 0 && r.chance(0.5) ? `${r.int(1, 3)}[${gen(d - 1)}]` : r.str(r.int(1, 2), 'ab'); return s; };
      return [gen(2)];
    },
    ref: (s: string) => decode(s),
  },
};

export default problem;
