/**
 * Video builder: authors mutate a small scene through panel handles and call
 * `say()` (narrated frame) or `hold()` (silent frame) to snapshot it.
 *
 *   const v = new Video('two-sum-ii', 'Two Sum II');
 *   v.chapter('optimal', 'Two pointers', { cx: 'O(n)', code: [...] });
 *   const a = v.array('nums', [1, 3, 4, 6]);
 *   a.ptr('L', 0).ptr('R', 3);
 *   v.eq('1 + 6 = 7 < 9', 'bad').line(2).say('Too small, so L moves right.');
 */
import type {
  ArrayPanel, BarsPanel, BitsPanel, Chapter, ChapterKind, ChartPanel, Frame, GraphNodeView, GraphPanel,
  GridPanel, HeapPanel, IntervalsPanel, Item, ListPanel, MapPanel, Panel, Ptr, StackPanel, TablePanel,
  TextPanel, Tone, TreePanel, VarsPanel, VideoScript,
} from './types';

const KINDS: ChapterKind[] = ['intro', 'concept', 'brute', 'better', 'optimal', 'recap'];
type Val = string | number | null;

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

export class Video {
  readonly id: string;
  readonly title: string;
  private chapters: Chapter[] = [];
  private frames: Frame[] = [];
  private order: string[] = [];
  private panels = new Map<string, Panel>();
  private _layout: Frame['layout'] = 'col';
  private _line: number[] = [];
  private _eq = '';
  private _eqTone: Frame['eqTone'] = 'none';
  private _note = '';
  private _counter = '';
  private _answer: unknown = undefined;
  private key = 1;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  nextKey() {
    return this.key++;
  }

  /* ---------- chapters & frame-level marks ---------- */

  chapter(id: string, title: string, opts: { kind?: ChapterKind; cx?: string; code?: string[] } = {}) {
    const kind = opts.kind ?? (KINDS.includes(id as ChapterKind) ? (id as ChapterKind) : 'concept');
    this.chapters.push({ id, title, kind, cx: opts.cx, code: opts.code });
    this._line = [];
    this._eq = '';
    this._eqTone = 'none';
    this._note = '';
    return this;
  }

  /** Replace pseudocode for the current chapter. */
  code(lines: string[]) {
    const ch = this.chapters[this.chapters.length - 1];
    if (ch) ch.code = lines;
    return this;
  }

  line(...ls: number[]) {
    this._line = ls;
    return this;
  }
  eq(text: string, tone: Frame['eqTone'] = 'none') {
    this._eq = text;
    this._eqTone = tone;
    return this;
  }
  note(text: string) {
    this._note = text;
    return this;
  }
  counter(text: string) {
    this._counter = text;
    return this;
  }
  layout(l: Frame['layout']) {
    this._layout = l;
    return this;
  }
  answer(x: unknown) {
    this._answer = x;
    return this;
  }
  /** Clear eq, note and highlighted lines. */
  clearMarks() {
    this._eq = '';
    this._eqTone = 'none';
    this._note = '';
    this._line = [];
    return this;
  }

  /* ---------- snapshots ---------- */

  say(text: string, hold = 0) {
    return this.snap(text, hold);
  }
  hold(ms = 700) {
    return this.snap('', ms);
  }

  private snap(say: string, hold: number) {
    if (!this.chapters.length) this.chapter('intro', 'Introduction');
    this.frames.push({
      ch: this.chapters.length - 1,
      say: say.trim(),
      hold: hold || (say ? 0 : 700),
      panels: this.order.map((id) => clone(this.panels.get(id)!)),
      layout: this._layout,
      line: [...this._line],
      eq: this._eq,
      eqTone: this._eqTone,
      note: this._note,
      counter: this._counter,
    });
    return this;
  }

  build(): VideoScript {
    if (!this.frames.length) throw new Error(`Video ${this.id} has no frames`);
    return { id: this.id, title: this.title, chapters: this.chapters, frames: this.frames, answer: this._answer };
  }

  /* ---------- panel management ---------- */

