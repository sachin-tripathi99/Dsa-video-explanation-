import type { ListH, Video } from '../engine/builder';

/**
 * Animate reversing the chain `seq` (node ids in list order) with prev / cur / next pointers.
 * `before` is the node before the chain (or null), `after` the node after it (or null).
 * After the loop the chain's first node points at `after`, and `before` (if any) points at the old last node.
 * Display order is updated so the reversed chain reads left to right.
 */
export function animateReverse(
  v: Video,
  l: ListH,
  seq: string[],
  opts: { before?: string | null; after?: string | null; line?: number[]; firstSay?: string; perStep?: number; label?: (a: string) => string } = {},
) {
  const after = opts.after ?? null;
  let prev: string | null = after;
  const val = (id: string | null) => (id === null ? 'null' : String(l.val(id)));
  seq.forEach((cur, k) => {
    const nxt = k + 1 < seq.length ? seq[k + 1] : after;
    l.clearTones().ptr('prev', prev).ptr('cur', cur).ptr('next', nxt).tone(cur, 'active');
    l.setNext(cur, prev);
    if (opts.line) v.line(...opts.line);
    v.eq(`${val(cur)}.next = ${val(prev)} · prev = ${val(cur)} · cur = ${val(nxt)}`);
    if (k === 0 && opts.firstSay) v.say(opts.firstSay);
    else v.hold(opts.perStep ?? 750);
    prev = cur;
  });
  if (opts.before) l.setNext(opts.before, seq[seq.length - 1]);
  const all = l.ids();
  const first = all.indexOf(seq[0]);
  const rest = all.filter((x) => !seq.includes(x));
  const orderIds = [...rest.slice(0, first), ...[...seq].reverse(), ...rest.slice(first)];
  l.order(orderIds).noPtr('prev', 'cur', 'next').clearTones();
  seq.forEach((id) => l.tone(id, 'ok'));
  return seq[seq.length - 1];
}
