import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { moduleOfProblem, partOfModule, problemRef } from '../content/curriculum';
import { loadProblem, loadSolution } from '../content/registry';
import type { Approach, Problem } from '../content/types';
import { Player } from '../engine/Player';
import { Markdown, MdInline } from '../components/Markdown';
import { CodeTabs } from '../components/Code';
import { markSolved, saveNote, toggleBookmark, useProgress, type Lang } from '../state/store';
import { Check, DiffPill, lcUrl, TierPill } from '../components/ui';
import { PrevNext, useLoaded } from './Lesson';

export function ProblemPage() {
  const { slug = '' } = useParams();
  const ref = problemRef(slug);
  const m = moduleOfProblem(slug);
  const progress = useProgress();
  const { data: problem, loading, error } = useLoaded(() => loadProblem(slug), slug);
  if (!ref || !m) return <div className="empty">That problem isn’t in the course. <Link to="/learn">Back to the course</Link></div>;
  const part = partOfModule(m.id)!;
  const solved = !!progress.solved[slug];
  const pos = m.problems.findIndex((p) => p.slug === slug) + 1;
  return (
    <>
      <div className="crumbs">
        <Link to="/learn">Course</Link> › <Link to={`/learn#${part.id}`}>{part.title}</Link> › <Link to={`/learn/${m.id}`}>{m.title}</Link> › <span>Problem {pos} of {m.problems.length}</span>
      </div>
      <div className="lesson-head">
        <div>
          <h1>{ref.title}</h1>
          <div className="meta">
            <span className="pill">LeetCode {ref.lc}</span>
            <DiffPill d={ref.difficulty} />
            <TierPill t={ref.tier} />
            <span className="pill">Pattern: {m.title}</span>
          </div>
        </div>
        <div className="head-actions">
          <a className="btn" href={lcUrl(slug)} target="_blank" rel="noopener noreferrer">Solve on LeetCode ↗</a>
          <button className="btn" aria-pressed={solved} onClick={() => markSolved(slug)}>{solved ? '✓ Solved' : 'Mark solved'}</button>
          <button className="btn" aria-pressed={!!progress.bookmarks[slug]} onClick={() => toggleBookmark(slug)} title="Star for revision">{progress.bookmarks[slug] ? '★ Starred' : '☆ Star'}</button>
        </div>
      </div>
      <div className="layout-2">
        <div>
          {loading && <div className="loading">Loading problem…</div>}
          {error && <div className="empty">Couldn’t load this problem: {error}</div>}
          {!loading && !error && !problem && (
            <div className="empty">
              The walkthrough for this problem is being written. You can still <a href={lcUrl(slug)} target="_blank" rel="noopener noreferrer">solve it on LeetCode</a>.
            </div>
          )}
          {problem && <ProblemBody problem={problem} />}
          <PrevNext type="problem" slug={slug} />
        </div>
        <aside className="side">
          <div className="card">
            <span className="label">{m.title} · homework</span>
            <ul className="side-list">
              {m.problems.map((p) => (
                <li key={p.slug} className={p.slug === slug ? 'here' : ''}>
                  <Check on={!!progress.solved[p.slug]} onClick={() => markSolved(p.slug)} label={`Solved ${p.title}`} />
                  <Link to={`/problem/${p.slug}`}>{p.title}</Link>
                  <DiffPill d={p.difficulty} sm />
                </li>
              ))}
            </ul>
          </div>
          <div className="card notes">
            <label className="label" htmlFor={`note-${slug}`}>Your notes</label>
            <NoteBox slug={slug} initial={progress.notes[slug] ?? ''} />
          </div>
        </aside>
      </div>
    </>
  );
}

function NoteBox({ slug, initial }: { slug: string; initial: string }) {
  const [v, setV] = useState(initial);
  useEffect(() => setV(initial), [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = setTimeout(() => saveNote(slug, v), 400);
    return () => clearTimeout(t);
  }, [v, slug]);
  return <textarea id={`note-${slug}`} value={v} onChange={(e) => setV(e.target.value)} placeholder="Key insight, the bug you hit, what to remember next time…" style={{ marginTop: 8 }} />;
}

