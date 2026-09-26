import React from 'react';
import type {
  ArrayPanel, BarsPanel, BitsPanel, ChartPanel, GraphPanel, GridPanel, HeapPanel, IntervalsPanel, ListPanel,
  MapPanel, Panel, StackPanel, TablePanel, TextPanel, Tone, TreePanel, VarsPanel,
} from './types';

const tc = (t?: Tone) => `tn tn-${t ?? 'none'}`;
const ec = (t?: Tone) => `edge e-${t ?? 'none'}`;
const fmt = (v: unknown) => (v === null || v === undefined ? '' : String(v));

function fitFont(text: string, box: number, max = 0.42) {
  const len = Math.max(text.length, 1);
  return Math.max(10, Math.min(box * max, (box * 0.86) / (len * 0.62)));
}

/** Inline formatting for text lines: `code` and **bold**. */
export function inline(s: string): React.ReactNode {
  const parts = s.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <b key={i}>{part.slice(2, -2)}</b>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function Svg({ w, h, children, maxScale = 1.5, defs }: { w: number; h: number; children: React.ReactNode; maxScale?: number; defs?: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ maxWidth: w * maxScale, maxHeight: h * maxScale }}>
      {defs && <defs>{defs}</defs>}
      {children}
    </svg>
  );
}