  private add<T extends Panel>(p: T): T {
    if (!this.panels.has(p.id)) this.order.push(p.id);
    this.panels.set(p.id, p);
    return p;
  }
  drop(...ids: string[]) {
    for (const id of ids) {
      this.panels.delete(id);
      this.order = this.order.filter((x) => x !== id);
    }
    return this;
  }
  /** Remove every panel and reset eq, note, highlighted lines and the counter. */
  clear() {
    this.panels.clear();
    this.order = [];
    this._counter = '';
    this._layout = 'col';
    return this.clearMarks();
  }
  /** Reorder panels. */
  arrange(...ids: string[]) {
    this.order = [...ids.filter((i) => this.panels.has(i)), ...this.order.filter((i) => !ids.includes(i))];
    return this;
  }
  has(id: string) {
    return this.panels.has(id);
  }

  array(id: string, values: Val[], opts: { label?: string; showIdx?: boolean; bars?: boolean } = {}) {
    const p = this.add<ArrayPanel>({
      kind: 'array', id, label: opts.label, items: values.map((v) => ({ k: this.nextKey(), v })),
      tones: {}, ptrs: [], win: null, sub: {}, tags: {}, showIdx: opts.showIdx ?? true, bars: opts.bars,
    });
    return new ArrayH(this, p);
  }
  grid(id: string, cells: Val[][], opts: { label?: string; rowHead?: string[]; colHead?: string[]; cellSize?: number } = {}) {
    const p = this.add<GridPanel>({
      kind: 'grid', id, label: opts.label, cells: clone(cells), tones: {}, rowHead: opts.rowHead, colHead: opts.colHead,
      ptrs: [], arrows: [], cellSize: opts.cellSize,
    });
    return new GridH(p);
  }
  list(id: string, values: (string | number)[], opts: { label?: string; showNull?: boolean; prefix?: string } = {}) {
    const pre = opts.prefix ?? id;
    const nodes = values.map((v, i) => ({ id: `${pre}${i}`, v }));
    const next: Record<string, string | null> = {};
    nodes.forEach((n, i) => (next[n.id] = i + 1 < nodes.length ? nodes[i + 1].id : null));
    const p = this.add<ListPanel>({ kind: 'list', id, label: opts.label, nodes, next, tones: {}, ptrs: [], showNull: opts.showNull ?? true, row: {} });
    return new ListH(p);
  }
  tree(id: string, opts: { label?: string; binary?: boolean } = {}) {
    const p = this.add<TreePanel>({
      kind: 'tree', id, label: opts.label, nodes: {}, roots: [], tones: {}, edgeTones: {}, badges: {}, edgeLabels: {}, ptrs: [],
      binary: opts.binary ?? true,
    });
    return new TreeH(p);
  }
  /** Binary tree from LeetCode level-order array. Node ids are "t" + index in the array. */
  binaryTree(id: string, level: Val[], opts: { label?: string; prefix?: string } = {}) {
    const t = this.tree(id, { label: opts.label, binary: true });
    const pre = opts.prefix ?? 't';
    if (!level.length || level[0] === null) return t;
    const ids: string[] = [];
    const rootId = `${pre}0`;
    t.p.nodes[rootId] = { v: level[0] as string | number, kids: [null, null] };
    t.p.roots = [rootId];
    ids.push(rootId);
    let qi = 0;
    let i = 1;
    while (i < level.length && qi < ids.length) {
      const parent = ids[qi++];
      for (let side = 0; side < 2 && i < level.length; side++, i++) {
        const val = level[i];
        if (val === null) continue;
        const nid = `${pre}${i}`;
        t.p.nodes[nid] = { v: val, kids: [null, null] };
        t.p.nodes[parent].kids[side] = nid;
        ids.push(nid);
      }
    }
    return t;
  }
  graph(id: string, nodes: GraphNodeView[], edges: { a: string; b: string; w?: number | string }[], opts: { label?: string; directed?: boolean } = {}) {
    const p = this.add<GraphPanel>({ kind: 'graph', id, label: opts.label, nodes, edges, directed: opts.directed, tones: {}, edgeTones: {}, badges: {} });
    return new GraphH(p);
  }
  stack(id: string, values: Val[] = [], opts: { label?: string; ends?: [string, string] } = {}) {
    const p = this.add<StackPanel>({ kind: 'stack', id, label: opts.label, items: values.map((v) => ({ k: this.nextKey(), v })), tones: {}, ends: opts.ends });
    return new SeqH(this, p);
  }
  queue(id: string, values: Val[] = [], opts: { label?: string; ends?: [string, string] } = {}) {
    const p = this.add<StackPanel>({ kind: 'queue', id, label: opts.label, items: values.map((v) => ({ k: this.nextKey(), v })), tones: {}, ends: opts.ends ?? ['front', 'back'] });
    return new SeqH(this, p);
  }
  map(id: string, opts: { label?: string; set?: boolean } = {}) {
    const p = this.add<MapPanel>({ kind: 'map', id, label: opts.label, entries: [], tones: {}, set: opts.set });
    return new MapH(p);
  }
  heap(id: string, opts: { label?: string; min?: boolean; cmp?: (a: Val, b: Val) => number } = {}) {
    const p = this.add<HeapPanel>({ kind: 'heap', id, label: opts.label, items: [], tones: {} });
    const min = opts.min ?? true;
    const cmp = opts.cmp ?? ((a: Val, b: Val) => (min ? Number(a) - Number(b) : Number(b) - Number(a)));
    return new HeapH(this, p, cmp);
  }
  chart(id: string, curves: ChartPanel['curves'], opts: { label?: string; xMax?: number; yMax?: number } = {}) {
    const p = this.add<ChartPanel>({ kind: 'chart', id, label: opts.label, curves, xMax: opts.xMax ?? 20, yMax: opts.yMax ?? 100 });
    return new Simple<ChartPanel>(p);
  }
  bars(id: string, bars: BarsPanel['bars'], opts: { label?: string; log?: boolean } = {}) {
    const p = this.add<BarsPanel>({ kind: 'bars', id, label: opts.label, bars, log: opts.log });
    return new Simple<BarsPanel>(p);
  }
  text(id: string, t: { title?: string; subtitle?: string; lines?: string[]; shown?: number; big?: boolean; mono?: boolean }) {
    const p = this.add<TextPanel>({ kind: 'text', id, title: t.title, subtitle: t.subtitle, lines: t.lines ?? [], shown: t.shown, big: t.big, mono: t.mono, tones: {} });
    return new TextH(p);
  }
  table(id: string, head: string[], rows: string[][], opts: { label?: string } = {}) {
    const p = this.add<TablePanel>({ kind: 'table', id, label: opts.label, head, rows, tones: {}, cellTones: {} });
    return new TableH(p);
  }
  bits(id: string, rows: BitsPanel['rows'], opts: { label?: string } = {}) {
    const p = this.add<BitsPanel>({ kind: 'bits', id, label: opts.label, rows });
    return new Simple<BitsPanel>(p);
  }
  intervals(id: string, items: [number, number][], opts: { label?: string; min?: number; max?: number } = {}) {
    const lo = opts.min ?? Math.min(...items.map((x) => x[0]), 0);
    const hi = opts.max ?? Math.max(...items.map((x) => x[1]), 1);
    const p = this.add<IntervalsPanel>({
      kind: 'intervals', id, label: opts.label, items: items.map(([s, e], i) => ({ k: i, s, e, text: `[${s},${e}]`, row: i })),
      tones: {}, min: lo, max: hi, cursor: null,
    });
    return new IntervalsH(p);
  }
  vars(id: string, vars: Record<string, Val> = {}, opts: { label?: string } = {}) {
    const p = this.add<VarsPanel>({ kind: 'vars', id, label: opts.label, vars: [] });
    const h = new VarsH(p);
    h.set(vars);
    return h;
  }
}

