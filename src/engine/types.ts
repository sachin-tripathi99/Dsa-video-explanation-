/**
 * Frame model for DryRun explainer videos.
 *
 * A video is a list of frames. Each frame is a full snapshot of what is on
 * screen plus the narration for that moment. The player animates between
 * consecutive snapshots, so authors only describe states, never tweens.
 * Everything here is plain JSON so videos can be generated and checked in Node.
 */

export type Tone =
  | 'none'
  | 'active' // the element we are looking at right now
  | 'cmp' // being compared
  | 'ok' // correct / found / part of the answer
  | 'bad' // rejected / wrong
  | 'warn' // needs attention
  | 'done' // processed, settled
  | 'dim' // ruled out
  | 'out' // outside the current search range
  | 'visit' // visited (graphs, trees)
  | 'path' // on the current path / recursion stack
  | 'win' // inside the current window
  | 'pivot' // pivot / special element
  | 'sorted'; // in final sorted position

export type ChapterKind = 'intro' | 'concept' | 'brute' | 'better' | 'optimal' | 'recap';

export interface Chapter {
  id: string;
  title: string;
  kind: ChapterKind;
  /** Time complexity badge shown in the stage header, e.g. "O(n log n)". */
  cx?: string;
  /** Pseudocode shown next to the visuals for this chapter. */
  code?: string[];
}

export interface Ptr {
  name: string;
  at: number;
  /** 1 = accent, 2 = purple, 3 = muted, 4 = amber, 5 = green */
  color?: 1 | 2 | 3 | 4 | 5;
}

export interface Item {
  /** Stable key so values can move (swaps, inserts) with animation. */
  k: number;
  v: string | number | null;
}

export interface ArrayPanel {
  kind: 'array';
  id: string;
  label?: string;
  items: Item[];
  tones: Record<number, Tone>;
  ptrs: Ptr[];
  /** Highlighted window / range [l, r] inclusive. */
  win?: { l: number; r: number; tone?: Tone; label?: string } | null;
  /** Small text under each cell (e.g. prefix sums, counts). */
  sub?: Record<number, string>;
  /** Small text above a cell (e.g. "swap"). */
  tags?: Record<number, string>;
  showIdx?: boolean;
  /** Draw as bars proportional to value (used for sorting / histograms). */
  bars?: boolean;
}

export interface GridPanel {
  kind: 'grid';
  id: string;
  label?: string;
  cells: (string | number | null)[][];
  tones: Record<string, Tone>; // key "r,c"
  rowHead?: string[];
  colHead?: string[];
  ptrs?: { name: string; r: number; c: number; color?: Ptr['color'] }[];
  /** Arrows between cells, e.g. DP dependencies. */
  arrows?: { from: [number, number]; to: [number, number]; tone?: Tone }[];
  cellSize?: number;
}

export interface ListNodeView {
  id: string;
  v: string | number;
}

export interface ListPanel {
  kind: 'list';
  id: string;
  label?: string;
  /** Display order, left to right. */
  nodes: ListNodeView[];
  /** next pointer of each node id (null = points to null). */
  next: Record<string, string | null>;
  tones: Record<string, Tone>;
  ptrs: { name: string; node: string | null; color?: Ptr['color'] }[];
  /** Show a "null" terminator box. */
  showNull?: boolean;
  /** Two rows (used for merge of two lists). */
  row?: Record<string, number>;
  /** Tighter rows for multi-row scenes without backward arcs. */
  compact?: boolean;
}

export interface TreeNodeView {
  v: string | number;
  kids: (string | null)[]; // binary trees use [left, right]; n-ary uses any length
}

export interface TreePanel {
  kind: 'tree';
  id: string;
  label?: string;
  nodes: Record<string, TreeNodeView>;
  roots: string[];
  tones: Record<string, Tone>;
  edgeTones: Record<string, Tone>; // key "parent>child"
  badges: Record<string, string>; // small text next to a node
  edgeLabels?: Record<string, string>; // for tries
  ptrs: { name: string; node: string; color?: Ptr['color'] }[];
  binary?: boolean;
}

