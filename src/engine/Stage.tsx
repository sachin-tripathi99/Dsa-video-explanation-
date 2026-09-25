import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { PanelView, panelGrow } from './panels';
import type { Frame, Panel, VideoScript } from './types';

const HTML_KINDS = new Set<Panel['kind']>(['text', 'table', 'map', 'bits', 'vars']);

/** Scales HTML content down (never up) so it always fits its box. */
function FitBox({ children, dep }: { children: ReactNode; dep: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      // Centred content can overflow on the left too, which scrollWidth misses: measure children's layout boxes as well.
      const kids = Array.from(i.children) as HTMLElement[];
      const w = Math.max(i.scrollWidth, ...kids.map((c) => c.offsetWidth));
      const h = Math.max(i.scrollHeight, ...kids.map((c) => c.offsetHeight));
      const next = Math.min(1, o.clientWidth / Math.max(w, 1), o.clientHeight / Math.max(h, 1));
      setK((prev) => (Math.abs(prev - next) > 0.01 ? next : prev));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [dep]);
  return (
    <div className="fit" ref={outer}>
      <div className="fit-in" ref={inner} style={{ transform: `scale(${k})` }}>
        {children}
      </div>
    </div>
  );
}

export const WIDE = { w: 1200, h: 675 };
export const NARROW = { w: 760, h: 1080 };

export function Stage({ script, frame, narrow, scale }: { script: VideoScript; frame: Frame; narrow: boolean; scale: number }) {
  const ch = script.chapters[frame.ch];
  const size = narrow ? NARROW : WIDE;
  const vis = frame.panels.filter((p) => p.kind !== 'vars');
  const vars = frame.panels.filter((p) => p.kind === 'vars');
  const code = ch.code ?? [];
  const hasSide = code.length > 0 || vars.length > 0;
  return (
    <div className="stage" style={{ width: size.w, height: size.h, transform: `scale(${scale})` }} aria-hidden="true">
      <div className="st-head">
        <span className={`st-chip k-${ch.kind}`}>{ch.title}</span>
        {ch.cx && <span className="st-cx">{ch.cx}</span>}
        {frame.counter && <span className="st-counter">{frame.counter}</span>}
      </div>
      <div className={`st-body${narrow ? ' narrow' : ''}`}>
        <div className={`st-vis ${frame.layout}`}>
          {vis.map((p) => (
            <div key={p.id} className="pn" style={{ flex: `${panelGrow(p)} 1 0` }}>
              {'label' in p && p.label && <div className="pn-label">{p.label}</div>}
              <div className="pn-body">
                {HTML_KINDS.has(p.kind) ? (
                  <FitBox dep={JSON.stringify(p)}>
                    <PanelView p={p} />
                  </FitBox>
                ) : (
                  <PanelView p={p} />
                )}
              </div>
            </div>
          ))}
        </div>
        {hasSide && (
          <div className="st-side">
            {code.length > 0 && (
              <div className="st-code" style={{ fontSize: Math.min(15, (narrow ? 690 : 330) / (Math.max(...code.map((l) => l.length), 1) * 0.61)) }}>
                {code.map((l, i) => (
                  <div key={i} className={frame.line.includes(i) ? 'hl' : ''}>{l || ' '}</div>
                ))}
              </div>
            )}
            {vars.map((p) => (
              <div key={p.id} className="pn">
                {'label' in p && p.label && <div className="pn-label">{p.label}</div>}
                <PanelView p={p} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="st-foot">
        {frame.eq && <div className={`st-eq ${frame.eqTone}`}>{frame.eq}</div>}
        {frame.note && <div className="st-note">{frame.note}</div>}
      </div>
    </div>
  );
}
