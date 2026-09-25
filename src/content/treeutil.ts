/** Small helpers for building BST inputs and reference answers from level-order arrays. */
export type Level = (number | null)[];
export interface TNode { v: number; l: TNode | null; r: TNode | null }

export function build(lv: Level): TNode | null {
  if (!lv.length || lv[0] === null) return null;
  const root: TNode = { v: lv[0] as number, l: null, r: null };
  const q: TNode[] = [root];
  let i = 1;
  while (q.length && i < lv.length) {
    const c = q.shift()!;
    if (i < lv.length && lv[i] !== null) { c.l = { v: lv[i] as number, l: null, r: null }; q.push(c.l); }
    i++;
    if (i < lv.length && lv[i] !== null) { c.r = { v: lv[i] as number, l: null, r: null }; q.push(c.r); }
    i++;
  }
  return root;
}

export function toLevel(root: TNode | null): Level {
  const out: Level = [];
  const q: (TNode | null)[] = [root];
  while (q.length) {
    const n = q.shift()!;
    if (!n) { out.push(null); continue; }
    out.push(n.v);
    q.push(n.l, n.r);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

export function inorder(root: TNode | null, out: number[] = []): number[] {
  if (!root) return out;
  inorder(root.l, out);
  out.push(root.v);
  inorder(root.r, out);
  return out;
}

export function bstInsert(root: TNode | null, x: number): TNode {
  if (!root) return { v: x, l: null, r: null };
  if (x < root.v) root.l = bstInsert(root.l, x);
  else root.r = bstInsert(root.r, x);
  return root;
}

/** A random BST (as a level-order array) built by inserting distinct values in random order. */
export function randomBst(r: { int(a: number, b: number): number; distinct(n: number, a: number, b: number): number[] }, maxN = 12, lo = 1, hi = 60): Level {
  const vals = r.distinct(r.int(1, maxN), lo, hi);
  let root: TNode | null = null;
  for (const x of vals) root = bstInsert(root, x);
  return toLevel(root);
}

/** A random binary tree with random values (not necessarily a BST). */
export function randomTree(r: { int(a: number, b: number): number; chance(p: number): boolean }, maxN = 15, lo = -9, hi = 9): Level {
  const n = r.int(0, maxN);
  const out: Level = [];
  let open = 1;
  for (let i = 0; i < n && open > 0; i++) {
    if (i > 0 && r.chance(0.25)) { out.push(null); open--; continue; }
    out.push(r.int(lo, hi));
    open += 1;
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
