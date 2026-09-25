/**
 * Local-only persistence. Everything lives in this browser's localStorage;
 * reads and writes are wrapped so private windows and blocked storage still work.
 */
import { useSyncExternalStore } from 'react';

export type Lang = 'java' | 'python' | 'cpp';

export interface Progress {
  solved: Record<string, number>;
  watched: Record<string, number>;
  lessons: Record<string, number>;
  quiz: Record<string, { score: number; total: number; at: number }>;
  notes: Record<string, string>;
  bookmarks: Record<string, number>;
  videoPos: Record<string, number>;
  roadmap: { id: string; start: string } | null;
  roadmapDone: Record<string, number>;
}

export interface Prefs {
  narration: boolean;
  voice: string | null;
  rate: number;
  captions: boolean;
  lang: Lang;
  theme: 'system' | 'light' | 'dark';
}

const PKEY = 'dryrun.progress.v1';
const FKEY = 'dryrun.prefs.v1';

const emptyProgress = (): Progress => ({
  solved: {}, watched: {}, lessons: {}, quiz: {}, notes: {}, bookmarks: {}, videoPos: {}, roadmap: null, roadmapDone: {},
});
const defaultPrefs = (): Prefs => ({ narration: true, voice: null, rate: 1, captions: true, lang: 'java', theme: 'system' });

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: keep in memory only */
  }
}

function createStore<T>(key: string, init: () => T) {
  let state: T = typeof window === 'undefined' ? init() : read(key, init());
  const subs = new Set<() => void>();
  return {
    get: () => state,
    set(update: (s: T) => T) {
      state = update(state);
      write(key, state);
      subs.forEach((f) => f());
    },
    replace(next: T) {
      state = next;
      write(key, state);
      subs.forEach((f) => f());
    },
    subscribe(f: () => void) {
      subs.add(f);
      return () => subs.delete(f);
    },
    reset() {
      state = init();
      write(key, state);
      subs.forEach((f) => f());
    },
  };
}

export const progressStore = createStore<Progress>(PKEY, emptyProgress);
export const prefsStore = createStore<Prefs>(FKEY, defaultPrefs);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === PKEY) progressStore.replace(read(PKEY, emptyProgress()));
    if (e.key === FKEY) prefsStore.replace(read(FKEY, defaultPrefs()));
  });
}

export function useProgress() {
  return useSyncExternalStore(progressStore.subscribe, progressStore.get, progressStore.get);
}
export function usePrefs() {
  return useSyncExternalStore(prefsStore.subscribe, prefsStore.get, prefsStore.get);
}
export function setPref<K extends keyof Prefs>(k: K, v: Prefs[K]) {
  prefsStore.set((s) => ({ ...s, [k]: v }));
}

const toggle = (field: 'solved' | 'watched' | 'lessons' | 'bookmarks' | 'roadmapDone') => (id: string, on?: boolean) =>
  progressStore.set((s) => {
    const m = { ...s[field] };
    const want = on ?? !m[id];
    if (want) m[id] = Date.now();
    else delete m[id];
    return { ...s, [field]: m };
  });

export const markSolved = toggle('solved');
export const markWatched = toggle('watched');
export const markLesson = toggle('lessons');
export const toggleBookmark = toggle('bookmarks');
export const markRoadmapItem = toggle('roadmapDone');

export function saveQuiz(id: string, score: number, total: number) {
  progressStore.set((s) => ({ ...s, quiz: { ...s.quiz, [id]: { score, total, at: Date.now() } } }));
}
export function saveNote(id: string, text: string) {
  progressStore.set((s) => {
    const notes = { ...s.notes };
    if (text.trim()) notes[id] = text;
    else delete notes[id];
    return { ...s, notes };
  });
}
export function saveVideoPos(id: string, frame: number) {
  progressStore.set((s) => ({ ...s, videoPos: { ...s.videoPos, [id]: frame } }));
}
export function setRoadmap(r: Progress['roadmap']) {
  progressStore.set((s) => ({ ...s, roadmap: r }));
}
export function exportProgress() {
  return JSON.stringify({ version: 1, progress: progressStore.get(), prefs: prefsStore.get() }, null, 2);
}
export function importProgress(json: string) {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object' || !data.progress) throw new Error('This file is not a DryRun progress export.');
  progressStore.replace({ ...emptyProgress(), ...data.progress });
  if (data.prefs) prefsStore.replace({ ...defaultPrefs(), ...data.prefs });
}
