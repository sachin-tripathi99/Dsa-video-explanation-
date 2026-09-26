/**
 * Checkers for problems that accept more than one correct answer.
 * Each gets the test arguments, the program output and the reference output.
 */
type Checker = (args: any[], out: any, expected: any) => boolean;

const isPal = (s: string) => s === [...s].reverse().join('');
const sameMultiset = (a: string, b: string) => [...a].sort().join('') === [...b].sort().join('');

function inorder(level: (number | null)[]): number[] {
  // level-order array → in-order values
  const nodes: { v: number; l: number; r: number }[] = [];
  if (!level.length || level[0] === null) return [];
  nodes.push({ v: level[0] as number, l: -1, r: -1 });
  const q = [0];
  let i = 1;
  while (q.length && i < level.length) {
    const cur = q.shift()!;
    if (i < level.length && level[i] !== null) {
      nodes.push({ v: level[i] as number, l: -1, r: -1 });
      nodes[cur].l = nodes.length - 1;
      q.push(nodes.length - 1);
    }
    i++;
    if (i < level.length && level[i] !== null) {
      nodes.push({ v: level[i] as number, l: -1, r: -1 });
      nodes[cur].r = nodes.length - 1;
      q.push(nodes.length - 1);
    }
    i++;
  }
  const out: number[] = [];
  const walk = (x: number) => {
    if (x < 0) return;
    walk(nodes[x].l);
    out.push(nodes[x].v);
    walk(nodes[x].r);
  };
  walk(0);
  return out;
}

function heightBalanced(level: (number | null)[]): boolean {
  const idx = new Map<number, { l: number; r: number }>();
  if (!level.length || level[0] === null) return true;
  const kids: { l: number; r: number }[] = [{ l: -1, r: -1 }];
  const q = [0];
  let i = 1;
  while (q.length && i < level.length) {
    const cur = q.shift()!;
    if (i < level.length && level[i] !== null) {
      kids.push({ l: -1, r: -1 });
      kids[cur].l = kids.length - 1;
      q.push(kids.length - 1);
    }
    i++;
    if (i < level.length && level[i] !== null) {
      kids.push({ l: -1, r: -1 });
      kids[cur].r = kids.length - 1;
      q.push(kids.length - 1);
    }
    i++;
  }
  void idx;
  let ok = true;
  const h = (x: number): number => {
    if (x < 0) return 0;
    const a = h(kids[x].l);
    const b = h(kids[x].r);
    if (Math.abs(a - b) > 1) ok = false;
    return 1 + Math.max(a, b);
  };
  h(0);
  return ok;
}

const sortedAsc = (a: number[]) => a.every((x, i) => i === 0 || a[i - 1] < x);

