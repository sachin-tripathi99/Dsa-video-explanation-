import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Stage, WIDE } from '../engine/Stage';
import { Video } from '../engine/builder';
import '../engine/stage.css';

/** A silent looping dry run for the landing page: two pointers on a sorted array. */
function demoScript() {
  const A = [1, 3, 4, 6, 9, 11, 15];
  const T = 13;
  const v = new Video('hero-demo', 'Two pointers');
  v.chapter('optimal', 'Two pointers', { cx: 'O(n)', code: ['L, R = 0, n-1', 'while L < R:', '  s = a[L] + a[R]', '  if s == t: return [L, R]', '  if s > t:  R -= 1', '  else:      L += 1'] });
  const a = v.array('nums', A, { label: 'nums (sorted) · target 13' });
  let L = 0;
  let R = A.length - 1;
  let c = 0;
  a.ptr('L', L).ptr('R', R);
  v.line(0).hold(900);
  while (L < R) {
    const s = A[L] + A[R];
    c++;
    a.clearTones(['dim']).tone([L, R], s === T ? 'ok' : 'cmp');
    v.counter(`checks: ${c}`).line(2);
    if (s === T) {
      v.eq(`${A[L]} + ${A[R]} = 13 ✓`, 'ok').line(3).note('found in one pass').hold(2600);
      break;
    }
    v.eq(`${A[L]} + ${A[R]} = ${s} ${s > T ? '> 13 → R moves left' : '< 13 → L moves right'}`, 'bad').hold(1300);
    if (s > T) {
      a.tone(R, 'dim');
      R--;
      v.line(4);
    } else {
      a.tone(L, 'dim');
      L++;
      v.line(5);
    }
    a.clearTones(['dim']).ptr('L', L).ptr('R', R);
    v.hold(800);
  }
  return v.build();
}

export function HeroDemo() {
  const script = useMemo(demoScript, []);
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(560);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.getBoundingClientRect().width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const f = script.frames[i];
    const t = setTimeout(() => setI((x) => (x + 1) % script.frames.length), f.hold);
    return () => clearTimeout(t);
  }, [i, script]);
  const scale = w / WIDE.w;
  return (
    <div className="player" style={{ boxShadow: 'var(--shadow-lg)' }}>
      <div className="stage-outer" ref={ref} style={{ height: WIDE.h * scale }}>
        <Stage script={script} frame={script.frames[i]} narrow={false} scale={scale} />
      </div>
    </div>
  );
}
