/**
 * Study plans from 2 months to 1 year. Plans are generated from the curriculum so
 * they stay in the same chronological order and never drift out of date.
 */
import { MODULES } from './curriculum';
import type { ModuleDef, ProblemRef } from './types';

export interface PlanDef {
  id: string;
  months: number;
  title: string;
  pitch: string;
  who: string;
  include: (m: ModuleDef, p: ProblemRef, idx: number) => boolean;
  includeModule: (m: ModuleDef) => boolean;
  /** Insert a revision week after every N study weeks (0 = none). */
  reviseEvery: number;
  mockWeeks: number;
  daysPerWeek: number;
}

export type PlanItem =
  | { kind: 'lesson'; slug: string; title: string; module: string; hours: number }
  | { kind: 'problem'; slug: string; title: string; module: string; hours: number; ref: ProblemRef }
  | { kind: 'task'; id: string; title: string; detail: string; hours: number };

export interface PlanWeek {
  n: number;
  title: string;
  kind: 'study' | 'revision' | 'mock';
  items: PlanItem[];
  hours: number;
}

const firstPractice = (m: ModuleDef, p: ProblemRef) => m.problems.filter((x) => x.tier === 'practice')[0]?.slug === p.slug;

export const PLANS: PlanDef[] = [
  {
    id: '2-months', months: 2, title: 'Sprint', who: 'Interviews are close and you can study most of the day.',
    pitch: 'Every core lesson and core problem. No detours.',
    includeModule: (m) => !m.advanced,
    include: (_m, p) => p.tier === 'core',
    reviseEvery: 0, mockWeeks: 1, daysPerWeek: 6,
  },
  {
    id: '3-months', months: 3, title: 'Focused', who: 'You have a few hours every day and a target date.',
    pitch: 'Core problems plus the best practice problem in each module.',
    includeModule: (m) => !m.advanced,
    include: (m, p) => p.tier === 'core' || firstPractice(m, p),
    reviseEvery: 6, mockWeeks: 1, daysPerWeek: 6,
  },
  {
    id: '4-months', months: 4, title: 'Steady', who: 'Working or studying, with 2–3 hours a day.',
    pitch: 'All core and practice problems in the main modules.',
    includeModule: (m) => !m.advanced,
    include: (_m, p) => p.tier !== 'challenge',
    reviseEvery: 5, mockWeeks: 2, daysPerWeek: 6,
  },
  {
    id: '5-months', months: 5, title: 'Thorough', who: 'You want to be comfortable, not just ready.',
    pitch: 'Everything in the 4-month plan plus the advanced modules’ core problems.',
    includeModule: () => true,
    include: (m, p) => (m.advanced ? p.tier === 'core' : p.tier !== 'challenge'),
    reviseEvery: 5, mockWeeks: 2, daysPerWeek: 6,
  },
  {
    id: '6-months', months: 6, title: 'Complete', who: 'A calm pace with room for revision.',
    pitch: 'Every lesson, all core and practice problems, and a revision week every month.',
    includeModule: () => true,
    include: (_m, p) => p.tier !== 'challenge',
    reviseEvery: 4, mockWeeks: 2, daysPerWeek: 5,
  },
  {
    id: '12-months', months: 12, title: 'Mastery', who: 'Starting from zero, alongside college or a job.',
    pitch: 'The whole course, every challenge problem, regular revision and a month of mock interviews.',
    includeModule: () => true,
    include: () => true,
    reviseEvery: 4, mockWeeks: 4, daysPerWeek: 5,
  },
];

const PROBLEM_HOURS = { Easy: 0.75, Medium: 1.25, Hard: 2 } as const;
const lessonHours = (m: ModuleDef) => Math.max(0.75, Math.round(((m.lessonMinutes * 2.6) / 60) * 4) / 4);

export function planItems(plan: PlanDef): PlanItem[] {
  const items: PlanItem[] = [];
  for (const m of MODULES) {
    if (!plan.includeModule(m)) continue;
    items.push({ kind: 'lesson', slug: m.lesson, title: m.lessonTitle, module: m.id, hours: lessonHours(m) });
    m.problems.forEach((p, i) => {
      if (plan.include(m, p, i)) items.push({ kind: 'problem', slug: p.slug, title: p.title, module: m.id, hours: PROBLEM_HOURS[p.difficulty], ref: p });
    });
  }
  return items;
}

const moduleTitle = new Map(MODULES.map((m) => [m.id, m.title]));