/** Arrowhead markers, one per colour family. */
function Markers({ id }: { id: string }) {
  const tones: [string, string][] = [
    ['n', 'var(--line-2)'], ['a', 'var(--accent)'], ['o', 'var(--optimal)'], ['p', 'var(--p2)'], ['b', 'var(--brute)'], ['w', 'var(--better)'],
  ];
  return (
    <>
      {tones.map(([k, c]) => (
        <marker key={k} id={`${id}-${k}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" style={{ fill: c }} />
        </marker>
      ))}
    </>
  );
}
function markerFor(t?: Tone) {
  switch (t) {
    case 'active': case 'cmp': case 'visit': return 'a';
    case 'ok': case 'sorted': return 'o';
    case 'path': case 'pivot': return 'p';
    case 'bad': return 'b';
    case 'warn': case 'win': return 'w';
    default: return 'n';
  }
}
const safeId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '_');

function PtrMark({ name, color, x, y }: { name: string; color?: number; x: number; y: number }) {
  return (
    <g className={`mv ptr-${color ?? 3}`} style={{ transform: `translate(${x}px, ${y}px)` }}>
      <path d="M0 0 L7.5 11 L-7.5 11 Z" />
      <text y={27} textAnchor="middle" fontSize={16} fontWeight={700} fontFamily="var(--f-code)">{name}</text>
    </g>
  );
}

/* ---------------- Array ---------------- */
function ArrayView({ p }: { p: ArrayPanel }) {
  const n = Math.max(p.items.length, 1);
  const bars = !!p.bars;
  const cw = bars ? (n <= 10 ? 54 : n <= 16 ? 40 : 30) : n <= 8 ? 66 : n <= 12 ? 58 : n <= 16 ? 46 : n <= 22 ? 36 : 30;
  const gap = n <= 12 ? 8 : 5;
  const pad = 12 + cw / 2;
  const tagH = 26;
  const cellH = bars ? 180 : cw;
  const idxH = bars ? 20 : 0;
  const subH = 28;
  const ptrRowH = 30;
  const W = pad * 2 + n * cw + (n - 1) * gap;
  const H = tagH + cellH + idxH + subH + 3 * ptrRowH + 4;
  const x = (i: number) => pad + i * (cw + gap);
  const maxV = bars ? Math.max(1, ...p.items.map((it) => Math.abs(Number(it.v) || 0))) : 1;

  const groups: Record<number, string[]> = {};
  for (const pt of p.ptrs) (groups[pt.at] ??= []).push(pt.name);
  const yP = tagH + cellH + idxH + subH;

  let winPath = '';
  if (p.win && p.items.length) {
    const l = Math.max(0, p.win.l);
    const r = Math.min(p.items.length - 1, p.win.r);
    if (r >= l) {
      const x0 = x(l) - 6;
      const x1 = x(r) + cw + 6;
      const y0 = tagH - 6;
      const y1 = tagH + cellH + 6;
      winPath = `M${x0} ${y0} H${x1} V${y1} H${x0} Z`;
    }
  }
  const winTone = p.win?.tone ?? 'win';
  const winColor = winTone === 'ok' ? 'var(--optimal)' : winTone === 'active' ? 'var(--accent)' : winTone === 'bad' ? 'var(--brute)' : 'var(--better)';

  return (
    <Svg w={W} h={H}>
      {winPath && (
        <path className="pth" d={winPath} style={{ d: `path('${winPath}')`, fill: winColor, fillOpacity: 0.12, stroke: winColor, strokeWidth: 2.5, strokeDasharray: '7 5' } as React.CSSProperties} />
      )}
      {p.win?.label && winPath && (
        <text x={x(Math.min(p.items.length - 1, p.win.r)) + cw + 10} y={tagH + 14} fontSize={15} fontFamily="var(--f-code)" style={{ fill: winColor }} fontWeight={700}>{p.win.label}</text>
      )}
      {p.items.map((it, i) => {
        const s = fmt(it.v);
        const bh = bars ? Math.max(6, (Math.abs(Number(it.v) || 0) / maxV) * (cellH - 26)) : cw;
        return (
          <g key={it.k} className={`mv ${tc(p.tones[i])}`} style={{ transform: `translate(${x(i)}px, ${tagH}px)` }}>
            {bars ? (
              <>
                <rect className="shape" x={0} y={cellH - bh} width={cw} height={bh} rx={6} />
                <text className="v-txt" x={cw / 2} y={cellH - bh - 8} textAnchor="middle" fontSize={Math.min(18, cw * 0.42)}>{s}</text>
                {p.showIdx && <text className="i-txt" x={cw / 2} y={cellH + 16} textAnchor="middle" fontSize={12}>{i}</text>}
              </>
            ) : (
              <>
                <rect className="shape" width={cw} height={cw} rx={10} />
                <text className="v-txt" x={cw / 2} y={cw / 2 + 1} dominantBaseline="central" textAnchor="middle" fontSize={fitFont(s, cw)}>{s}</text>
                {p.showIdx && <text className="i-txt" x={7} y={14} fontSize={11.5}>{i}</text>}
              </>
            )}
          </g>
        );
      })}
      {Object.entries(p.tags ?? {}).map(([i, t]) => (
        <text key={`t${i}`} x={x(+i) + cw / 2} y={tagH - 10} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="var(--f-code)" style={{ fill: 'var(--accent)' }}>{t}</text>
      ))}
      {Object.entries(p.sub ?? {}).map(([i, t]) => (
        <text key={`s${i}`} className="s-txt" x={x(+i) + cw / 2} y={tagH + cellH + idxH + 20} textAnchor="middle" fontSize={Math.min(15, fitFont(t, cw + gap, 0.34))}>{t}</text>
      ))}
      {p.ptrs.map((pt) => {
        const row = groups[pt.at].indexOf(pt.name);
        const at = Math.max(-0.7, Math.min(pt.at, n - 0.3));
        return <PtrMark key={`p-${pt.name}`} name={pt.name} color={pt.color} x={pad + at * (cw + gap) + cw / 2} y={yP + row * ptrRowH} />;
      })}
    </Svg>
  );
}

/* ---------------- Grid ---------------- */
function GridView({ p }: { p: GridPanel }) {
  const R = p.cells.length;
  const C = p.cells[0]?.length ?? 0;
  const cs = p.cellSize ?? Math.max(26, Math.min(58, 760 / Math.max(C, 1), 440 / Math.max(R, 1)));
  const headW = p.rowHead ? Math.max(...p.rowHead.map((s) => s.length)) * 10 + 20 : 0;
  const headH = p.colHead ? 28 : 0;
  const W = headW + C * cs + 8;
  const H = headH + R * cs + 8;
  const cx = (c: number) => headW + 4 + c * cs;
  const cy = (r: number) => headH + 4 + r * cs;
  const mid = safeId(`g-${p.id}`);
  return (
    <Svg w={W} h={H} defs={<Markers id={mid} />}>
      {p.colHead?.map((h, c) => (
        <text key={`ch${c}`} className="l-txt" x={cx(c) + cs / 2} y={18} textAnchor="middle" fontSize={Math.min(15, cs * 0.4)} fontFamily="var(--f-code)">{h}</text>
      ))}
      {p.rowHead?.map((h, r) => (
        <text key={`rh${r}`} className="l-txt" x={headW - 10} y={cy(r) + cs / 2} textAnchor="end" dominantBaseline="central" fontSize={Math.min(15, cs * 0.4)} fontFamily="var(--f-code)">{h}</text>
      ))}
      {p.cells.map((row, r) =>
        row.map((v, c) => {
          const s = fmt(v);
          return (
            <g key={`${r},${c}`} className={tc(p.tones[`${r},${c}`])} transform={`translate(${cx(c)}, ${cy(r)})`}>
              <rect className="shape" x={2} y={2} width={cs - 4} height={cs - 4} rx={Math.min(8, cs * 0.18)} />
              <text className="v-txt" x={cs / 2} y={cs / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={fitFont(s, cs, 0.4)}>{s}</text>
            </g>
          );
        }),
      )}
      {(p.arrows ?? []).map((a, i) => {
        const x1 = cx(a.from[1]) + cs / 2, y1 = cy(a.from[0]) + cs / 2;
        const x2 = cx(a.to[1]) + cs / 2, y2 = cy(a.to[0]) + cs / 2;
        const len = Math.hypot(x2 - x1, y2 - y1) || 1;
        const sh = cs * 0.32;
        const d = `M${x1 + ((x2 - x1) / len) * sh} ${y1 + ((y2 - y1) / len) * sh} L${x2 - ((x2 - x1) / len) * sh} ${y2 - ((y2 - y1) / len) * sh}`;
        // Thin stroke: marker size scales with stroke width, and these arrows are short.
        return <path key={`a${i}`} className={ec(a.tone)} d={d} style={{ strokeWidth: 2 }} markerEnd={`url(#${mid}-${markerFor(a.tone)})`} />;
      })}
      {(p.ptrs ?? []).map((pt) => (
        <g key={`p-${pt.name}`} className={`mv ptr-${pt.color ?? 3}`} style={{ transform: `translate(${cx(pt.c)}px, ${cy(pt.r)}px)` }}>
          <rect x={1} y={1} width={cs - 2} height={cs - 2} rx={8} style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 3.5 }} />
          <text x={cs - 4} y={-4} textAnchor="end" fontSize={14} fontWeight={700} fontFamily="var(--f-code)">{pt.name}</text>
        </g>
      ))}
    </Svg>
  );
}

