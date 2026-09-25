/** Lazy loaders for lesson and problem content and solution source files. */
import type { Lesson, Problem } from './types';
import type { Lang } from '../state/store';

const lessonLoaders = import.meta.glob<{ default: Lesson }>('./lessons/**/*.ts');
const problemLoaders = import.meta.glob<{ default: Problem }>('./problems/**/*.ts');
const solutionLoaders = import.meta.glob<string>('/solutions/**/*.{java,py,cpp}', { query: '?raw', import: 'default' });

const base = (p: string) => p.slice(p.lastIndexOf('/') + 1).replace(/\.ts$/, '');
const lessonMap = new Map(Object.entries(lessonLoaders).map(([p, l]) => [base(p), l]));
const problemMap = new Map(Object.entries(problemLoaders).map(([p, l]) => [base(p), l]));

export const hasLesson = (slug: string) => lessonMap.has(slug);
export const hasProblem = (slug: string) => problemMap.has(slug);
export const availableProblems = () => new Set(problemMap.keys());
export const availableLessons = () => new Set(lessonMap.keys());

export async function loadLesson(slug: string): Promise<Lesson | null> {
  const l = lessonMap.get(slug);
  return l ? (await l()).default : null;
}
export async function loadProblem(slug: string): Promise<Problem | null> {
  const l = problemMap.get(slug);
  return l ? (await l()).default : null;
}

const EXT: Record<Lang, string> = { java: 'java', python: 'py', cpp: 'cpp' };
export async function loadSolution(slug: string, approach: string, lang: Lang): Promise<string | null> {
  const l = solutionLoaders[`/solutions/${slug}/${approach}.${EXT[lang]}`];
  return l ? (await l()).trimEnd() : null;
}
