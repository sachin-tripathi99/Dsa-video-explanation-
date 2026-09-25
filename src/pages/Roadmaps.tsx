import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MODULES } from '../content/curriculum';
import { PLANS, buildPlan, planById, type PlanItem } from '../content/roadmaps';
import { markRoadmapItem, markSolved, markLesson, setRoadmap, useProgress, type Progress } from '../state/store';
import { Bar, Check, DiffPill } from '../components/ui';

const itemDone = (it: PlanItem, p: Progress) =>
  it.kind === 'lesson' ? !!p.lessons[it.slug] : it.kind === 'problem' ? !!p.solved[it.slug] : !!p.roadmapDone[it.id];

export function RoadmapsPage() {
  const progress = useProgress();
  const plans = useMemo(() => PLANS.map((p) => ({ p, b: buildPlan(p) })), []);
  return (
    <>
      <div className="page-head">
        <div>
          <span className="label">Roadmaps</span>
          <h1>Choose how fast you want to go</h1>
          <p>
            Every roadmap follows the same order as the course, so nothing is skipped that a later topic needs. Shorter plans focus on core problems; longer ones add practice, challenge problems, revision weeks and mock interviews.
          </p>
        </div>
      </div>
      <div className="plans">
        {plans.map(({ p, b }) => (
          <Link key={p.id} to={`/roadmaps/${p.id}`} className={`plan${progress.roadmap?.id === p.id ? ' current' : ''}`}>
            <span className="big">{p.months}<small>months</small></span>
            <b>{p.title}{progress.roadmap?.id === p.id ? ' · your plan' : ''}</b>
            <p>{p.pitch}</p>
            <p className="muted" style={{ fontSize: 13 }}>{p.who}</p>
            <div className="facts">
              <span className="pill sm">~{b.hoursPerDay} h/day</span>
              <span className="pill sm">{p.daysPerWeek} days/week</span>
              <span className="pill sm">{b.problemCount} problems</span>
              <span className="pill sm">{b.lessonCount} lessons</span>
            </div>
          </Link>
        ))}
      </div>
      <section className="block">
        <h2>How to pick</h2>
        <div className="prose">
          <ul>
            <li><b>Interview in under 10 weeks?</b> Take the 2-month sprint and do only core problems. Come back to practice problems later.</li>
            <li><b>Working full time?</b> The 4- or 6-month plans fit 1.5–3 hours on weekdays.</li>
            <li><b>Complete beginner?</b> The 12-month plan starts slowly, repeats material in revision weeks, and ends with a month of mock interviews.</li>
            <li>You can switch plans at any time. Progress is shared, so solved problems stay solved.</li>
          </ul>
        </div>
      </section>
    </>
  );
}

export function RoadmapPage() {
  const { planId = '' } = useParams();
  const plan = planById(planId);
  const progress = useProgress();
  const built = useMemo(() => (plan ? buildPlan(plan) : null), [plan]);
  const [date, setDate] = useState(() => progress.roadmap?.id === planId ? progress.roadmap.start : new Date().toISOString().slice(0, 10));
  if (!plan || !built) return <div className="empty">That roadmap doesn’t exist. <Link to="/roadmaps">See all roadmaps</Link></div>;
  const active = progress.roadmap?.id === plan.id;
  const start = active ? new Date(progress.roadmap!.start + 'T00:00:00') : null;
  const currentWeek = start ? Math.floor((Date.now() - start.getTime()) / (7 * 86400000)) + 1 : 0;
  const all = built.weeks.flatMap((w) => w.items);
  const doneCount = all.filter((i) => itemDone(i, progress)).length;
  const modTitle = (id: string) => MODULES.find((m) => m.id === id)?.title ?? '';
  return (
    <>
      <div className="crumbs"><Link to="/roadmaps">Roadmaps</Link> › <span>{plan.months} months</span></div>
      <div className="page-head">
        <div>
          <span className="label">{plan.title} · {plan.months} months</span>
          <h1>{plan.pitch}</h1>
          <p>
            {built.weeks.length} weeks · about {built.hoursPerDay} hours a day, {plan.daysPerWeek} days a week · {built.lessonCount} lessons and {built.problemCount} problems.
            {plan.reviseEvery > 0 && ` A revision week after every ${plan.reviseEvery} weeks.`} {plan.mockWeeks} week{plan.mockWeeks > 1 ? 's' : ''} of mock interviews at the end.
          </p>
        </div>
        <div className="card" style={{ minWidth: 260 }}>
          {active ? (
            <>
              <span className="label">Your plan · week {Math.max(1, Math.min(currentWeek, built.weeks.length))} of {built.weeks.length}</span>
              <div style={{ margin: '10px 0 6px' }}><Bar value={doneCount} total={all.length} /></div>
              <p className="muted" style={{ margin: '0 0 10px', fontSize: 13 }}>{doneCount} of {all.length} items done</p>
              <button className="btn sm" onClick={() => setRoadmap(null)}>Stop following</button>
            </>
          ) : (
            <>
              <label className="label" htmlFor="start-date">Start date</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <input id="start-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '6px 8px', background: 'var(--surface)' }} />
                <button className="btn primary sm" onClick={() => setRoadmap({ id: plan.id, start: date })}>Follow this plan</button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="weeks">
        {built.weeks.map((w) => {
          const d = w.items.filter((i) => itemDone(i, progress)).length;
          const isNow = active && w.n === currentWeek;
          return (
            <details key={w.n} className={`week${isNow ? ' now' : ''}`} open={isNow || (!active && w.n === 1)}>
              <summary>
                <span className="wk">Week {w.n}{isNow ? ' · now' : ''}</span>
                <h3>{w.kind === 'study' ? w.title : w.title}</h3>
                <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="muted" style={{ fontSize: 12.5 }}>{d}/{w.items.length}</span>
                  <Bar value={d} total={w.items.length} />
                </span>
              </summary>
              <ul>
                {w.items.map((it) => {
                  const done = itemDone(it, progress);
                  if (it.kind === 'task')
                    return (
                      <li key={it.id}>
                        <Check on={done} onClick={() => markRoadmapItem(it.id)} label={it.title} />
                        <span>{it.title}<br /><span className="kind">{it.detail}</span></span>
                        <span className="kind">{w.kind === 'mock' ? 'Mock' : 'Revision'}</span>
                      </li>
                    );
                  return (
                    <li key={`${it.kind}-${it.slug}`}>
                      <Check on={done} onClick={() => (it.kind === 'lesson' ? markLesson(it.slug) : markSolved(it.slug))} label={it.title} />
                      <span>
                        <Link to={it.kind === 'lesson' ? `/lesson/${it.slug}` : `/problem/${it.slug}`}>{it.title}</Link>
                        <br />
                        <span className="kind">{it.kind === 'lesson' ? `Concept lesson · ${modTitle(it.module)}` : `Problem · ${modTitle(it.module)}`}</span>
                      </span>
                      {it.kind === 'problem' ? <DiffPill d={it.ref.difficulty} sm /> : <span className="pill sm core">Lesson</span>}
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </>
  );
}