/* ---------------- Linked list ---------------- */
function ListView({ p }: { p: ListPanel }) {
  const boxW = 80;
  const boxH = 50;
  const gapX = 50;
  const rows = Math.max(1, ...Object.values(p.row ?? {}).map((r) => r + 1));
  const rowH = 150;
  const top = 64;
  const rowOf = (id: string) => p.row?.[id] ?? 0;
  // column index within each row
  const col: Record<string, number> = {};
  const counts: number[] = Array(rows).fill(0);
  for (const nd of p.nodes) {
    const r = rowOf(nd.id);
    col[nd.id] = counts[r]++;
  }
  const maxCols = Math.max(1, ...counts);
  const X = (id: string) => 24 + col[id] * (boxW + gapX);
  const Y = (id: string) => top + rowOf(id) * rowH;
  const W = 24 + maxCols * (boxW + gapX) + 70;
  const H = top + (rows - 1) * rowH + boxH + 110;
  const mid = safeId(`l-${p.id}`);
  const exists = new Set(p.nodes.map((n) => n.id));

  const edges: React.ReactNode[] = [];
  for (const nd of p.nodes) {
    const to = p.next[nd.id];
    const ax = X(nd.id) + boxW - 14;
    const ay = Y(nd.id) + boxH / 2;
    const t = p.tones[nd.id];
    if (to && exists.has(to)) {
      const bx = X(to);
      const by = Y(to);
      let d: string;
      if (rowOf(to) === rowOf(nd.id) && col[to] === col[nd.id] + 1) d = `M${ax} ${ay} L${bx - 2} ${by + boxH / 2}`;
      else if (rowOf(to) !== rowOf(nd.id)) d = `M${ax} ${ay} C${ax + 40} ${ay}, ${bx - 40} ${by + boxH / 2}, ${bx - 2} ${by + boxH / 2}`;
      else if (col[to] > col[nd.id]) d = `M${ax} ${ay - 8} C${ax + 20} ${ay - 90}, ${bx + boxW / 2} ${by - 70}, ${bx + boxW / 2} ${by - 2}`;
      else d = `M${ax} ${ay + 10} C${ax + 10} ${ay + 95}, ${bx + boxW / 2} ${by + boxH + 75}, ${bx + boxW / 2} ${by + boxH + 2}`;
      edges.push(
        <path key={`e-${nd.id}`} className={`pth ${ec(t === 'active' || t === 'ok' || t === 'path' ? t : undefined)}`} d={d} style={{ d: `path('${d}')` } as React.CSSProperties} markerEnd={`url(#${mid}-${markerFor(t === 'active' || t === 'ok' || t === 'path' ? t : undefined)})`} />,
      );
    }
  }
  const nullX = 24 + maxCols * (boxW + gapX) - gapX + 16;
  const ptrGroups: Record<string, string[]> = {};
  for (const pt of p.ptrs) (ptrGroups[pt.node ?? '__null'] ??= []).push(pt.name);

  return (
    <Svg w={W} h={H} defs={<Markers id={mid} />}>
      {edges}
      {p.nodes.map((nd) => {
        const to = p.next[nd.id];
        const isNull = to === null || to === undefined || !exists.has(to);
        const s = fmt(nd.v);
        return (
          <g key={nd.id} className={`mv ${tc(p.tones[nd.id])}`} style={{ transform: `translate(${X(nd.id)}px, ${Y(nd.id)}px)` }}>
            <g className="pop-in">
              <rect className="shape" width={boxW} height={boxH} rx={10} />
              <line x1={boxW - 26} y1={6} x2={boxW - 26} y2={boxH - 6} style={{ stroke: 'var(--line-2)', strokeWidth: 1.5 }} />
              <text className="v-txt" x={(boxW - 26) / 2} y={boxH / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={fitFont(s, boxW - 26, 0.46)}>{s}</text>
              {isNull ? (
                <text x={boxW - 13} y={boxH / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={15} style={{ fill: 'var(--ink-3)' }}>∅</text>
              ) : (
                <circle cx={boxW - 13} cy={boxH / 2} r={4} style={{ fill: 'var(--ink-2)' }} />
              )}
            </g>
          </g>
        );
      })}
      {p.showNull && p.nodes.length > 0 && rows === 1 && (
        <text x={nullX} y={top + boxH / 2 + 1} dominantBaseline="central" fontSize={16} fontFamily="var(--f-code)" style={{ fill: 'var(--ink-3)' }}>null</text>
      )}
      {p.ptrs.map((pt) => {
        const g = ptrGroups[pt.node ?? '__null'];
        const k = g.indexOf(pt.name);
        const x = pt.node && exists.has(pt.node) ? X(pt.node) + (boxW - 26) / 2 : nullX + 18;
        const y = pt.node && exists.has(pt.node) ? Y(pt.node) + boxH + 8 : top + boxH + 8;
        return <PtrMark key={`p-${pt.name}`} name={pt.name} color={pt.color} x={x} y={y + k * 30} />;
      })}
    </Svg>
  );
}

/* ---------------- Trees ---------------- */
export function layoutTree(p: TreePanel) {
  const pos: Record<string, { x: number; d: number }> = {};
  let col = 0;
  let maxD = 0;
  const seen = new Set<string>();
  if (p.binary) {
    const walk = (id: string | null, d: number) => {
      if (!id || !p.nodes[id] || seen.has(id)) return;
      seen.add(id);
      const [l, r] = p.nodes[id].kids;
      walk(l, d + 1);
      pos[id] = { x: col++, d };
      maxD = Math.max(maxD, d);
      walk(r, d + 1);
    };
    for (const r of p.roots) {
      walk(r, 0);
      col += 0.6;
    }
  } else {
    const walk = (id: string, d: number): number => {
      seen.add(id);
      const kids = p.nodes[id].kids.filter((k): k is string => !!k && !!p.nodes[k] && !seen.has(k));
      maxD = Math.max(maxD, d);
      if (!kids.length) {
        pos[id] = { x: col++, d };
        return pos[id].x;
      }
      const xs = kids.map((k) => walk(k, d + 1));
      pos[id] = { x: (xs[0] + xs[xs.length - 1]) / 2, d };
      return pos[id].x;
    };
    for (const r of p.roots) if (p.nodes[r]) {
      walk(r, 0);
      col += 0.4;
    }
  }
  return { pos, cols: Math.max(1, col), maxD };
}

function TreeView({ p }: { p: TreePanel }) {
  const { pos, cols, maxD } = layoutTree(p);
  const nNodes = Object.keys(pos).length;
  const maxLeafLen = Math.max(1, ...Object.entries(p.nodes).filter(([id, nd]) => pos[id] && !nd.kids.some((k) => k && pos[k])).map(([, nd]) => String(nd.v).length));
  const colW = p.binary ? (nNodes > 20 ? 44 : 56) : Math.max(nNodes > 24 ? 50 : 70, maxLeafLen * 9.4 + 26);
  const levelH = maxD > 4 ? 70 : 84;
  const r = p.binary ? (nNodes > 20 ? 19 : 23) : nNodes > 24 ? 19 : 23;
  const W = Math.max(cols * colW + 40, 200);
  const H = (maxD + 1) * levelH + 60;
  const X = (id: string) => 20 + pos[id].x * colW + colW / 2;
  const Y = (id: string) => 30 + pos[id].d * levelH;
  const ptrByNode: Record<string, string[]> = {};
  for (const pt of p.ptrs) (ptrByNode[pt.node] ??= []).push(pt.name);

  const edges: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];
  for (const [id, nd] of Object.entries(p.nodes)) {
    if (!pos[id]) continue;
    nd.kids.forEach((k) => {
      if (!k || !pos[k]) return;
      const key = `${id}>${k}`;
      const d = `M${X(id)} ${Y(id)} L${X(k)} ${Y(k)}`;
      edges.push(<path key={key} className={`pth ${ec(p.edgeTones[key])}`} d={d} style={{ d: `path('${d}')` } as React.CSSProperties} />);
      const lab = p.edgeLabels?.[key];
      if (lab) {
        const mx = (X(id) + X(k)) / 2;
        const my = (Y(id) + Y(k)) / 2;
        labels.push(
          <g key={`el-${key}`}>
            <rect x={mx - 11} y={my - 11} width={22} height={22} rx={5} style={{ fill: 'var(--stage)', stroke: 'var(--line)' }} />
            <text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="central" fontSize={15} fontFamily="var(--f-code)" fontWeight={700} style={{ fill: 'var(--p2)' }}>{lab}</text>
          </g>,
        );
      }
    });
  }
  return (
    <Svg w={W} h={H} maxScale={1.4}>
      {edges}
      {labels}
      {Object.entries(p.nodes).map(([id, nd]) => {
        if (!pos[id]) return null;
        const s = fmt(nd.v);
        return (
          <g key={id} className={`mv ${tc(p.tones[id])}`} style={{ transform: `translate(${X(id)}px, ${Y(id)}px)` }}>
            <g className="pop-in">
              {s.length > 3 ? (
                <rect className="shape" x={-Math.max(r * 2, s.length * 9.4 + 18) / 2} y={-r} width={Math.max(r * 2, s.length * 9.4 + 18)} height={r * 2} rx={r * 0.55} />
              ) : (
                <circle className="shape" r={r} />
              )}
              <text className="v-txt" y={1} textAnchor="middle" dominantBaseline="central" fontSize={s.length > 3 ? 16 : fitFont(s, r * 2, 0.5)}>{s}</text>
            </g>
            {p.badges[id] && (
              <text x={(s.length > 3 ? Math.max(r * 2, s.length * 9.4 + 18) / 2 : r) + 4} y={-r + 2} fontSize={14} fontFamily="var(--f-code)" fontWeight={700} style={{ fill: 'var(--accent)' }}>{p.badges[id]}</text>
            )}
            {(ptrByNode[id] ?? []).map((name, k) => {
              const pt = p.ptrs.find((x) => x.name === name)!;
              return (
                <text key={name} className={`ptr-${pt.color ?? 3}`} y={r + 18 + k * 17} textAnchor="middle" fontSize={15} fontWeight={700} fontFamily="var(--f-code)">▲{name}</text>
              );
            })}
          </g>
        );
      })}
    </Svg>
  );
}

/* ---------------- Graph ---------------- */
function GraphView({ p }: { p: GraphPanel }) {
  const W = 640;
  const H = 400;
  const pad = 40;
  const r = p.nodes.length > 12 ? 19 : 23;
  const P = (id: string) => {
    const n = p.nodes.find((x) => x.id === id)!;
    return { x: pad + (n.x / 100) * (W - 2 * pad), y: pad + (n.y / 100) * (H - 2 * pad) };
  };
  const mid = safeId(`gr-${p.id}`);
  const has = (a: string, b: string) => p.edges.some((e) => e.a === a && e.b === b);
  const eTone = (a: string, b: string) => p.edgeTones[`${a}>${b}`] ?? (p.directed ? undefined : p.edgeTones[`${b}>${a}`]);
  return (
    <Svg w={W} h={H} maxScale={1.3} defs={<Markers id={mid} />}>
      {p.edges.map((e, i) => {
        const a = P(e.a);
        const b = P(e.b);
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const ux = (b.x - a.x) / len;
        const uy = (b.y - a.y) / len;
        const x1 = a.x + ux * r;
        const y1 = a.y + uy * r;
        const x2 = b.x - ux * (r + (p.directed ? 3 : 0));
        const y2 = b.y - uy * (r + (p.directed ? 3 : 0));
        const curved = p.directed && has(e.b, e.a);
        const nx = -uy * 26;
        const ny = ux * 26;
        const d = curved ? `M${x1} ${y1} Q${(x1 + x2) / 2 + nx} ${(y1 + y2) / 2 + ny} ${x2} ${y2}` : `M${x1} ${y1} L${x2} ${y2}`;
        const t = eTone(e.a, e.b);
        const mx = (a.x + b.x) / 2 + (curved ? nx * 0.55 : -uy * 12);
        const my = (a.y + b.y) / 2 + (curved ? ny * 0.55 : ux * 12);
        return (
          <g key={`e${i}`}>
            <path className={ec(t)} d={d} markerEnd={p.directed ? `url(#${mid}-${markerFor(t)})` : undefined} />
            {e.w !== undefined && (
              <g>
                <rect x={mx - 14} y={my - 11} width={28} height={22} rx={6} style={{ fill: 'var(--stage)' }} />
                <text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="central" fontSize={15} fontFamily="var(--f-code)" fontWeight={600} style={{ fill: 'var(--ink-2)' }}>{e.w}</text>
              </g>
            )}
          </g>
        );
      })}
      {p.nodes.map((n) => {
        const { x, y } = P(n.id);
        return (
          <g key={n.id} className={tc(p.tones[n.id])} transform={`translate(${x}, ${y})`}>
            <circle className="shape" r={r} />
            <text className="v-txt" y={1} textAnchor="middle" dominantBaseline="central" fontSize={fitFont(n.label, r * 2, 0.5)}>{n.label}</text>
            {p.badges[n.id] && (
              <g>
                <rect x={-24} y={-r - 28} width={48} height={22} rx={6} style={{ fill: 'var(--accent-soft)', stroke: 'var(--accent)', strokeWidth: 1.2 }} />
                <text y={-r - 16} textAnchor="middle" dominantBaseline="central" fontSize={14} fontFamily="var(--f-code)" fontWeight={700} style={{ fill: 'var(--accent)' }}>{p.badges[n.id]}</text>
              </g>
            )}
          </g>
        );
      })}
    </Svg>
  );
}

/* ---------------- Stack & queue ---------------- */
function SeqView({ p }: { p: StackPanel }) {
  const n = p.items.length;
  if (p.kind === 'stack') {
    const slots = Math.max(5, n);
    const bw = 172;
    const bh = slots > 8 ? 34 : 42;
    const gap = 6;
    const H = slots * (bh + gap) + 40;
    const W = bw + 110;
    const y = (i: number) => H - 20 - (i + 1) * (bh + gap);
    return (
      <Svg w={W} h={H} maxScale={1.2}>
        <path d={`M20 20 V${H - 14} H${20 + bw + 16} V20`} style={{ fill: 'none', stroke: 'var(--line-2)', strokeWidth: 3 }} />
        {p.items.map((it, i) => {
          const s = fmt(it.v);
          return (
            <g key={it.k} className={`mv ${tc(p.tones[i])}`} style={{ transform: `translate(28px, ${y(i)}px)` }}>
              <g className="pop-in">
                <rect className="shape" width={bw} height={bh} rx={8} />
                <text className="v-txt" x={bw / 2} y={bh / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={fitFont(s, bw, 0.12)}>{s}</text>
              </g>
            </g>
          );
        })}
        {n > 0 && (
          <g className="mv ptr-1" style={{ transform: `translate(${bw + 46}px, ${y(n - 1) + bh / 2}px)` }}>
            <text x={4} y={1} dominantBaseline="central" fontSize={15} fontWeight={700} fontFamily="var(--f-code)">◀ {p.ends?.[0] ?? 'top'}</text>
          </g>
        )}
        {n === 0 && <text x={20 + bw / 2 + 8} y={H - 40} textAnchor="middle" className="i-txt" fontSize={15}>empty</text>}
      </Svg>
    );
  }
  const slots = Math.max(4, n);
  const bw = slots > 10 ? 50 : 62;
  const gap = 6;
  const W = slots * (bw + gap) + 40;
  const H = 130;
  const x = (i: number) => 20 + i * (bw + gap);
  return (
    <Svg w={W} h={H} maxScale={1.2}>
      <path d={`M12 34 H${W - 12} M12 ${34 + bw + 16} H${W - 12}`} style={{ fill: 'none', stroke: 'var(--line-2)', strokeWidth: 3 }} />
      {p.items.map((it, i) => {
        const s = fmt(it.v);
        return (
          <g key={it.k} className={`mv ${tc(p.tones[i])}`} style={{ transform: `translate(${x(i)}px, 42px)` }}>
            <g className="pop-in">
              <rect className="shape" width={bw} height={bw} rx={8} />
              <text className="v-txt" x={bw / 2} y={bw / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={fitFont(s, bw)}>{s}</text>
            </g>
          </g>
        );
      })}
      {n > 0 && (
        <>
          <text className="ptr-1" x={x(0) + bw / 2} y={22} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="var(--f-code)">{p.ends?.[0] ?? 'front'}</text>
          <text className="ptr-2" x={x(n - 1) + bw / 2} y={42 + bw + 38} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="var(--f-code)">{p.ends?.[1] ?? 'back'}</text>
        </>
      )}
      {n === 0 && <text x={W / 2} y={42 + bw / 2} textAnchor="middle" dominantBaseline="central" className="i-txt" fontSize={15}>empty</text>}
    </Svg>
  );
}

/* ---------------- Hash map / set ---------------- */
function MapView({ p }: { p: MapPanel }) {
  if (!p.entries.length) return <div className="mp-empty">{p.set ? '{ }' : '{ } empty'}</div>;
  if (p.set)
    return (
      <div className="mp-set">
        {p.entries.map((e) => (
          <span key={e.k} className={`h-tn tn-${p.tones[e.k] ?? 'none'} fade-in`}>{e.k}</span>
        ))}
      </div>
    );
  return (
    <div className="mp">
      {p.entries.map((e) => (
        <div key={e.k} className="mp-row fade-in">
          <span className={`h-tn tn-${p.tones[e.k] ?? 'none'}`}>{e.k}</span>
          <span className="ar">→</span>
          <span className={`h-tn tn-${p.tones[e.k] ?? 'none'}`}>{e.v}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Heap (tree + array) ---------------- */
function HeapView({ p }: { p: HeapPanel }) {
  const n = p.items.length;
  const depth = n ? Math.floor(Math.log2(n)) : 0;
  const leafSlots = 2 ** depth;
  const colW = 54;
  const levelH = 70;
  const r = 22;
  const treeW = Math.max(leafSlots * colW, 320);
  const cw = 44;
  const arrW = Math.max(n, 1) * (cw + 4);
  const W = Math.max(treeW, arrW) + 40;
  const treeH = (depth + 1) * levelH + 10;
  const H = treeH + cw + 50;
  const pos = (i: number) => {
    const d = Math.floor(Math.log2(i + 1));
    const idxInLevel = i + 1 - 2 ** d;
    const slots = 2 ** d;
    const x = 20 + ((idxInLevel + 0.5) / slots) * (W - 40);
    return { x, y: 30 + d * levelH };
  };
  const ax = (i: number) => (W - arrW) / 2 + i * (cw + 4);
  return (
    <Svg w={W} h={H} maxScale={1.3}>
      {p.items.map((_, i) => {
        if (i === 0) return null;
        const a = pos((i - 1) >> 1);
        const b = pos(i);
        return <path key={`e${i}`} className="edge" d={`M${a.x} ${a.y} L${b.x} ${b.y}`} />;
      })}
      {p.items.map((it, i) => {
        const { x, y } = pos(i);
        const s = fmt(it.v);
        return (
          <g key={`n${it.k}`} className={`mv ${tc(p.tones[i])}`} style={{ transform: `translate(${x}px, ${y}px)` }}>
            <circle className="shape" r={r} />
            <text className="v-txt" y={1} textAnchor="middle" dominantBaseline="central" fontSize={fitFont(s, r * 2, 0.5)}>{s}</text>
          </g>
        );
      })}
      {p.items.map((it, i) => {
        const s = fmt(it.v);
        return (
          <g key={`a${it.k}`} className={`mv ${tc(p.tones[i])}`} style={{ transform: `translate(${ax(i)}px, ${treeH + 16}px)` }}>
            <rect className="shape" width={cw} height={cw} rx={7} />
            <text className="v-txt" x={cw / 2} y={cw / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={fitFont(s, cw)}>{s}</text>
            <text className="i-txt" x={cw / 2} y={cw + 16} textAnchor="middle" fontSize={11}>{i}</text>
          </g>
        );
      })}
      {n === 0 && <text x={W / 2} y={60} textAnchor="middle" className="i-txt" fontSize={16}>empty heap</text>}
    </Svg>
  );
}

/* ---------------- Complexity chart ---------------- */
const CURVES: Record<string, { fn: (n: number) => number; label: string }> = {
  '1': { fn: () => 1, label: 'O(1)' },
  logn: { fn: (n) => Math.log2(Math.max(n, 1)), label: 'O(log n)' },
  sqrtn: { fn: (n) => Math.sqrt(n), label: 'O(√n)' },
  n: { fn: (n) => n, label: 'O(n)' },
  nlogn: { fn: (n) => n * Math.log2(Math.max(n, 1)), label: 'O(n log n)' },
  n2: { fn: (n) => n * n, label: 'O(n²)' },
  n3: { fn: (n) => n * n * n, label: 'O(n³)' },
  '2n': { fn: (n) => 2 ** n, label: 'O(2ⁿ)' },
  nfact: { fn: (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }, label: 'O(n!)' },
};
const CURVE_COLORS = ['var(--optimal)', 'var(--accent)', 'var(--p2)', 'var(--better)', 'var(--brute)', '#c2410c', 'var(--ink-3)'];

function ChartView({ p }: { p: ChartPanel }) {
  const W = 680;
  const H = 400;
  const L = 56;
  const B = 44;
  const T = 16;
  const Rr = 110;
  const px = (x: number) => L + (x / p.xMax) * (W - L - Rr);
  const py = (y: number) => H - B - (Math.min(y, p.yMax) / p.yMax) * (H - B - T);
  return (
    <Svg w={W} h={H} maxScale={1.25}>
      <line x1={L} y1={H - B} x2={W - Rr + 10} y2={H - B} style={{ stroke: 'var(--ink-3)', strokeWidth: 2 }} />
      <line x1={L} y1={H - B} x2={L} y2={T - 4} style={{ stroke: 'var(--ink-3)', strokeWidth: 2 }} />
      <text x={(L + W - Rr) / 2} y={H - 8} textAnchor="middle" className="l-txt" fontSize={15}>input size n →</text>
      <text x={16} y={(H - B) / 2} textAnchor="middle" className="l-txt" fontSize={15} transform={`rotate(-90 16 ${(H - B) / 2})`}>operations →</text>
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <text x={px(f * p.xMax)} y={H - B + 20} textAnchor="middle" className="i-txt" fontSize={13}>{Math.round(f * p.xMax)}</text>
          <text x={L - 8} y={py(f * p.yMax) + 4} textAnchor="end" className="i-txt" fontSize={13}>{Math.round(f * p.yMax)}</text>
        </g>
      ))}
      {p.curves.map((c, ci) => {
        const def = CURVES[c.f];
        if (!def) return null;
        const pts: string[] = [];
        let lastX = 0;
        let lastY = 0;
        for (let i = 0; i <= 120; i++) {
          const x = (i / 120) * p.xMax;
          const y = def.fn(Math.max(x, 0.0001));
          pts.push(`${i ? 'L' : 'M'}${px(x).toFixed(1)} ${py(y).toFixed(1)}`);
          lastX = px(x);
          lastY = py(y);
          if (y >= p.yMax) break;
        }
        const color = c.tone === 'bad' ? 'var(--brute)' : c.tone === 'ok' ? 'var(--optimal)' : c.tone === 'warn' ? 'var(--better)' : CURVE_COLORS[ci % CURVE_COLORS.length];
        const dim = p.highlight && p.highlight !== c.f;
        return (
          <g key={c.f} style={{ opacity: dim ? 0.22 : 1, transition: 'opacity .4s' }} className="fade-in">
            <path d={pts.join(' ')} style={{ fill: 'none', stroke: color, strokeWidth: p.highlight === c.f ? 5 : 3.2, strokeLinecap: 'round' }} />
            <text x={Math.min(lastX + 6, W - Rr + 14)} y={Math.max(lastY, T + 8)} fontSize={15} fontWeight={700} fontFamily="var(--f-code)" dominantBaseline="central" style={{ fill: color }}>{c.label ?? def.label}</text>
          </g>
        );
      })}
      {p.marker !== undefined && (
        <g>
          <line x1={px(p.marker)} y1={T} x2={px(p.marker)} y2={H - B} style={{ stroke: 'var(--ink-2)', strokeWidth: 1.5, strokeDasharray: '5 4' }} />
          <text x={px(p.marker) + 6} y={T + 12} fontSize={14} fontFamily="var(--f-code)" style={{ fill: 'var(--ink-2)' }}>n = {p.marker}</text>
        </g>
      )}
    </Svg>
  );
}

/* ---------------- Bars ---------------- */
function BarsView({ p }: { p: BarsPanel }) {
  const W = 680;
  const rowH = 46;
  const H = p.bars.length * rowH + 10;
  const labW = Math.max(...p.bars.map((b) => b.label.length)) * 10 + 20;
  const maxV = Math.max(1, ...p.bars.map((b) => b.value));
  const scale = (v: number) => (p.log ? Math.log10(Math.max(v, 1)) / Math.log10(Math.max(maxV, 10)) : v / maxV);
  const barMax = W - labW - 150;
  return (
    <Svg w={W} h={H} maxScale={1.25}>
      {p.bars.map((b, i) => {
        const w = Math.max(3, scale(b.value) * barMax);
        const color = b.tone === 'ok' ? 'var(--optimal)' : b.tone === 'bad' ? 'var(--brute)' : b.tone === 'warn' ? 'var(--better)' : b.tone === 'path' ? 'var(--p2)' : 'var(--accent)';
        return (
          <g key={b.label} transform={`translate(0, ${i * rowH + 6})`}>
            <text x={labW - 12} y={17} textAnchor="end" dominantBaseline="central" fontSize={16} fontFamily="var(--f-code)" style={{ fill: 'var(--ink-2)' }}>{b.label}</text>
            <rect x={labW} y={2} height={30} rx={6} width={w} style={{ fill: color, fillOpacity: 0.85, width: w, transition: 'width .6s cubic-bezier(.4,.1,.2,1)' } as React.CSSProperties} />
            <text x={labW + w + 10} y={17} dominantBaseline="central" fontSize={16} fontFamily="var(--f-code)" fontWeight={600} style={{ fill: 'var(--ink)', transition: 'x .6s' }}>{b.text ?? b.value.toLocaleString('en-US')}</text>
          </g>
        );
      })}
    </Svg>
  );
}

/* ---------------- Text, table, bits, vars ---------------- */
function TextView({ p }: { p: TextPanel }) {
  const shown = p.shown ?? p.lines.length;
  return (
    <div className={`tx${p.big ? ' big' : ''}${p.mono ? ' mono' : ''}`}>
      {p.title && <h3>{inline(p.title)}</h3>}
      {p.subtitle && <p className="sub">{inline(p.subtitle)}</p>}
      {p.lines.length > 0 && (
        <ul>
          {p.lines.map((l, i) => (
            <li key={i} className={`${i >= shown ? 'hid ' : ''}tn-${p.tones?.[i] ?? 'none'}`}>{inline(l)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TableView({ p }: { p: TablePanel }) {
  return (
    <table className="tb">
      <thead>
        <tr>{p.head.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {p.rows.map((row, r) => (
          <tr key={r} className={`tn-${p.tones[r] ?? 'none'}`}>
            {row.map((c, ci) => (
              <td key={ci} className={`${ci > 0 ? 'mono ' : ''}tn-${p.cellTones?.[`${r},${ci}`] ?? 'none'}`}>{inline(c)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BitsView({ p }: { p: BitsPanel }) {
  return (
    <div className="bt">
      {p.rows.map((row, ri) => (
        <div className="bt-row" key={ri}>
          <span className="bt-lab">{row.label}</span>
          <span className="bt-bits">
            {row.bits.split('').map((b, i) => (
              <span key={i} className={`bt-bit h-tn tn-${row.tones?.[i] ?? 'none'}`}>{b}</span>
            ))}
          </span>
          {row.note && <span className="bt-note">{row.note}</span>}
        </div>
      ))}
    </div>
  );
}

function VarsView({ p }: { p: VarsPanel }) {
  return (
    <div className="st-vars">
      {p.vars.map((v) => (
        <span key={v.name} className={`st-var h-tn tn-${v.tone ?? 'none'}`}>
          <b>{v.name}</b>
          {v.value}
        </span>
      ))}
    </div>
  );
}

/* ---------------- Intervals ---------------- */
function IntervalsView({ p }: { p: IntervalsPanel }) {
  const W = 720;
  const rows = Math.max(1, ...p.items.map((i) => (i.row ?? 0) + 1));
  const rowH = 38;
  const H = rows * rowH + 60;
  const L = 30;
  const Rr = 30;
  const span = Math.max(1, p.max - p.min);
  const X = (v: number) => L + ((v - p.min) / span) * (W - L - Rr);
  const ticks: number[] = [];
  const step = span <= 12 ? 1 : span <= 30 ? 2 : span <= 60 ? 5 : Math.ceil(span / 12);
  for (let t = p.min; t <= p.max; t += step) ticks.push(t);
  return (
    <Svg w={W} h={H} maxScale={1.25}>
      <line x1={L} y1={H - 30} x2={W - Rr} y2={H - 30} style={{ stroke: 'var(--ink-3)', strokeWidth: 1.5 }} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={X(t)} y1={H - 34} x2={X(t)} y2={H - 26} style={{ stroke: 'var(--ink-3)' }} />
          <text x={X(t)} y={H - 10} textAnchor="middle" className="i-txt" fontSize={12}>{t}</text>
        </g>
      ))}
      {p.items.map((it) => {
        const x1 = X(it.s);
        const x2 = X(it.e);
        return (
          <g key={it.k} className={`mv ${tc(p.tones[it.k])}`} style={{ transform: `translate(0px, ${10 + (it.row ?? 0) * rowH}px)` }}>
            <path className="shape pth" d={`M${x1} 0 H${Math.max(x2, x1 + 4)} V26 H${x1} Z`} style={{ d: `path('M${x1} 0 H${Math.max(x2, x1 + 4)} V26 H${x1} Z')` } as React.CSSProperties} />
            <text className="v-txt" x={(x1 + Math.max(x2, x1 + 4)) / 2} y={14} textAnchor="middle" dominantBaseline="central" fontSize={13}>{it.text}</text>
          </g>
        );
      })}
      {p.cursor !== null && p.cursor !== undefined && (
        <line className="mv" x1={0} x2={0} y1={0} y2={H - 30} style={{ transform: `translateX(${X(p.cursor)}px)`, stroke: 'var(--accent)', strokeWidth: 2.5, strokeDasharray: '6 4' }} />
      )}
    </Svg>
  );
}

/* ---------------- dispatcher ---------------- */
export function PanelView({ p }: { p: Panel }) {
  switch (p.kind) {
    case 'array': return <ArrayView p={p} />;
    case 'grid': return <GridView p={p} />;
    case 'list': return <ListView p={p} />;
    case 'tree': return <TreeView p={p} />;
    case 'graph': return <GraphView p={p} />;
    case 'stack': case 'queue': return <SeqView p={p} />;
    case 'map': return <MapView p={p} />;
    case 'heap': return <HeapView p={p} />;
    case 'chart': return <ChartView p={p} />;
    case 'bars': return <BarsView p={p} />;
    case 'text': return <TextView p={p} />;
    case 'table': return <TableView p={p} />;
    case 'bits': return <BitsView p={p} />;
    case 'intervals': return <IntervalsView p={p} />;
    case 'vars': return <VarsView p={p} />;
  }
}

/** Relative share of the visual area each panel kind asks for. */
export function panelGrow(p: Panel): number {
  switch (p.kind) {
    case 'vars': case 'bits': return 0;
    case 'map': case 'stack': case 'table': return 1;
    case 'queue': return 1.3;
    case 'text': return p.big ? 3 : 1;
    case 'tree': case 'graph': case 'grid': case 'heap': case 'chart': return 2.2;
    default: return 1.4;
  }
}
