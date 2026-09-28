import type { Video } from '../engine/builder';

/**
 * A doubly linked list with head / tail sentinels, drawn left (head, most recent) to right
 * (tail, least recent). Nodes are addressed by a caller key.
 */
export function dllScene(v: Video, id: string, label: string) {
  const L = v.list(id, ['head', 'tail'], { label, prefix: `${id}s`, showNull: false, doubly: true });
  const H = L.id(0), T = L.id(1);
  L.tone([H, T], 'dim');
  let order: string[] = [];
  const nid = (k: string | number) => `${id}n${k}`;
  const sync = () => {
    const all = [H, ...order, T];
    L.order(all);
    all.forEach((x, i) => L.setNext(x, all[i + 1] ?? null));
  };
  return {
    L,
    nid,
    /** insert a new node right after head, or move an existing one there */
    front(k: string | number, text?: string | number) {
      const x = nid(k);
      if (order.includes(x)) order = order.filter((y) => y !== x);
      else L.add(x, text ?? k);
      if (text !== undefined) L.setVal(x, text);
      order.unshift(x);
      sync();
      return x;
    },
    /** insert a node right before tail */
    back(k: string | number, text?: string | number) {
      const x = nid(k);
      L.add(x, text ?? k);
      order.push(x);
      sync();
      return x;
    },
    remove(k: string | number) {
      const x = nid(k);
      order = order.filter((y) => y !== x);
      L.removeNode(x);
      sync();
    },
    setText(k: string | number, text: string | number) {
      L.setVal(nid(k), text);
    },
    /** keys from head to tail */
    keys() {
      return order.map((x) => x.slice(`${id}n`.length));
    },
    tone(k: string | number | (string | number)[], t: Parameters<typeof L.tone>[1]) {
      L.tone((Array.isArray(k) ? k : [k]).map(nid), t);
    },
    clearTones() {
      L.clearTones();
      L.tone([H, T], 'dim');
    },
  };
}

/** The example's calls and return values as a two-column table, split in halves side by side when long. */
export function opsTable(v: Video, calls: string[], outs: (string | number | null)[]) {
  const rows = calls.map((c, i) => [c, outs[i] === null ? '—' : String(outs[i])]);
  if (rows.length <= 6) return [v.table('ops', ['call', 'returns'], rows)];
  const h = Math.ceil(rows.length / 2);
  const t1 = v.table('ops1', ['call', 'returns'], rows.slice(0, h));
  const t2 = v.table('ops2', ['call', 'returns'], rows.slice(h));
  v.layout('row');
  return [t1, t2];
}
