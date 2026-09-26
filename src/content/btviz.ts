/** Decision-tree helper for backtracking videos: the recursion tree grows as calls are made. */
import type { Video } from '../engine/builder';
import type { Tone } from '../engine/types';

export function decisionTree(v: Video, id: string, label: string) {
  const t = v.tree(id, { binary: false, label });
  const path: string[] = [];
  const final: Record<string, Tone> = {};
  const parentOf: Record<string, string | null> = {};
  const refresh = () => {
    t.p.tones = {};
    t.p.edgeTones = {};
    for (const [n, tone] of Object.entries(final)) t.p.tones[n] = tone;
    path.forEach((n, i) => {
      if (!final[n]) t.p.tones[n] = i === path.length - 1 ? 'active' : 'path';
      const par = parentOf[n];
      if (par) t.p.edgeTones[`${par}>${n}`] = 'path';
    });
  };
  return {
    t,
    /** Make a call: add a child of the current node and step into it. */
    enter(text: string | number, edge?: string) {
      const parent = path.length ? path[path.length - 1] : null;
      const nid = t.add(parent, text);
      parentOf[nid] = parent;
      if (parent && edge) t.edgeLabel(parent, nid, edge);
      path.push(nid);
      refresh();
      return nid;
    },
    /** Return from the current call. */
    leave() {
      const x = path.pop();
      refresh();
      return x;
    },
    /** Give a node a lasting colour (ok = answer, bad = pruned / dead end). */
    mark(nid: string, tone: Tone) {
      final[nid] = tone;
      refresh();
    },
    get depth() {
      return path.length;
    },
    get current() {
      return path[path.length - 1] ?? null;
    },
    refresh,
  };
}