function ProblemBody({ problem }: { problem: Problem }) {
  const script = useMemo(() => ({ ...problem.video(), id: `problem-${problem.slug}` }), [problem]);
  const optimal = problem.approaches.find((a) => a.kind === 'optimal') ?? problem.approaches[problem.approaches.length - 1];
  const [ap, setAp] = useState<string>(optimal.id);
  useEffect(() => setAp(optimal.id), [problem.slug]); // eslint-disable-line react-hooks/exhaustive-deps
  const approach = problem.approaches.find((a) => a.id === ap) ?? optimal;
  return (
    <>
      <section>
        <Markdown src={problem.statement} className="prose statement" />
        <div className="examples">
          {problem.examples.map((e, i) => (
            <div className="example" key={i}>
              <div className="row"><b>Input</b><code>{e.input}</code></div>
              <div className="row"><b>Output</b><code>{e.output}</code></div>
              {e.why && <div className="why"><MdInline src={e.why} /></div>}
            </div>
          ))}
        </div>
        {problem.constraints && (
          <ul className="constraints">
            {problem.constraints.map((c) => <li key={c}><MdInline src={c} /></li>)}
          </ul>
        )}
      </section>

      {problem.hints.length > 0 && (
        <section className="block">
          <h2>Stuck? Hints, one at a time</h2>
          <div className="hints">
            {problem.hints.map((h, i) => (
              <details className="hint" key={i}>
                <summary>Hint {i + 1}</summary>
                <p><MdInline src={h} /></p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="block">
        <h2>Video walkthrough</h2>
        <Player script={script} />
      </section>

      <section className="block">
        <h2>From brute force to optimal</h2>
        <div className="approaches">
          {problem.approaches.map((a, i) => (
            <button key={a.id} className={`ap ${a.kind}`} aria-pressed={a.id === ap} onClick={() => setAp(a.id)}>
              <h3>{i + 1} · {a.name}</h3>
              <span className="cxs">Time {a.time} · Space {a.space}</span>
            </button>
          ))}
        </div>
        <ApproachDetail slug={problem.slug} a={approach} />
      </section>

      {problem.pitfalls && problem.pitfalls.length > 0 && (
        <section className="block">
          <h2>Mistakes to avoid</h2>
          <ul className="pitfalls prose">
            {problem.pitfalls.map((p) => <li key={p}><MdInline src={p} /></li>)}
          </ul>
        </section>
      )}

      <section className="block">
        <div className="takeaway">
          <span className="label">Takeaway</span>
          <p><MdInline src={problem.takeaway} /></p>
        </div>
      </section>
    </>
  );
}

function ApproachDetail({ slug, a }: { slug: string; a: Approach }) {
  const [code, setCode] = useState<Partial<Record<Lang, string | null>>>({});
  useEffect(() => {
    let alive = true;
    setCode({});
    Promise.all((['java', 'python', 'cpp'] as Lang[]).map((l) => loadSolution(slug, a.id, l))).then(([java, python, cpp]) => {
      if (alive) setCode({ java, python, cpp });
    });
    return () => {
      alive = false;
    };
  }, [slug, a.id]);
  return (
    <div className="approach-detail">
      <h3>{a.name}</h3>
      <Markdown src={a.idea} />
      {a.steps && (
        <ol>
          {a.steps.map((s, i) => <li key={i}><MdInline src={s} /></li>)}
        </ol>
      )}
      <p style={{ margin: '8px 0 0', fontFamily: 'var(--f-code)', fontSize: 13.5, color: 'var(--ink-2)' }}>Time {a.time} · Space {a.space}</p>
      <CodeTabs code={code} />
      {a.bottleneck && <div className="bn"><b>Why look further: </b><MdInline src={a.bottleneck} /></div>}
    </div>
  );
}
