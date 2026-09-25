import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PARTS } from '../content/curriculum';
import type { ModuleDef } from '../content/types';
import { useProgress, type Progress } from '../state/store';
import { Bar } from '../components/ui';

export function moduleStats(m: ModuleDef, progress: Progress) {
  const solved = m.problems.filter((p) => progress.solved[p.slug]).length;
  const lesson = !!progress.lessons[m.lesson];
  const total = m.problems.length + 1;
  const done = solved + (lesson ? 1 : 0);
  return { solved, lesson, total, done, complete: done === total };
}

export function LearnPage() {
  const progress = useProgress();
  const loc = useLocation();
  useEffect(() => {
    const id = loc.hash.replace('#', '');
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [loc.hash]);
  let n = 0;
  return (
    <>
      <div className="page-head">
        <div>
          <span className="label">The course</span>
          <h1>Everything, in the order to learn it</h1>
          <p>Each module builds on the ones before it. Watch the concept video, read the notes, then clear the homework. Core problems first; practice and challenge problems when you want more.</p>
        </div>
      </div>
      {PARTS.map((part, pi) => {
        let lastSection: string | undefined;
        return (
          <section key={part.id} id={part.id} className="part" style={{ scrollMarginTop: 80 }}>
            <div className="part-head">
              <div>
                <span className="label">Part {pi + 1}</span>
                <h2>{part.title}</h2>
                <p>{part.blurb}</p>
              </div>
              <div className="mods">
                {part.modules.map((m) => {
                  n++;
                  const s = moduleStats(m, progress);
                  const showSection = m.section && m.section !== lastSection;
                  lastSection = m.section;
                  return (
                    <ModuleCardWithSection key={m.id} m={m} n={n} s={s} section={showSection ? m.section : undefined} />
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

function ModuleCardWithSection({ m, n, s, section }: { m: ModuleDef; n: number; s: ReturnType<typeof moduleStats>; section?: string }) {
  return (
    <>
      {section && <div className="label sec-name">{section}</div>}
      <Link to={`/learn/${m.id}`} className={`mod-card${s.complete ? ' done' : ''}`}>
        <div className="top-line">
          <span className="num">{String(n).padStart(2, '0')}</span>
          {m.advanced && <span className="pill sm challenge">Advanced</span>}
        </div>
        <h3>{m.title}</h3>
        <div className="meta">
          <span>{m.problems.length ? `${s.solved}/${m.problems.length} solved` : s.lesson ? 'Lesson done' : `${m.lessonMinutes} min lesson`}</span>
          <Bar value={s.done} total={s.total} />
        </div>
      </Link>
    </>
  );
}