/* ---------- handles ---------- */

class Simple<T extends Panel> {
  constructor(public p: T) {}
  update(patch: Partial<T>) {
    for (const [k, val] of Object.entries(patch)) {
      if (val === undefined) delete (this.p as unknown as Record<string, unknown>)[k];
      else (this.p as unknown as Record<string, unknown>)[k] = clone(val);
    }
    return this;
  }
}

export class ArrayH {
  constructor(private v: Video, public p: ArrayPanel) {}
  get length() {
    return this.p.items.length;
  }
  get values() {
    return this.p.items.map((x) => x.v);
  }
  get(i: number) {
    return this.p.items[i]?.v;
  }
  set(i: number, v: Val) {
    this.p.items[i].v = v;
    return this;
  }
  setAll(values: Val[]) {
    this.p.items = values.map((v, i) => ({ k: this.p.items[i]?.k ?? this.v.nextKey(), v }));
    return this;
  }
  swap(i: number, j: number) {
    const it = this.p.items;
    [it[i], it[j]] = [it[j], it[i]];
    return this;
  }
  /** Move element from index i to index j (shifting others), e.g. insertion sort. */
  move(i: number, j: number) {
    const [x] = this.p.items.splice(i, 1);
    this.p.items.splice(j, 0, x);
    return this;
  }
  push(v: Val) {
    this.p.items.push({ k: this.v.nextKey(), v });
    return this;
  }
  pop() {
    return this.p.items.pop()?.v;
  }
  insert(i: number, v: Val) {
    this.p.items.splice(i, 0, { k: this.v.nextKey(), v });
    return this;
  }
  remove(i: number) {
    this.p.items.splice(i, 1);
    return this;
  }
  tone(i: number | number[], t: Tone) {
    for (const x of Array.isArray(i) ? i : [i]) {
      if (t === 'none') delete this.p.tones[x];
      else this.p.tones[x] = t;
    }
    return this;
  }
  toneRange(l: number, r: number, t: Tone) {
    for (let i = l; i <= r; i++) this.tone(i, t);
    return this;
  }
  clearTones(keep: Tone[] = []) {
    for (const k of Object.keys(this.p.tones)) if (!keep.includes(this.p.tones[+k])) delete this.p.tones[+k];
    return this;
  }
  ptr(name: string, at: number | null, color?: Ptr['color']) {
    this.p.ptrs = this.p.ptrs.filter((x) => x.name !== name);
    if (at !== null && at !== undefined) this.p.ptrs.push({ name, at, color: color ?? autoColor(name) });
    return this;
  }
  ptrs(map: Record<string, number | null>) {
    for (const [n, i] of Object.entries(map)) this.ptr(n, i);
    return this;
  }
  noPtr(...names: string[]) {
    this.p.ptrs = names.length ? this.p.ptrs.filter((x) => !names.includes(x.name)) : [];
    return this;
  }
  win(l: number, r: number, tone: Tone = 'win', label?: string) {
    this.p.win = { l, r, tone, label };
    return this;
  }
  noWin() {
    this.p.win = null;
    return this;
  }
  sub(i: number, text: string | number | null) {
    if (text === null || text === '') delete this.p.sub![i];
    else this.p.sub![i] = String(text);
    return this;
  }
  subs(texts: (string | number | null)[]) {
    this.p.sub = {};
    texts.forEach((t, i) => this.sub(i, t));
    return this;
  }
  tag(i: number, text: string | null) {
    if (!text) delete this.p.tags![i];
    else this.p.tags![i] = text;
    return this;
  }
  clearTags() {
    this.p.tags = {};
    return this;
  }
  label(s: string) {
    this.p.label = s;
    return this;
  }
}