export const CHECKERS: Record<string, Checker> = {
  /** Any index that is a peak (162). */
  peak: ([nums], out) => {
    const n = nums.length;
    const at = (i: number) => (i < 0 || i >= n ? -Infinity : nums[i]);
    return Number.isInteger(out) && out >= 0 && out < n && at(out) > at(out - 1) && at(out) > at(out + 1);
  },
  /** Valid topological order or [] when impossible (210). */
  topoOrder: ([n, pre], out, expected) => {
    if (!Array.isArray(out)) return false;
    if (expected.length === 0) return out.length === 0;
    if (out.length !== n || new Set(out).size !== n) return false;
    const pos = new Map<number, number>(out.map((x: number, i: number) => [x, i]));
    return pre.every(([a, b]: number[]) => pos.get(b)! < pos.get(a)!);
  },
  /** Characters grouped and sorted by frequency, ties in any order (451). */
  freqSort: ([s], out) => {
    if (typeof out !== 'string' || !sameMultiset(s, out)) return false;
    const cnt = new Map<string, number>();
    for (const c of s) cnt.set(c, (cnt.get(c) ?? 0) + 1);
    let prev = Infinity;
    for (let i = 0; i < out.length; ) {
      const c = out[i];
      let j = i;
      while (j < out.length && out[j] === c) j++;
      if (j - i !== cnt.get(c)) return false;
      if (j - i > prev) return false;
      prev = j - i;
      i = j;
    }
    return true;
  },
  /** k pairs (u, v) with the smallest sums, ties in any order (373). */
  kSmallestPairs: ([a, b, k], out) => {
    if (!Array.isArray(out)) return false;
    const want = Math.min(k, a.length * b.length);
    if (out.length !== want) return false;
    const sums: number[] = [];
    for (const x of a) for (const y of b) sums.push(x + y);
    sums.sort((x, y) => x - y);
    const got = out.map((p: number[]) => p[0] + p[1]).sort((x: number, y: number) => x - y);
    if (got.some((s: number, i: number) => s !== sums[i])) return false;
    // each value pair used no more often than it can be formed
    const cnt = (arr: number[], v: number) => arr.filter((x) => x === v).length;
    const used = new Map<string, number>();
    for (const p of out) {
      if (!Array.isArray(p) || p.length !== 2) return false;
      const key = `${p[0]},${p[1]}`;
      used.set(key, (used.get(key) ?? 0) + 1);
    }
    for (const [key, c] of used) {
      const [u, v] = key.split(',').map(Number);
      if (c > cnt(a, u) * cnt(b, v)) return false;
    }
    return true;
  },
  /** Rearranged with no equal neighbours, or "" when impossible (767). */
  noAdjacent: ([s], out, expected) => {
    if (expected === '') return out === '';
    if (typeof out !== 'string' || !sameMultiset(s, out)) return false;
    for (let i = 1; i < out.length; i++) if (out[i] === out[i - 1]) return false;
    return true;
  },
  /** Valid parentheses string of maximum length that is a subsequence of s (1249). */
  minRemoveParens: ([s], out, expected) => {
    if (typeof out !== 'string' || out.length !== expected.length) return false;
    let bal = 0;
    for (const c of out) {
      if (c === '(') bal++;
      else if (c === ')' && --bal < 0) return false;
    }
    if (bal !== 0) return false;
    let j = 0;
    for (const c of s) if (j < out.length && c === out[j]) j++;
    return j === out.length;
  },
  /** Any longest palindromic substring (5). */
  longestPalSub: ([s], out, expected) => typeof out === 'string' && out.length === expected.length && isPal(out) && s.includes(out),
  /** Height-balanced BST whose in-order equals the sorted input (108). */
  balancedBst: ([nums], out) => Array.isArray(out) && JSON.stringify(inorder(out)) === JSON.stringify(nums) && heightBalanced(out),
  /** A valid BST with the same in-order as the expected tree (450, 701). */
  sameBstSet: (_args, out, expected) => Array.isArray(out) && sortedAsc(inorder(out)) && JSON.stringify(inorder(out)) === JSON.stringify(inorder(expected)),
  /** k pairs with the smallest sums; ties may be broken differently (373). */
  kPairs: ([a, b, k], out, expected) => {
    if (!Array.isArray(out) || out.length !== expected.length) return false;
    const sums = (x: number[][]) => x.map((p) => p[0] + p[1]).sort((m, n) => m - n).join(',');
    if (sums(out) !== sums(expected)) return false;
    void k;
    return out.every((p: number[]) => a.includes(p[0]) && b.includes(p[1]));
  },
  /** Output equals any of the listed answers (expected is a list of answers). */
  anyOf: (_args, out, expected) => expected.some((e: unknown) => JSON.stringify(e) === JSON.stringify(out)),
  /** Any k closest-to-origin points, compared as a set (973 with ties). */
  sameSet: (_args, out, expected) => {
    const norm = (x: unknown[]) => x.map((y) => JSON.stringify(y)).sort().join('|');
    return Array.isArray(out) && norm(out) === norm(expected);
  },
};
