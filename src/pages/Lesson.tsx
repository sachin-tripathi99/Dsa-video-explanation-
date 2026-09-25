import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SEQUENCE, moduleOfLesson, partOfModule, type Step } from '../content/curriculum';
import { loadLesson } from '../content/registry';
import type { Lesson, QuizQ } from '../content/types';
import { Player } from '../engine/Player';
import { Markdown } from '../components/Markdown';
import { markLesson, saveQuiz, useProgress } from '../state/store';
import { Check, DiffPill } from '../components/ui';

export const stepPath = (s: Step) => (s.type === 'lesson' ? `/lesson/${s.slug}` : `/problem/${s.slug}`);

export function PrevNext({ type, slug }: { type: Step['type']; slug: string }) {
  const i = SEQUENCE.findIndex((s) => s.type === type && s.slug === slug);
  const prev = SEQUENCE[i - 1];
  const next = SEQUENCE[i + 1];
  return (
    <div className="prevnext">
      {prev ? <Link to={stepPath(prev)}><small>← Previous {prev.type}</small>{prev.title}</Link> : <span />}
      {next && <Link className="next" to={stepPath(next)}><small>Next {next.type} →</small>{next.title}</Link>}
    </div>
  );
}

export function useLoaded<T>(load: () => Promise<T>, key: string) {
  const [state, setState] = useState<{ key: string; data: T | null; error: string | null; loading: boolean }>({ key, data: null, error: null, loading: true });
  useEffect(() => {
    let alive = true;
    setState({ key, data: null, error: null, loading: true });
    load()
      .then((data) => alive && setState({ key, data, error: null, loading: false }))
      .catch((e) => alive && setState({ key, data: null, error: String(e?.message ?? e), loading: false }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state.key === key ? state : { key, data: null, error: null, loading: true };
}

export function LessonPage() {
  const { slug = '' } = useParams();
  const m = moduleOfLesson(slug);
  const progress = useProgress();
  const { data: lesson, loading, error } = useLoaded(() => loadLesson(slug), slug);
  if (!m) return <div className="empty">That lesson doesn’t exist. <Link to="/learn">Back to the course</Link></div>;
  const part = partOfModule(m.id)!;
  const done = !!progress.lessons[slug];
  return (
    <>
      <div className="crumbs">
        <Link to="/learn">Course</Link> › <Link to={`/learn#${part.id}`}>{part.title}</Link> › <Link to={`/learn/${m.id}`}>{m.title}</Link> › <span>Concept lesson</span>
      </div>
      <div className="lesson-head">
        <div>
          <h1>{m.lessonTitle}</h1>
          <div className="meta">
            <span className="pill">Concept lesson</span>
            <span className="pill">{m.lessonMinutes} min</span>
            <span className="pill">{m.title}</span>
          </div>
        </div>
        <div className="head-actions">
          <button className="btn" aria-pressed={done} onClick={() => markLesson(slug)}>{done ? '✓ Completed' : 'Mark as complete'}</button>
        </div>
      </div>
      <div className="layout-2">
        <div>
          {loading && <div className="loading">Loading lesson…</div>}
          {error && <div className="empty">Couldn’t load this lesson: {error}</div>}
          {!loading && !error && !lesson && <div className="empty">This lesson is being written. The homework problems below are ready.</div>}
          {lesson && <LessonBody lesson={lesson} onFinished={() => markLesson(slug, true)} />}
          <PrevNext type="lesson" slug={slug} />
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
          {m.problems.length > 0 && (
            <div className="card">
              <span className="label">Homework · {m.problems.filter((p) => progress.solved[p.slug]).length}/{m.problems.length} solved</span>
              <ul className="side-list">
                {m.problems.map((p) => (
                  <li key={p.slug}>
                    <Check on={!!progress.solved[p.slug]} label={`Solved ${p.title}`} />
                    <Link to={`/problem/${p.slug}`}>{p.title}</Link>
                    <DiffPill d={p.difficulty} sm />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

function LessonBody({ lesson, onFinished }: { lesson: Lesson; onFinished: () => void }) {
  const script = useMemo(() => ({ ...lesson.video(), id: `lesson-${lesson.slug}` }), [lesson]);
  return (
    <>
      <Player script={script} onFinished={onFinished} />
      <section className="block">
        <Markdown src={lesson.body} />
      </section>
      {lesson.quiz && lesson.quiz.length > 0 && (
        <section className="block">
          <h2>Check yourself</h2>
          <Quiz id={lesson.slug} qs={lesson.quiz} />
        </section>
      )}
    </>
  );
}

function Quiz({ id, qs }: { id: string; qs: QuizQ[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const progress = useProgress();
  const answered = Object.keys(picked).length;
  const score = qs.reduce((a, q, i) => a + (picked[i] === q.answer ? 1 : 0), 0);
  useEffect(() => {
    if (answered === qs.length) saveQuiz(id, score, qs.length);
  }, [answered, id, qs.length, score]);
  const prev = progress.quiz[id];
  return (
    <div className="quiz">
      {prev && answered === 0 && <p className="muted" style={{ margin: 0 }}>Last attempt: {prev.score} / {prev.total}</p>}
      {qs.map((q, i) => (
        <div className="qcard" key={i}>
          <div className="q">{i + 1}. <Markdown src={q.q} className="inline-md" /></div>
          <div className="qopts">
            {q.options.map((o, k) => {
              const chosen = picked[i];
              const cls = chosen === undefined ? '' : k === q.answer ? 'right' : k === chosen ? 'wrong' : '';
              return (
                <button key={k} className={`qopt ${cls}`} disabled={chosen !== undefined} onClick={() => setPicked((p) => ({ ...p, [i]: k }))}>
                  <Markdown src={o} className="inline-md" />
                </button>
              );
            })}
          </div>
          {picked[i] !== undefined && <div className="qwhy"><b>{picked[i] === q.answer ? 'Correct. ' : 'Not quite. '}</b><Markdown src={q.why} className="inline-md" /></div>}
        </div>
      ))}
      {answered === qs.length && (
        <div className="takeaway">
          <span className="label">Score</span>
          <p>{score} / {qs.length}. {score === qs.length ? 'You’ve got it. On to the homework.' : 'Rewatch the chapters you missed, then try again.'} <button className="btn sm" onClick={() => setPicked({})}>Retry</button></p>
        </div>
      )}
    </div>
  );
}
