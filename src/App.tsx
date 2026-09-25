import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './components/ui';
import { MODULES, PROBLEMS } from './content/curriculum';
import { setPref, usePrefs, useProgress } from './state/store';
import { HomePage } from './pages/Home';
import { LearnPage } from './pages/Learn';
import { ModulePage } from './pages/Module';
import { LessonPage } from './pages/Lesson';
import { ProblemPage } from './pages/Problem';
import { RoadmapsPage, RoadmapPage } from './pages/Roadmaps';
import { CheatSheetPage } from './pages/CheatSheet';
import { ProgressPage } from './pages/Progress';

export function App() {
  const loc = useLocation();
  const prefs = usePrefs();
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenu(false);
  }, [loc.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (prefs.theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', prefs.theme);
  }, [prefs.theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch(true);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cycleTheme = () => setPref('theme', prefs.theme === 'system' ? 'dark' : prefs.theme === 'dark' ? 'light' : 'system');

  return (
    <>
      <header className="top">
        <div className="wrap">
          <Link className="brand" to="/" aria-label="DryRun home">
            <Logo />
            DryRun
          </Link>
          <nav className={`nav${menu ? ' open' : ''}`} aria-label="Main">
            <NavLink to="/learn">Course</NavLink>
            <NavLink to="/roadmaps">Roadmaps</NavLink>
            <NavLink to="/cheatsheet">Pattern finder</NavLink>
            <NavLink to="/progress">Progress</NavLink>
          </nav>
          <div className="top-right">
            <button className="search-btn" onClick={() => setSearch(true)} aria-label="Search">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="M11 11l3.5 3.5" /></svg>
              <span>Search lessons and problems</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button className="icon-btn" onClick={cycleTheme} aria-label={`Theme: ${prefs.theme}`} title={`Theme: ${prefs.theme}`}>
              {prefs.theme === 'dark' ? (
                <svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8z" /></svg>
              ) : prefs.theme === 'light' ? (
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="8" cy="8" r="3" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="1.5" y="2.5" width="13" height="9" rx="1.5" /><path d="M5 14.5h6" /></svg>
              )}
            </button>
            <button className="icon-btn menu-btn" onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 4h12M2 8h12M2 12h12" /></svg>
            </button>
          </div>
        </div>
      </header>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:moduleId" element={<ModulePage />} />
          <Route path="/lesson/:slug" element={<LessonPage />} />
          <Route path="/problem/:slug" element={<ProblemPage />} />
          <Route path="/roadmaps" element={<RoadmapsPage />} />
          <Route path="/roadmaps/:planId" element={<RoadmapPage />} />
          <Route path="/cheatsheet" element={<CheatSheetPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site">
        <div className="wrap">
          <span>DryRun · learn DSA one pattern at a time</span>
          <span>Your progress is saved in this browser only.</span>
        </div>
      </footer>
      {search && <SearchDialog onClose={() => setSearch(false)} />}
    </>
  );
}

function NotFound() {
  return (
    <div className="empty" style={{ marginTop: 40 }}>
      <h2 style={{ marginBottom: 8 }}>That page doesn’t exist</h2>
      <p>
        Head back to the <Link to="/learn">course</Link>.
      </p>
    </div>
  );
}

type Hit = { to: string; title: string; sub: string; tag: string };

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const nav = useNavigate();
  const progress = useProgress();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);
  const all: Hit[] = useMemo(
    () => [
      ...MODULES.map((m) => ({ to: `/learn/${m.id}`, title: m.title, sub: m.blurb, tag: 'Module' })),
      ...MODULES.map((m) => ({ to: `/lesson/${m.lesson}`, title: m.lessonTitle, sub: `Concept video · ${m.title}`, tag: 'Lesson' })),
      ...PROBLEMS.map((p) => ({ to: `/problem/${p.slug}`, title: `${p.lc}. ${p.title}`, sub: `${p.difficulty} · ${MODULES.find((m) => m.id === p.module)?.title}`, tag: progress.solved[p.slug] ? 'Solved' : 'Problem' })),
    ],
    [progress.solved],
  );
  const hits = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return all.filter((h) => h.tag === 'Module').slice(0, 12);
    return all
      .map((h) => {
        const hay = `${h.title} ${h.sub}`.toLowerCase();
        if (!terms.every((t) => hay.includes(t))) return null;
        const score = (h.title.toLowerCase().startsWith(terms[0]) ? 0 : 1) + (h.tag === 'Module' ? 0 : 0.5);
        return { h, score };
      })
      .filter((x): x is { h: Hit; score: number } => !!x)
      .sort((a, b) => a.score - b.score)
      .slice(0, 30)
      .map((x) => x.h);
  }, [q, all]);
  useEffect(() => setSel(0), [q]);
  const go = (h: Hit) => {
    nav(h.to);
    onClose();
  };
  return (
    <div className="search-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-panel" role="dialog" aria-label="Search">
        <input
          ref={inputRef}
          id="search-input"
          placeholder="Search: “sliding window”, “binary tree”, “two sum”…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSel((s) => Math.min(s + 1, hits.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSel((s) => Math.max(s - 1, 0));
            } else if (e.key === 'Enter' && hits[sel]) go(hits[sel]);
          }}
        />
        <ul className="search-results">
          {hits.map((h, i) => (
            <li key={h.to} className={i === sel ? 'sel' : ''}>
              <a href={`#${h.to}`} onClick={(e) => { e.preventDefault(); go(h); }}>
                <span>
                  {h.title}
                  <small>{h.sub}</small>
                </span>
                <span className="pill sm">{h.tag}</span>
              </a>
            </li>
          ))}
          {!hits.length && <li className="muted" style={{ padding: 14 }}>Nothing matches “{q}”.</li>}
        </ul>
      </div>
    </div>
  );
}