export interface GraphNodeView {
  id: string;
  label: string;
  x: number; // 0..100
  y: number; // 0..100
}

export interface GraphPanel {
  kind: 'graph';
  id: string;
  label?: string;
  nodes: GraphNodeView[];
  edges: { a: string; b: string; w?: number | string }[];
  directed?: boolean;
  tones: Record<string, Tone>;
  edgeTones: Record<string, Tone>; // key "a>b" (also matches b>a when undirected)
  badges: Record<string, string>;
}

export interface StackPanel {
  kind: 'stack' | 'queue';
  id: string;
  label?: string;
  items: Item[];
  tones: Record<number, Tone>; // by position
  /** Labels for the ends, e.g. top / front / back. */
  ends?: [string, string];
}

export interface MapPanel {
  kind: 'map';
  id: string;
  label?: string;
  entries: { k: string; v: string }[];
  tones: Record<string, Tone>; // by key
  set?: boolean; // show keys only
}

export interface HeapPanel {
  kind: 'heap';
  id: string;
  label?: string;
  items: Item[];
  tones: Record<number, Tone>; // by position
  /** Hide the array view under the tree. */
  treeOnly?: boolean;
}

export interface ChartPanel {
  kind: 'chart';
  id: string;
  label?: string;
  /** Known curve names: 1, logn, n, nlogn, n2, n3, 2n, nfact, sqrtn */
  curves: { f: string; tone?: Tone; label?: string }[];
  xMax: number;
  yMax: number;
  marker?: number; // vertical line at x
  highlight?: string; // curve to emphasise
}

export interface BarsPanel {
  kind: 'bars';
  id: string;
  label?: string;
  bars: { label: string; value: number; tone?: Tone; text?: string }[];
  log?: boolean;
}

export interface TextPanel {
  kind: 'text';
  id: string;
  title?: string;
  subtitle?: string;
  lines: string[];
  /** Number of lines revealed; defaults to all. */
  shown?: number;
  big?: boolean;
  mono?: boolean;
  tones?: Record<number, Tone>;
}

export interface TablePanel {
  kind: 'table';
  id: string;
  label?: string;
  head: string[];
  rows: string[][];
  tones: Record<number, Tone>; // by row
  cellTones?: Record<string, Tone>; // "r,c"
}

export interface BitsPanel {
  kind: 'bits';
  id: string;
  label?: string;
  rows: { label: string; bits: string; tones?: Record<number, Tone>; note?: string }[];
}

export interface IntervalsPanel {
  kind: 'intervals';
  id: string;
  label?: string;
  items: { k: number; s: number; e: number; text?: string; row?: number }[];
  tones: Record<number, Tone>; // by key
  min: number;
  max: number;
  cursor?: number | null;
}

export interface VarsPanel {
  kind: 'vars';
  id: string;
  label?: string;
  vars: { name: string; value: string; tone?: Tone }[];
}

export type Panel =
  | ArrayPanel
  | GridPanel
  | ListPanel
  | TreePanel
  | GraphPanel
  | StackPanel
  | MapPanel
  | HeapPanel
  | ChartPanel
  | BarsPanel
  | TextPanel
  | TablePanel
  | BitsPanel
  | IntervalsPanel
  | VarsPanel;

export interface Frame {
  /** Index into VideoScript.chapters. */
  ch: number;
  /** Narration. Empty string = silent frame that holds for `hold` ms. */
  say: string;
  hold: number;
  panels: Panel[];
  /** How panels share the visual area. */
  layout: 'col' | 'row' | 'grid';
  /** Highlighted pseudocode lines (0-based) for the current chapter. */
  line: number[];
  /** Short equation / status line under the visuals. */
  eq: string;
  eqTone: 'none' | 'ok' | 'bad' | 'warn';
  /** Handwritten side note. */
  note: string;
  /** Counter chip in the header, e.g. "checks: 13". */
  counter: string;
}

export interface VideoScript {
  id: string;
  title: string;
  chapters: Chapter[];
  frames: Frame[];
  /** Final answer the video arrives at (checked by the verifier). */
  answer?: unknown;
}