export function autoColor(name: string): Ptr['color'] {
  const n = name.toLowerCase();
  if (['i', 'l', 'left', 'slow', 'lo', 'low', 'start', 'read', 'prev', 'a', 'p1'].includes(n)) return 1;
  if (['j', 'r', 'right', 'fast', 'hi', 'high', 'end', 'write', 'curr', 'b', 'p2'].includes(n)) return 2;
  if (['mid', 'm', 'k', 'pivot', 'next', 'nxt'].includes(n)) return 4;
  return 3;
}

export class GridH {
  constructor(public p: GridPanel) {}
  get rows() {
    return this.p.cells.length;
  }
  get cols() {
    return this.p.cells[0]?.length ?? 0;
  }
  get(r: number, c: number) {
    return this.p.cells[r][c];
  }
  set(r: number, c: number, v: Val) {
    this.p.cells[r][c] = v;
    return this;
  }
  tone(r: number, c: number, t: Tone) {
    const k = `${r},${c}`;
    if (t === 'none') delete this.p.tones[k];
    else this.p.tones[k] = t;
    return this;
  }
  toneCells(cells: [number, number][], t: Tone) {
    for (const [r, c] of cells) this.tone(r, c, t);
    return this;
  }
  toneRow(r: number, t: Tone) {
    for (let c = 0; c < this.cols; c++) this.tone(r, c, t);
    return this;
  }
  toneCol(c: number, t: Tone) {
    for (let r = 0; r < this.rows; r++) this.tone(r, c, t);
    return this;
  }
  clearTones(keep: Tone[] = []) {
    for (const k of Object.keys(this.p.tones)) if (!keep.includes(this.p.tones[k])) delete this.p.tones[k];
    return this;
  }
  ptr(name: string, r: number | null, c?: number, color?: Ptr['color']) {
    this.p.ptrs = (this.p.ptrs ?? []).filter((x) => x.name !== name);
    if (r !== null && c !== undefined) this.p.ptrs.push({ name, r, c, color: color ?? autoColor(name) });
    return this;
  }
  noPtr() {
    this.p.ptrs = [];
    return this;
  }
  arrow(from: [number, number], to: [number, number], tone: Tone = 'active') {
    this.p.arrows!.push({ from, to, tone });
    return this;
  }
  noArrows() {
    this.p.arrows = [];
    return this;
  }
  heads(rowHead?: string[], colHead?: string[]) {
    this.p.rowHead = rowHead;
    this.p.colHead = colHead;
    return this;
  }
}

