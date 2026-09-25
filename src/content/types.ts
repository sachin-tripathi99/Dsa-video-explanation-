import type { VideoScript } from '../engine/types';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
/** core = everyone must do it, practice = strongly recommended, challenge = stretch goal. */
export type Tier = 'core' | 'practice' | 'challenge';

export interface ProblemRef {
  slug: string; // LeetCode slug, also our id
  title: string;
  lc: number; // LeetCode number
  difficulty: Difficulty;
  tier: Tier;
}

export interface ModuleDef {
  id: string;
  title: string;
  blurb: string;
  /** Section inside a part (e.g. "Trees" inside Patterns). */
  section?: string;
  /** Concept lesson slug. */
  lesson: string;
  lessonTitle: string;
  lessonMinutes: number;
  /** Cues in a problem statement that point to this module's technique. */
  signals?: string[];
  problems: ProblemRef[];
  /** Advanced modules are skipped by the shortest roadmaps. */
  advanced?: boolean;
}

export interface PartDef {
  id: string;
  title: string;
  blurb: string;
  modules: ModuleDef[];
}

/* ---------- judge specs (used by the verifier to run every solution) ---------- */

/**
 * Param / return types, written Java-style and mapped per language by the verifier:
 * int long double boolean String char int[] double[] String[] char[] int[][] char[][] String[][]
 * List<Integer> List<String> List<List<Integer>> List<List<String>> ListNode TreeNode void
 * Special: ListNode@cycle (list built with a cycle, test gives [values, pos]),
 *          TreeNode@ref (a node of the previous TreeNode param, test gives its value),
 *          ListNode@ref (return: compared by index in the input list).
 */
export type JType = string;

export type Cmp =
  | 'exact'
  | 'sorted' // sort the outer list before comparing
  | 'deepSorted' // sort inner lists and the outer list
  | 'float' // numbers within 1e-5
  | 'set' // same elements, any order (flat)
  | { checker: string }; // named checker in scripts/checkers.ts

export interface FnJudge {
  type: 'fn';
  fn: string;
  params: JType[];
  ret: JType;
  tests: { args: unknown[]; out: unknown }[];
  cmp?: Cmp;
  /** For void / in-place problems: compare this argument after the call. */
  inplace?: number;
  /** Return value k means "first k elements of argument `returnK`". */
  returnK?: number;
  /** Random test generator; `ref` computes the expected output (must not mutate its arguments). */
  gen?: (r: Rng) => unknown[];
  ref?: (...args: any[]) => unknown;
  /** How many random tests to generate (default 30). */
  genCount?: number;
}

/** Seeded random helpers handed to judge generators. */
export interface Rng {
  int(lo: number, hi: number): number;
  pick<T>(a: T[]): T;
  ints(n: number, lo: number, hi: number): number[];
  distinct(n: number, lo: number, hi: number): number[];
  shuffle<T>(a: T[]): T[];
  chance(p: number): boolean;
  str(n: number, alphabet: string): string;
}

export interface DesignJudge {
  type: 'design';
  cls: string;
  ctor: JType[];
  methods: Record<string, { params: JType[]; ret: JType }>;
  tests: { ops: string[]; args: unknown[][]; out: unknown[] }[];
  /** Random operation sequences checked against a reference model. */
  gen?: (r: Rng) => { ops: string[]; args: unknown[][] };
  ref?: (ops: string[], args: unknown[][]) => unknown[];
  genCount?: number;
}

export type Judge = FnJudge | DesignJudge;

export type ApproachKind = 'brute' | 'better' | 'optimal';

export interface Approach {
  /** Also the solution file name: solutions/<slug>/<id>.{java,py,cpp} */
  id: string;
  kind: ApproachKind;
  name: string;
  /** How you would think of this approach (markdown). */
  idea: string;
  /** Step-by-step algorithm (markdown list items). */
  steps?: string[];
  time: string;
  space: string;
  /** Why we move on to the next approach. */
  bottleneck?: string;
}

export interface Problem {
  slug: string;
  /** Problem statement in our own words (markdown). */
  statement: string;
  examples: { input: string; output: string; why?: string }[];
  constraints?: string[];
  hints: string[];
  approaches: Approach[];
  /** Pitfalls interviewers look for. */
  pitfalls?: string[];
  /** What this problem teaches that transfers to others. */
  takeaway: string;
  video: () => VideoScript;
  judge?: Judge;
  /** Arguments the video's example uses. The verifier runs every solution on them and checks the video's answer. */
  videoArgs?: unknown[];
}

export interface QuizQ {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Lesson {
  slug: string;
  video: () => VideoScript;
  /** Article in markdown. Consecutive ```java / ```python / ```cpp blocks render as one tabbed block. */
  body: string;
  quiz?: QuizQ[];
}
