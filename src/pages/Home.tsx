import { Link } from 'react-router-dom';
import { MODULES, PARTS, PROBLEMS, SEQUENCE } from '../content/curriculum';
import { PLANS, planById } from '../content/roadmaps';
import { useProgress } from '../state/store';
import { PlayIcon, Ring } from '../components/ui';
import { HeroDemo } from '../components/HeroDemo';

export function HomePage() {
  const progress = useProgress();
  const done = (s: (typeof SEQUENCE)[number]) => (s.type === 'lesson' ? !!progress.lessons[s.slug] : !!progress.solved[s.slug]);
  const doneCount = SEQUENCE.filter(done).length;
  const next = SEQUENCE.find((s) => !done(s)) ?? SEQUENCE[0];
  const nextModule = MODULES.find((m) => m.id === next.module)!;
  const started = doneCount > 0;
  const plan = progress.roadmap ? planById(progress.roadmap.id) : null;

  return (
    <>
      <section className="hero">
        <div>
          <span className="label">Pattern-based DSA course</span>
          <h1 style={{ marginTop: 10 }}>
            See every algorithm <em>run</em>, step by step, until the pattern clicks.
          </h1>
          <p className="lead">
            Start from Big-O, learn each data structure with a real-life picture, then work through {MODULES.filter((m) => PARTS[2].modules.includes(m)).length} interview patterns in order. Every concept and every problem has an animated, narrated video that goes from brute force to optimal and explains why.
          </p>
          <div className="cta">
            <Link className="btn primary" to={next.type === 'lesson' ? `/lesson/${next.slug}` : `/problem/${next.slug}`}>
              <PlayIcon /> {started ? 'Continue learning' : 'Start with lesson 1'}
            </Link>
            <Link className="btn" to="/roadmaps">Pick a roadmap</Link>
          </div>
          <div className="stats-row">
            <div><b>{MODULES.length}</b><span>modules</span></div>
            <div><b>{PROBLEMS.length}</b><span>problems with videos</span></div>
            <div><b>3</b><span>languages: Java, Python, C++</span></div>
            <div><b>{PLANS.length}</b><span>roadmaps, 2 to 12 months</span></div>
          </div>
        </div>
        <div className="hero-art">
          <HeroDemo />
        </div>
      </section>

      {started && (
        <section className="continue">
          <Ring value={doneCount} total={SEQUENCE.length} />
          <div>
            <span className="label">Up next · {nextModule.title}</span>
            <h3>{next.title}</h3>
            <p className="muted" style={{ margin: '2px 0 0', fontSize: 14 }}>
              {doneCount} of {SEQUENCE.length} steps done{plan ? ` · following the ${plan.months}-month roadmap` : ''}
            </p>
          </div>
          <Link className="btn primary" to={next.type === 'lesson' ? `/lesson/${next.slug}` : `/problem/${next.slug}`}>
            <PlayIcon /> Continue
          </Link>
        </section>
      )}

      <section className="home-block">
        <div className="section-title">
          <h2>How every module works</h2>
        </div>
        <div className="loop4">
          <div><span className="k">1 · watch</span><b>Concept video</b><p>What the idea is, drawn out on a whiteboard, plus the clues in a problem that point to it.</p></div>
          <div><span className="k">2 · read</span><b>Notes and templates</b><p>Real-life analogy, operation costs, and a code template in Java, Python and C++.</p></div>
          <div><span className="k">3 · solve</span><b>Homework on LeetCode</b><p>Problems graded core → practice → challenge. Try each one yourself first.</p></div>
          <div><span className="k">4 · review</span><b>Solution video</b><p>Brute force, better, optimal: what each costs and what made us look for the next one.</p></div>
        </div>
      </section>

      <section className="home-block">
        <div className="section-title">
          <h2>The course, in order</h2>
          <Link to="/learn">See every module →</Link>
        </div>
        <div className="parts-overview">
          {PARTS.map((p, i) => (
            <Link key={p.id} to={`/learn#${p.id}`} className="part-card">
              <span className="label">Part {i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <ul>
                {p.modules.slice(0, 9).map((m) => <li key={m.id}>{m.title}</li>)}
                {p.modules.length > 9 && <li>+{p.modules.length - 9} more</li>}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-block">
        <div className="section-title">
          <h2>Pick a pace</h2>
          <Link to="/roadmaps">Compare roadmaps →</Link>
        </div>
        <div className="plans">
          {PLANS.map((p) => (
            <Link key={p.id} to={`/roadmaps/${p.id}`} className={`plan${progress.roadmap?.id === p.id ? ' current' : ''}`}>
              <span className="big">{p.months}<small>{p.months === 12 ? 'months · 1 year' : 'months'}</small></span>
              <b>{p.title}</b>
              <p>{p.pitch}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