export class ListH {
  constructor(public p: ListPanel) {}
  ids() {
    return this.p.nodes.map((n) => n.id);
  }
  id(i: number) {
    return this.p.nodes[i].id;
  }
  val(id: string) {
    return this.p.nodes.find((n) => n.id === id)?.v;
  }
  /** Follow next pointers from a node id (for authoring loops). */
  nextOf(id: string | null) {
    return id === null ? null : this.p.next[id] ?? null;
  }
  setNext(id: string, to: string | null) {
    this.p.next[id] = to;
    return this;
  }
  setVal(id: string, v: string | number) {
    const n = this.p.nodes.find((x) => x.id === id);
    if (n) n.v = v;
    return this;
  }
  add(id: string, v: string | number, at?: number, next: string | null = null) {
    const node = { id, v };
    if (at === undefined) this.p.nodes.push(node);
    else this.p.nodes.splice(at, 0, node);
    this.p.next[id] = next;
    return this;
  }
  removeNode(id: string) {
    this.p.nodes = this.p.nodes.filter((n) => n.id !== id);
    delete this.p.next[id];
    for (const k of Object.keys(this.p.next)) if (this.p.next[k] === id) this.p.next[k] = null;
    this.p.ptrs = this.p.ptrs.map((x) => (x.node === id ? { ...x, node: null } : x));
    return this;
  }
  /** Re-order the display (e.g. after a reversal completes). */
  order(ids: string[]) {
    const byId = new Map(this.p.nodes.map((n) => [n.id, n]));
    this.p.nodes = ids.map((i) => byId.get(i)!).filter(Boolean);
    return this;
  }
  row(id: string, r: number) {
    this.p.row![id] = r;
    return this;
  }
  tone(id: string | string[] | null, t: Tone) {
    for (const x of Array.isArray(id) ? id : [id]) {
      if (x === null) continue;
      if (t === 'none') delete this.p.tones[x];
      else this.p.tones[x] = t;
    }
    return this;
  }
  clearTones(keep: Tone[] = []) {
    for (const k of Object.keys(this.p.tones)) if (!keep.includes(this.p.tones[k])) delete this.p.tones[k];
    return this;
  }
  ptr(name: string, node: string | null, color?: Ptr['color']) {
    this.p.ptrs = this.p.ptrs.filter((x) => x.name !== name);
    this.p.ptrs.push({ name, node, color: color ?? autoColor(name) });
    return this;
  }
  noPtr(...names: string[]) {
    this.p.ptrs = names.length ? this.p.ptrs.filter((x) => !names.includes(x.name)) : [];
    return this;
  }
}

