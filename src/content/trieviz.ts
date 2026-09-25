import type { Video } from '../engine/builder';

/**
 * A trie drawn as an n-ary tree. Node ids are "n_" + the prefix they spell, so the root is "n_".
 * End-of-word nodes carry a ✓ badge, which survives clearTones().
 */
export function trieViz(v: Video, id: string, label?: string) {
  const t = v.tree(id, { label, binary: false });
  const ID = (p: string) => `n_${p}`;
  t.add(null, '•', undefined, ID(''));
  const ends = new Set<string>();
  const has = (p: string) => !!t.p.nodes[ID(p)];
  const sortKids = (p: string) => {
    t.p.nodes[ID(p)].kids.sort((a, b) => String(t.p.nodes[a!].v).localeCompare(String(t.p.nodes[b!].v)));
  };
  return {
    t,
    ID,
    has,
    ends,
    /** Walk `word`, creating missing nodes. `step(i, created)` runs after character i is placed, so the caller can emit a frame. */
    insert(word: string, step?: (i: number, created: boolean) => void) {
      t.clearTones().tone(ID(''), 'path');
      let made = 0;
      for (let i = 0; i < word.length; i++) {
        const p = word.slice(0, i + 1);
        const parent = word.slice(0, i);
        const created = !has(p);
        if (created) {
          t.add(ID(parent), word[i], undefined, ID(p));
          sortKids(parent);
          made++;
        }
        t.tone(ID(p), created ? 'visit' : 'path').edge(ID(parent), ID(p), created ? 'visit' : 'path');
        step?.(i, created);
      }
      ends.add(word);
      t.badge(ID(word), '✓').tone(ID(word), 'ok');
      return made;
    },
    /** Follow `s` from the root. Returns how many characters matched; highlights the path, and marks the failing parent. */
    walk(s: string, step?: (i: number) => void) {
      t.clearTones().tone(ID(''), 'path');
      for (let i = 0; i < s.length; i++) {
        const p = s.slice(0, i + 1);
        if (!has(p)) {
          t.tone(ID(s.slice(0, i)), 'bad');
          return i;
        }
        t.tone(ID(p), 'path').edge(ID(s.slice(0, i)), ID(p), 'path');
        step?.(i);
      }
      return s.length;
    },
    nodeCount() {
      return Object.keys(t.p.nodes).length;
    },
  };
}
