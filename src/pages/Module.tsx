import { Link, useParams } from 'react-router-dom';
import { MODULES, moduleById, partOfModule } from '../content/curriculum';
import type { Tier } from '../content/types';
import { markSolved, useProgress } from '../state/store';
import { Bar, Check, DiffPill, lcUrl, TierPill } from '../components/ui';
import { moduleStats } from './Learn';

const TIER_TEXT: Record<Tier, { title: string; sub: string }> = {
  core: { title: 'Core homework', sub: 'Everyone should solve these. Each one teaches a piece of the pattern.' },
  practice: { title: 'Practice', sub: 'Same ideas with a twist. Do these to make the pattern automatic.' },
  challenge: { title: 'Challenge', sub: 'Harder combinations. Great for the longer roadmaps.' },
};

export function ModulePage() {
  const { moduleId = '' } = useParams();
  const m = moduleById(moduleId);
  const progress = useProgress();
  if (!m) return <div className="empty">That module doesn’t exist. <Link to="/learn">Back to the course</Link></div>;
  const part = partOfModule(m.id)!;
  const idx = MODULES.indexOf(m);
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];
  const s = moduleStats(m, progress);
  let counter = 0;
  return (
    <>
      <div className="crumbs">
        <Link to="/learn">Course</Link> › <Link to={`/learn#${part.id}`}>{part.title}</Link>
        {m.section && <> › <span>{m.section}</span></>}
      </div>
      <div className="page-head">
        <div>
          <span className="label">Module {idx + 1} of {MODULES.length}</span>
          <h1>{m.title}</h1>
          <p>{m.blurb}</p>
        </div>
        <div style={{ minWidth: 200 }}>
          <div className="label" style={{ marginBottom: 6 }}>{s.done} of {s.total} done</div>
          <Bar value={s.done} total={s.total} />
        </div>
      </div>
      <div className="module-layout">
        <div>
          <Link to={`/lesson/${m.lesson}`} className="lesson-card">
            <div className="thumb"><span><svg width="16" height="16" viewBox="0 0 16 16"><path d="M3.5 1.8v12.4L14 8z" fill="currentColor" /></svg></span></div>
            <div>
              <span className="label">Concept lesson · {m.lessonMinutes} min{progress.lessons[m.lesson] ? ' · done' : ''}</span>
              <h3 style={{ marginTop: 4 }}>{m.lessonTitle}</h3>
              <p>Animated explanation, notes with code templates in Java, Python and C++, and a short quiz.</p>
            </div>
          </Link>

          {m.problems.length > 0 &&
            (['core', 'practice', 'challenge'] as Tier[]).map((tier) => {
              const list = m.problems.filter((p) => p.tier === tier);
              if (!list.length) return null;
              return (
                <div key={tier}>
                  <div className="tier-head">
                    <TierPill t={tier} />
                    <div>
                      <h3>{TIER_TEXT[tier].title}</h3>
                      <p>{TIER_TEXT[tier].sub}</p>
                    </div>
                  </div>
                  <ol className="plist">
                    {list.map((p) => {
                      counter++;
                      const solved = !!progress.solved[p.slug];
                      return (
                        <li key={p.slug} className={solved ? 'solved' : ''}>
                          <Check on={solved} onClick={() => markSolved(p.slug)} label={solved ? `Mark ${p.title} unsolved` : `Mark ${p.title} solved`} />
                          <span className="n">{counter}</span>
                          <div>
                            <Link className="t" to={`/problem/${p.slug}`}>{p.title}</Link>
                            <div className="sub">
                              <span>#{p.lc}</span>
                              <DiffPill d={p.difficulty} sm />
                              {progress.watched[`problem-${p.slug}`] && <span>· video watched</span>}
                            </div>
                          </div>
                          <div className="right">
                            <a className="lc-link" href={lcUrl(p.slug)} target="_blank" rel="noopener noreferrer">LeetCode ↗</a>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}
        </div>
        <aside className="side">
          {m.signals && (
            <div className="card">
              <span className="label">Reach for this when you see</span>
              <ul className="signals" style={{ marginTop: 12 }}>
                {m.signals.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          )}
          <div className="card">
            <span className="label">In this module</span>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ink-2)' }}>
              1 concept lesson and {m.problems.length} problems: {m.problems.filter((p) => p.tier === 'core').length} core, {m.problems.filter((p) => p.tier === 'practice').length} practice, {m.problems.filter((p) => p.tier === 'challenge').length} challenge.
            </p>
          </div>
        </aside>
      </div>
      <div className="prevnext">
        {prev ? <Link to={`/learn/${prev.id}`}><small>← Previous module</small>{prev.title}</Link> : <span />}
        {next && <Link className="next" to={`/learn/${next.id}`}><small>Next module →</small>{next.title}</Link>}
      </div>
    </>
  );
}
