import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Stage, NARROW, WIDE } from './Stage';
import type { VideoScript } from './types';
import { estimateMs, listVoices, onVoicesChanged, speak, speechSupported, stopSpeech, type SpeakHandle } from './narration';
import { markWatched, prefsStore, saveVideoPos, setPref, usePrefs, useProgress } from '../state/store';
import './stage.css';
import './player.css';

const RATES = [0.8, 0.9, 1, 1.1, 1.25, 1.4];

export function Player({ script, onFinished }: { script: VideoScript; onFinished?: () => void }) {
  const prefs = usePrefs();
  const progress = useProgress();
  const frames = script.frames;
  const last = frames.length - 1;
  const [idx, setIdx] = useState(() => Math.min(progress.videoPos[script.id] ?? 0, last));
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [word, setWord] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [full, setFull] = useState(false);
  const [box, setBox] = useState({ w: 800, h: 450 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const token = useRef(0);
  const handle = useRef<SpeakHandle | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const playingRef = useRef(playing);
  playingRef.current = playing;

  // Reset when the script changes.
  useEffect(() => {
    setIdx(Math.min(progressStoreFrame(script.id), script.frames.length - 1));
    setPlaying(false);
    setStarted(false);
    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script]);

  useEffect(() => {
    const load = () => setVoices(listVoices());
    load();
    return onVoicesChanged(load);
  }, []);

  // Measure available space.
  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: full ? window.innerHeight - 150 : r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [full]);

  const narrow = box.w < 620;
  const size = narrow ? NARROW : WIDE;
  const scale = full ? Math.min(box.w / size.w, Math.max(box.h, 200) / size.h) : box.w / size.w;
  const stageH = size.h * scale;

  const stopAll = () => {
    token.current++;
    if (timer.current) clearTimeout(timer.current);
    handle.current?.cancel();
    handle.current = null;
    stopSpeech();
  };

  const run = useCallback(
    (i: number) => {
      stopAll();
      const my = token.current;
      const f = frames[i];
      setIdx(i);
      setWord(-1);
      const p = prefsStore.get();
      const after = () => {
        if (my !== token.current || !playingRef.current) return;
        if (i < last) {
          timer.current = setTimeout(() => {
            if (my === token.current && playingRef.current) run(i + 1);
          }, f.say ? 260 : 40);
        } else {
          setPlaying(false);
          markWatched(script.id, true);
          saveVideoPos(script.id, 0);
          onFinished?.();
        }
      };
      if (f.say && p.narration && speechSupported()) {
        handle.current = speak(f.say, { rate: p.rate, voiceName: p.voice, onWord: (c) => my === token.current && setWord(c) });
        handle.current.done.then(after);
      } else {
        timer.current = setTimeout(after, f.say ? estimateMs(f.say, p.rate) : f.hold / p.rate);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [frames, last, script.id],
  );

  const play = () => {
    setStarted(true);
    setPlaying(true);
    playingRef.current = true;
    run(idxRef.current >= last ? 0 : idxRef.current);
  };
  const pause = () => {
    setPlaying(false);
    playingRef.current = false;
    stopAll();
    saveVideoPos(script.id, idxRef.current);
  };
  const seek = (i: number) => {
    const j = Math.max(0, Math.min(last, i));
    setStarted(true);
    if (playingRef.current) run(j);
    else {
      stopAll();
      setIdx(j);
      setWord(-1);
      saveVideoPos(script.id, j);
    }
  };

  // Restart the current frame when narration settings change mid-play.
  useEffect(() => {
    if (playingRef.current) run(idxRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.narration, prefs.rate, prefs.voice]);

  useEffect(() => () => stopAll(), []);

  // Fullscreen
  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === wrapRef.current);
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);
  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await wrapRef.current?.requestFullscreen();
    } catch {
      /* fullscreen not available */
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'SELECT') return;
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      playing ? pause() : play();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      seek(idx + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      seek(idx - 1);
    } else if (e.key === 'f') toggleFull();
    else if (e.key === 'c') setPref('captions', !prefs.captions);
  };

  // Timeline: chapters sized by estimated duration.
  const timeline = useMemo(() => {
    const dur = frames.map((f) => (f.say ? estimateMs(f.say, 1) : f.hold) + 200);
    const chapters = script.chapters.map((c, ci) => {
      const idxs = frames.map((f, i) => (f.ch === ci ? i : -1)).filter((i) => i >= 0);
      return { c, first: idxs[0] ?? 0, count: idxs.length, ms: idxs.reduce((a, i) => a + dur[i], 0) };
    }).filter((x) => x.count > 0);
    const total = dur.reduce((a, b) => a + b, 0);
    return { chapters, total };
  }, [frames, script.chapters]);
  const mins = Math.max(1, Math.round(timeline.total / 60000));

  const f = frames[idx];
  const capWords = useMemo(() => {
    let off = 0;
    return f.say.split(' ').map((w) => {
      const o = off;
      off += w.length + 1;
      return { w, o };
    });
  }, [f.say]);

  return (
    <div className={`player${full ? ' is-full' : ''}`} ref={wrapRef} tabIndex={0} onKeyDown={onKey} aria-label={`Video: ${script.title}`}>
      <div className="stage-outer" ref={outerRef} style={{ height: full ? undefined : stageH, flex: full ? 1 : undefined }}>
        <div style={full ? { position: 'absolute', left: (box.w - size.w * scale) / 2, top: Math.max(0, (box.h - size.h * scale) / 2), width: size.w * scale, height: size.h * scale } : undefined}>
          <Stage script={script} frame={f} narrow={narrow} scale={scale} />
        </div>
        {!started && (
          <button className="big-play" onClick={play} aria-label="Play video">
            <span>
              <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5v13l11-6.5z" fill="currentColor" /></svg>
              {idx > 0 ? 'Resume' : 'Play'} · about {mins} min
            </span>
          </button>
        )}
      </div>
      {prefs.captions && (
        <div className="captions" aria-live="polite">
          {f.say ? capWords.map(({ w, o }) => <span key={o} className={o === word ? 'now' : ''}>{w} </span>) : <span className="muted">· · ·</span>}
        </div>
      )}
      <div className="controls">
        <button className="ctl" onClick={() => seek(idx - 1)} aria-label="Previous step" title="Previous step (←)">
          <svg viewBox="0 0 16 16"><path d="M3 2h2v12H3zM14 2v12L6 8z" /></svg>
        </button>
        <button className="ctl main" onClick={() => (playing ? pause() : play())} aria-label={playing ? 'Pause' : 'Play'} title="Play / pause (space)">
          {playing ? <svg viewBox="0 0 16 16"><path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" /></svg> : <svg viewBox="0 0 16 16"><path d="M3 1.5v13l11-6.5z" /></svg>}
        </button>
        <button className="ctl" onClick={() => seek(idx + 1)} aria-label="Next step" title="Next step (→)">
          <svg viewBox="0 0 16 16"><path d="M11 2h2v12h-2zM2 2v12l8-6z" /></svg>
        </button>
        <div className="tl" role="group" aria-label="Chapters">
          {timeline.chapters.map(({ c, first, count, ms }) => {
            const pct = idx < first ? 0 : idx >= first + count ? 100 : ((idx - first + 1) / count) * 100;
            const on = f.ch === script.chapters.indexOf(c);
            return (
              <button
                key={c.id + first}
                className={`seg k-${c.kind}${on ? ' on' : ''}`}
                style={{ flexGrow: ms }}
                title={c.title}
                onClick={(e) => {
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const frac = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 0.999);
                  seek(first + Math.floor(frac * count));
                }}
              >
                <span className="track"><i style={{ width: `${pct}%` }} /></span>
                <small>{c.title}</small>
              </button>
            );
          })}
        </div>
        <span className="step">{idx + 1} / {frames.length}</span>
        <button className="ctl" onClick={toggleFull} aria-label="Fullscreen" title="Fullscreen (f)">
          <svg viewBox="0 0 16 16"><path d="M1 1h5v2H3v3H1zM10 1h5v5h-2V3h-3zM1 10h2v3h3v2H1zM13 10h2v5h-5v-2h3z" /></svg>
        </button>
      </div>
      <div className="opts">
        <label>
          Speed
          <select value={prefs.rate} onChange={(e) => setPref('rate', parseFloat(e.target.value))}>
            {RATES.map((r) => <option key={r} value={r}>{r}×</option>)}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={prefs.narration} disabled={!speechSupported()} onChange={(e) => setPref('narration', e.target.checked)} /> Narration
        </label>
        <label>
          <input type="checkbox" checked={prefs.captions} onChange={(e) => setPref('captions', e.target.checked)} /> Captions
        </label>
        {voices.length > 0 && (
          <label>
            Voice
            <select value={prefs.voice ?? voices[0]?.name ?? ''} onChange={(e) => setPref('voice', e.target.value)}>
              {voices.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/^(Microsoft|Google)\s+/, '')} ({v.lang})</option>)}
            </select>
          </label>
        )}
        <span className="keys">Space play/pause · ← → step · F fullscreen · C captions</span>
      </div>
    </div>
  );
}

function progressStoreFrame(id: string) {
  try {
    const raw = localStorage.getItem('dryrun.progress.v1');
    return raw ? JSON.parse(raw).videoPos?.[id] ?? 0 : 0;
  } catch {
    return 0;
  }
}