export class TreeH {
  private n = 0;
  constructor(public p: TreePanel) {}
  node(id: string) {
    return this.p.nodes[id];
  }
  val(id: string) {
    return this.p.nodes[id]?.v;
  }
  left(id: string | null) {
    return id ? this.p.nodes[id]?.kids[0] ?? null : null;
  }
  right(id: string | null) {
    return id ? this.p.nodes[id]?.kids[1] ?? null : null;
  }
  kids(id: string) {
    return (this.p.nodes[id]?.kids ?? []).filter((x): x is string => !!x);
  }
  root() {
    return this.p.roots[0] ?? null;
  }
  /** Add a node. For binary trees pass side 0 (left) / 1 (right); for n-ary omit side to append. */
  add(parent: string | null, v: string | number, side?: 0 | 1, id?: string) {
    const nid = id ?? `${this.p.id}_${this.n++}`;
    this.p.nodes[nid] = { v, kids: this.p.binary ? [null, null] : [] };
    if (parent === null) this.p.roots.push(nid);
    else if (side !== undefined) this.p.nodes[parent].kids[side] = nid;
    else this.p.nodes[parent].kids.push(nid);
    return nid;
  }
  setVal(id: string, v: string | number) {
    this.p.nodes[id].v = v;
    return this;
  }
  setKid(parent: string, side: number, child: string | null) {
    this.p.nodes[parent].kids[side] = child;
    return this;
  }
  /** Remove a node and its whole subtree. */
  remove(id: string) {
    const kill = (x: string) => {
      for (const k of this.kids(x)) kill(k);
      delete this.p.nodes[x];
      delete this.p.tones[x];
      delete this.p.badges[x];
    };
    for (const n of Object.values(this.p.nodes)) n.kids = n.kids.map((k) => (k === id ? null : k));
    this.p.roots = this.p.roots.filter((r) => r !== id);
    kill(id);
    this.p.ptrs = this.p.ptrs.filter((x) => this.p.nodes[x.node]);
    return this;
  }
  setRoots(ids: string[]) {
    this.p.roots = ids;
    return this;
  }
  tone(id: string | string[] | null, t: Tone) {
    for (const x of Array.isArray(id) ? id : [id]) {
      if (!x) continue;
      if (t === 'none') delete this.p.tones[x];
      else this.p.tones[x] = t;
    }
    return this;
  }
  clearTones(keep: Tone[] = []) {
    for (const k of Object.keys(this.p.tones)) if (!keep.includes(this.p.tones[k])) delete this.p.tones[k];
    this.p.edgeTones = {};
    return this;
  }
  edge(parent: string, child: string, t: Tone) {
    const k = `${parent}>${child}`;
    if (t === 'none') delete this.p.edgeTones[k];
    else this.p.edgeTones[k] = t;
    return this;
  }
  badge(id: string, text: string | number | null) {
    if (text === null || text === '') delete this.p.badges[id];
    else this.p.badges[id] = String(text);
    return this;
  }
  clearBadges() {
    this.p.badges = {};
    return this;
  }
  edgeLabel(parent: string, child: string, text: string) {
    this.p.edgeLabels![`${parent}>${child}`] = text;
    return this;
  }
  ptr(name: string, node: string | null, color?: Ptr['color']) {
    this.p.ptrs = this.p.ptrs.filter((x) => x.name !== name);
    if (node) this.p.ptrs.push({ name, node, color: color ?? autoColor(name) });
    return this;
  }
  noPtr(...names: string[]) {
    this.p.ptrs = names.length ? this.p.ptrs.filter((x) => !names.includes(x.name)) : [];
    return this;
  }
  /** Ids in BFS order. */
  bfs() {
    const out: string[] = [];
    const q = [...this.p.roots];
    while (q.length) {
      const x = q.shift()!;
      out.push(x);
      q.push(...this.kids(x));
    }
    return out;
  }
}

export class GraphH {
  constructor(public p: GraphPanel) {}
  neighbors(id: string) {
    const out: { id: string; w?: number | string }[] = [];
    for (const e of this.p.edges) {
      if (e.a === id) out.push({ id: e.b, w: e.w });
      else if (!this.p.directed && e.b === id) out.push({ id: e.a, w: e.w });
    }
    return out;
  }
  tone(id: string | string[], t: Tone) {
    for (const x of Array.isArray(id) ? id : [id]) {
      if (t === 'none') delete this.p.tones[x];
      else this.p.tones[x] = t;
    }
    return this;
  }
  edge(a: string, b: string, t: Tone) {
    const k = `${a}>${b}`;
    if (t === 'none') {
      delete this.p.edgeTones[k];
      delete this.p.edgeTones[`${b}>${a}`];
    } else this.p.edgeTones[k] = t;
    return this;
  }
  badge(id: string, text: string | number | null) {
    if (text === null || text === '') delete this.p.badges[id];
    else this.p.badges[id] = String(text);
    return this;
  }
  clearTones(keep: Tone[] = []) {
    for (const k of Object.keys(this.p.tones)) if (!keep.includes(this.p.tones[k])) delete this.p.tones[k];
    for (const k of Object.keys(this.p.edgeTones)) if (!keep.includes(this.p.edgeTones[k])) delete this.p.edgeTones[k];
    return this;
  }
}

