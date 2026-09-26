import type { Video } from '../engine/builder';

/**
 * Union-Find drawn two ways at once: a forest (each tree is one group, the root is its leader)
 * and the parent[] array. Node ids are "u" + index.
 */
export function dsuViz(
  v: Video,
  n: number,
  opts: { label?: string; labels?: (string | number)[]; arr?: boolean; arrLabel?: string; tid?: string; aid?: string } = {},
) {
  const t = v.tree(opts.tid ?? 'dsu', { label: opts.label ?? 'forest: each tree is a group, the root is its leader', binary: false });
  const L = opts.labels ?? Array.from({ length: n }, (_, i) => i);
  const ID = (i: number) => `u${i}`;
  for (let i = 0; i < n; i++) t.add(null, L[i], undefined, ID(i));
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = Array(n).fill(1);
  const arr = opts.arr === false ? null : v.array(opts.aid ?? 'parent', [...parent], { label: opts.arrLabel ?? 'parent[i]' });

  /** Re-hang `child` (with its subtree) under `par`. */
  const link = (child: number, par: number) => {
    const cid = ID(child);
    if (parent[child] === child) t.p.roots = t.p.roots.filter((r) => r !== cid);
    else {
      const old = t.p.nodes[ID(parent[child])];
      old.kids = old.kids.filter((k) => k !== cid);
    }
    t.p.nodes[ID(par)].kids.push(cid);
    parent[child] = par;
    arr?.set(child, par);
  };
  const path = (x: number) => {
    const out = [x];
    while (parent[out[out.length - 1]] !== out[out.length - 1]) out.push(parent[out[out.length - 1]]);
    return out;
  };
  const find = (x: number) => {
    const p = path(x);
    return p[p.length - 1];
  };
  return {
    t,
    arr,
    parent,
    size,
    ID,
    link,
    path,
    find,
    /** Highlight the walk from x up to its root. */
    showPath(x: number, keep = false) {
      if (!keep) {
        t.clearTones();
        arr?.clearTones();
      }
      const p = path(x);
      p.forEach((y, i) => {
        t.tone(ID(y), i === p.length - 1 ? 'ok' : 'path');
        arr?.tone(y, i === p.length - 1 ? 'ok' : 'path');
        if (i > 0) t.edge(ID(y), ID(p[i - 1]), 'path');
      });
      return p;
    },
    /** Point every node on x's path straight at the root. Returns the nodes that moved. */
    compress(x: number) {
      const p = path(x);
      const r = p[p.length - 1];
      const moved = p.slice(0, -2);
      for (const y of moved) link(y, r);
      return moved;
    },
    /** Union by size (or naive: root(a) under root(b)). Returns null if already together. */
    union(a: number, b: number, mode: 'size' | 'naive' = 'size') {
      let ra = find(a);
      let rb = find(b);
      if (ra === rb) return null;
      if (mode === 'naive') {
        link(ra, rb);
        size[rb] += size[ra];
        return { root: rb, child: ra };
      }
      if (size[ra] < size[rb]) [ra, rb] = [rb, ra];
      link(rb, ra);
      size[ra] += size[rb];
      return { root: ra, child: rb };
    },
    groups() {
      return parent.filter((p, i) => p === i).length;
    },
    sizeBadges() {
      t.clearBadges();
      parent.forEach((p, i) => {
        if (p === i) t.badge(ID(i), `size ${size[i]}`);
      });
    },
  };
}
