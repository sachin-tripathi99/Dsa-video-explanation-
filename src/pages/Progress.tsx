import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MODULES, PARTS, PROBLEMS } from '../content/curriculum';
import { exportProgress, importProgress, progressStore, useProgress } from '../state/store';
import { Bar, DiffPill } from '../components/ui';
import { moduleStats } from './Learn';

export function ProgressPage() {
  const progress = useProgress();
  const [msg, setMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const solved = PROBLEMS.filter((p) => progress.solved[p.slug]);
  const byDiff = (d: string) => solved.filter((p) => p.difficulty === d).length;
  const totalDiff = (d: string) => PROBLEMS.filter((p) => p.difficulty === d).length;
  const lessons = MODULES.filter((m) => progress.lessons[m.lesson]).length;
  const starred = PROBLEMS.filter((p) => progress.bookmarks[p.slug]);
  const flash = (s: string) => {
    setMsg(s);
    setTimeout(() => setMsg(''), 2500);
  };
  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dryrun-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <div className="page-head">
        <div>
          <span className="label">Progress</span>
          <h1>Where you are</h1>
          <p>Saved in this browser only. Export a backup if you switch devices or clear your browser data.</p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={download}>Export backup</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Import backup</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                importProgress(await f.text());
                flash('Progress imported');
              } catch (err) {
                flash(String((err as Error).message));
              }
              e.target.value = '';
            }}
          />
        </div>
      </div>
      <div className="loop4">
        <div><span className="k">problems</span><b>{solved.length} / {PROBLEMS.length}</b><Bar value={solved.length} total={PROBLEMS.length} /></div>
        <div><span className="k">lessons</span><b>{lessons} / {MODULES.length}</b><Bar value={lessons} total={MODULES.length} /></div>
        <div><span className="k">by difficulty</span><b style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><DiffPill d="Easy" sm /> {byDiff('Easy')}/{totalDiff('Easy')} <DiffPill d="Medium" sm /> {byDiff('Medium')}/{totalDiff('Medium')} <DiffPill d="Hard" sm /> {byDiff('Hard')}/{totalDiff('Hard')}</b></div>
        <div><span className="k">videos watched</span><b>{Object.keys(progress.watched).length}</b><p>Finished to the end</p></div>
      </div>

      {starred.length > 0 && (
        <section className="block">
          <h2>Starred for revision</h2>
          <ul className="plist">
            {starred.map((p, i) => (
              <li key={p.slug}>
                <span />
                <span className="n">{i + 1}</span>
                <div><Link className="t" to={`/problem/${p.slug}`}>{p.title}</Link><div className="sub"><DiffPill d={p.difficulty} sm /></div></div>
                <span />
              </li>
            ))}
          </ul>
        </section>
      )}

      {PARTS.map((part) => (
        <section className="block" key={part.id}>
          <h2>{part.title}</h2>
          <div className="mods">
            {part.modules.map((m) => {
              const s = moduleStats(m, progress);
              return (
                <Link key={m.id} to={`/learn/${m.id}`} className={`mod-card${s.complete ? ' done' : ''}`}>
                  <h3>{m.title}</h3>
                  <div className="meta">
                    <span>{s.done}/{s.total}</span>
                    <Bar value={s.done} total={s.total} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className="block">
        <h2>Start over</h2>
        {!confirmReset ? (
          <button className="btn" onClick={() => setConfirmReset(true)}>Reset all progress…</button>
        ) : (
          <div className="card" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>This clears solved problems, lessons, notes and your roadmap in this browser.</span>
            <button className="btn" style={{ borderColor: 'var(--brute)', color: 'var(--brute)' }} onClick={() => { progressStore.reset(); setConfirmReset(false); flash('Progress reset'); }}>Yes, reset</button>
            <button className="btn ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
          </div>
        )}
      </section>
      {msg && <div className="toast" role="status">{msg}</div>}
    </>
  );
}