export class SeqH {
  constructor(private v: Video, public p: StackPanel) {}
  get size() {
    return this.p.items.length;
  }
  get values() {
    return this.p.items.map((x) => x.v);
  }
  /** Top of a stack / back of a queue. */
  peek() {
    return this.p.items[this.p.items.length - 1]?.v;
  }
  front() {
    return this.p.items[0]?.v;
  }
  push(v: Val) {
    this.p.items.push({ k: this.v.nextKey(), v });
    return this;
  }
  pushFront(v: Val) {
    this.p.items.unshift({ k: this.v.nextKey(), v });
    return this;
  }
  pop() {
    const x = this.p.items.pop();
    delete this.p.tones[this.p.items.length];
    return x?.v;
  }
  shift() {
    const x = this.p.items.shift();
    this.p.tones = {};
    return x?.v;
  }
  set(i: number, v: Val) {
    this.p.items[i].v = v;
    return this;
  }
  tone(i: number | number[], t: Tone) {
    for (const x of Array.isArray(i) ? i : [i]) {
      if (t === 'none') delete this.p.tones[x];
      else this.p.tones[x] = t;
    }
    return this;
  }
  toneTop(t: Tone) {
    return this.tone(this.p.items.length - 1, t);
  }
  clearTones() {
    this.p.tones = {};
    return this;
  }
  clearAll() {
    this.p.items = [];
    this.p.tones = {};
    return this;
  }
}

export class MapH {
  constructor(public p: MapPanel) {}
  has(k: string | number) {
    return this.p.entries.some((e) => e.k === String(k));
  }
  get(k: string | number) {
    return this.p.entries.find((e) => e.k === String(k))?.v;
  }
  put(k: string | number, v: string | number = '') {
    const key = String(k);
    const e = this.p.entries.find((x) => x.k === key);
    if (e) e.v = String(v);
    else this.p.entries.push({ k: key, v: String(v) });
    return this;
  }
  del(k: string | number) {
    this.p.entries = this.p.entries.filter((e) => e.k !== String(k));
    delete this.p.tones[String(k)];
    return this;
  }
  tone(k: string | number, t: Tone) {
    if (t === 'none') delete this.p.tones[String(k)];
    else this.p.tones[String(k)] = t;
    return this;
  }
  clearTones() {
    this.p.tones = {};
    return this;
  }
  clearAll() {
    this.p.entries = [];
    this.p.tones = {};
    return this;
  }
  get size() {
    return this.p.entries.length;
  }
}

export class HeapH {
  constructor(private v: Video, public p: HeapPanel, private cmp: (a: Val, b: Val) => number) {}
  get size() {
    return this.p.items.length;
  }
  peek() {
    return this.p.items[0]?.v;
  }
  get values() {
    return this.p.items.map((x) => x.v);
  }
  private sw(i: number, j: number) {
    const it = this.p.items;
    [it[i], it[j]] = [it[j], it[i]];
  }
  /** Push with optional animated sift-up (one silent frame per swap). */
  push(val: Val, animate = false) {
    this.p.items.push({ k: this.v.nextKey(), v: val });
    let i = this.p.items.length - 1;
    if (animate) {
      this.p.tones = { [i]: 'active' };
      this.v.hold(550);
    }
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (this.cmp(this.p.items[i].v, this.p.items[par].v) >= 0) break;
      this.sw(i, par);
      i = par;
      if (animate) {
        this.p.tones = { [i]: 'active' };
        this.v.hold(550);
      }
    }
    this.p.tones = {};
    return this;
  }
  pop(animate = false) {
    const it = this.p.items;
    if (!it.length) return undefined;
    const top = it[0].v;
    const last = it.pop()!;
    if (it.length) {
      it[0] = last;
      let i = 0;
      if (animate) {
        this.p.tones = { 0: 'active' };
        this.v.hold(550);
      }
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let b = i;
        if (l < it.length && this.cmp(it[l].v, it[b].v) < 0) b = l;
        if (r < it.length && this.cmp(it[r].v, it[b].v) < 0) b = r;
        if (b === i) break;
        this.sw(i, b);
        i = b;
        if (animate) {
          this.p.tones = { [i]: 'active' };
          this.v.hold(550);
        }
      }
    }
    this.p.tones = {};
    return top;
  }
  tone(i: number, t: Tone) {
    if (t === 'none') delete this.p.tones[i];
    else this.p.tones[i] = t;
    return this;
  }
  clearTones() {
    this.p.tones = {};
    return this;
  }
}