export function buildPlan(plan: PlanDef): { weeks: PlanWeek[]; totalHours: number; hoursPerDay: number; problemCount: number; lessonCount: number } {
  const items = planItems(plan);
  const totalWeeks = Math.round(plan.months * 4.345);
  const studyHours = items.reduce((a, i) => a + i.hours, 0);
  // Number of revision weeks that will be interleaved.
  let revision = 0;
  if (plan.reviseEvery > 0) {
    const approxStudy = totalWeeks - plan.mockWeeks;
    revision = Math.floor(approxStudy / (plan.reviseEvery + 1));
  }
  const studyWeeks = Math.max(1, totalWeeks - plan.mockWeeks - revision);
  const perWeek = studyHours / studyWeeks;

  // Split items into study weeks by cumulative hours, keeping order.
  const chunks: PlanItem[][] = Array.from({ length: studyWeeks }, () => []);
  let acc = 0;
  for (const it of items) {
    const w = Math.min(studyWeeks - 1, Math.floor((acc + it.hours / 2) / perWeek));
    chunks[w].push(it);
    acc += it.hours;
  }

  const weeks: PlanWeek[] = [];
  let sinceRevision: PlanWeek[] = [];
  const pushWeek = (w: Omit<PlanWeek, 'n'>) => weeks.push({ ...w, n: weeks.length + 1 });
  chunks.forEach((c) => {
    const mods = [...new Set(c.map((i) => ('module' in i ? i.module : '')).filter(Boolean))].map((m) => moduleTitle.get(m)!);
    const wk: Omit<PlanWeek, 'n'> = { kind: 'study', title: mods.length ? mods.join(' · ') : 'Catch-up', items: c, hours: c.reduce((a, i) => a + i.hours, 0) };
    pushWeek(wk);
    sinceRevision.push(weeks[weeks.length - 1]);
    if (plan.reviseEvery > 0 && sinceRevision.length === plan.reviseEvery && weeks.filter((x) => x.kind === 'revision').length < revision) {
      const from = sinceRevision[0].n;
      const to = sinceRevision[sinceRevision.length - 1].n;
      const topics = [...new Set(sinceRevision.flatMap((x) => x.items.map((i) => ('module' in i ? moduleTitle.get(i.module)! : ''))).filter(Boolean))];
      pushWeek({
        kind: 'revision',
        title: `Revision: weeks ${from}–${to}`,
        hours: Math.round(perWeek),
        items: [
          { kind: 'task', id: `rev-${plan.id}-${from}-a`, title: 'Re-solve every problem you marked with a star or struggled with', detail: 'No peeking. Time yourself: 20 minutes for Medium.', hours: perWeek * 0.4 },
          { kind: 'task', id: `rev-${plan.id}-${from}-b`, title: `Rewatch the concept videos: ${topics.slice(0, 4).join(', ')}${topics.length > 4 ? '…' : ''}`, detail: 'At 1.25× speed. Write the pattern template from memory afterwards.', hours: perWeek * 0.3 },
          { kind: 'task', id: `rev-${plan.id}-${from}-c`, title: 'Do 5 random problems from these modules without looking at the pattern name', detail: 'Practise recognising the pattern from the statement alone.', hours: perWeek * 0.3 },
        ],
      });
      sinceRevision = [];
    }
  });
  for (let i = 0; i < plan.mockWeeks; i++) {
    pushWeek({
      kind: 'mock',
      title: i === plan.mockWeeks - 1 ? 'Final mock interviews' : 'Mock interviews and weak spots',
      hours: Math.round(perWeek),
      items: [
        { kind: 'task', id: `mock-${plan.id}-${i}-a`, title: 'Three timed mock interviews (45 minutes, 2 problems each)', detail: 'Explain out loud, brute force first, then optimise. Record yourself if you can.', hours: perWeek * 0.45 },
        { kind: 'task', id: `mock-${plan.id}-${i}-b`, title: 'Review your two weakest modules', detail: 'Use the progress page to find modules with the lowest completion.', hours: perWeek * 0.35 },
        { kind: 'task', id: `mock-${plan.id}-${i}-c`, title: 'Read the pattern cheat sheet and redo one problem per pattern', detail: 'Focus on recognising signals quickly.', hours: perWeek * 0.2 },
      ],
    });
  }
  return {
    weeks,
    totalHours: Math.round(studyHours + (revision + plan.mockWeeks) * perWeek),
    hoursPerDay: Math.round((perWeek / plan.daysPerWeek) * 2) / 2,
    problemCount: items.filter((i) => i.kind === 'problem').length,
    lessonCount: items.filter((i) => i.kind === 'lesson').length,
  };
}

export const planById = (id: string) => PLANS.find((p) => p.id === id);