export class TextH {
  constructor(public p: TextPanel) {}
  lines(lines: string[], shown?: number) {
    this.p.lines = lines;
    this.p.shown = shown;
    return this;
  }
  add(line: string) {
    this.p.lines.push(line);
    this.p.shown = this.p.lines.length;
    return this;
  }
  show(n: number) {
    this.p.shown = n;
    return this;
  }
  next() {
    this.p.shown = Math.min((this.p.shown ?? 0) + 1, this.p.lines.length);
    return this;
  }
  title(t: string, sub?: string) {
    this.p.title = t;
    if (sub !== undefined) this.p.subtitle = sub;
    return this;
  }
  tone(i: number, t: Tone) {
    if (t === 'none') delete this.p.tones![i];
    else this.p.tones![i] = t;
    return this;
  }
  clearTones() {
    this.p.tones = {};
    return this;
  }
}

export class TableH {
  constructor(public p: TablePanel) {}
  rows(rows: string[][]) {
    this.p.rows = rows;
    return this;
  }
  addRow(row: string[]) {
    this.p.rows.push(row);
    return this;
  }
  setCell(r: number, c: number, v: string) {
    this.p.rows[r][c] = v;
    return this;
  }
  tone(r: number, t: Tone) {
    if (t === 'none') delete this.p.tones[r];
    else this.p.tones[r] = t;
    return this;
  }
  cell(r: number, c: number, t: Tone) {
    const k = `${r},${c}`;
    if (t === 'none') delete this.p.cellTones![k];
    else this.p.cellTones![k] = t;
    return this;
  }
  clearTones() {
    this.p.tones = {};
    this.p.cellTones = {};
    return this;
  }
}

export class IntervalsH {
  constructor(public p: IntervalsPanel) {}
  tone(k: number | number[], t: Tone) {
    for (const x of Array.isArray(k) ? k : [k]) {
      if (t === 'none') delete this.p.tones[x];
      else this.p.tones[x] = t;
    }
    return this;
  }
  clearTones() {
    this.p.tones = {};
    return this;
  }
  cursor(x: number | null) {
    this.p.cursor = x;
    return this;
  }
  set(k: number, s: number, e: number, text?: string) {
    const it = this.p.items.find((x) => x.k === k);
    if (it) {
      it.s = s;
      it.e = e;
      it.text = text ?? `[${s},${e}]`;
    }
    return this;
  }
  add(k: number, s: number, e: number, row?: number, text?: string) {
    this.p.items.push({ k, s, e, row: row ?? this.p.items.length, text: text ?? `[${s},${e}]` });
    return this;
  }
  remove(k: number) {
    this.p.items = this.p.items.filter((x) => x.k !== k);
    return this;
  }
  row(k: number, r: number) {
    const it = this.p.items.find((x) => x.k === k);
    if (it) it.row = r;
    return this;
  }
}

export class VarsH {
  constructor(public p: VarsPanel) {}
  set(vars: Record<string, Val>, tone?: Tone) {
    for (const [name, value] of Object.entries(vars)) {
      const s = value === null ? 'null' : String(value);
      const e = this.p.vars.find((x) => x.name === name);
      if (e) {
        e.value = s;
        e.tone = tone;
      } else this.p.vars.push({ name, value: s, tone });
    }
    return this;
  }
  tone(name: string, t: Tone | undefined) {
    const e = this.p.vars.find((x) => x.name === name);
    if (e) e.tone = t;
    return this;
  }
  clearTones() {
    for (const e of this.p.vars) e.tone = undefined;
    return this;
  }
  del(name: string) {
    this.p.vars = this.p.vars.filter((x) => x.name !== name);
    return this;
  }
}

/** Handy for narration: 1 -> "one", 13 -> "thirteen". Falls back to digits. */
export function words(n: number): string {
  const small = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  if (!Number.isInteger(n)) return String(n);
  if (n < 0) return 'minus ' + words(-n);
  if (n < 20) return small[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + small[n % 10] : '');
  return String(n);
}

export type { Item };
