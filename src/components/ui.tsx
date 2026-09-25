import type { Difficulty, Tier } from '../content/types';

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 26) / 30} viewBox="0 0 30 26" aria-hidden="true">
      <rect x="1" y="1" width="8" height="8" rx="2" fill="var(--accent)" />
      <rect x="11" y="1" width="8" height="8" rx="2" fill="var(--line-2)" />
      <rect x="21" y="1" width="8" height="8" rx="2" fill="var(--p2)" />
      <path d="M5 14 l4 6 h-8z" fill="var(--accent)" />
      <path d="M25 14 l4 6 h-8z" fill="var(--p2)" />
    </svg>
  );
}

export const DiffPill = ({ d, sm }: { d: Difficulty; sm?: boolean }) => <span className={`pill ${d.toLowerCase()}${sm ? ' sm' : ''}`}>{d}</span>;

const TIER_LABEL: Record<Tier, string> = { core: 'Core', practice: 'Practice', challenge: 'Challenge' };
export const TierPill = ({ t, sm }: { t: Tier; sm?: boolean }) => <span className={`pill ${t}${sm ? ' sm' : ''}`}>{TIER_LABEL[t]}</span>;

export function Check({ on, onClick, label }: { on: boolean; onClick?: () => void; label: string }) {
  return (
    <button type="button" className={`check${on ? ' on' : ''}`} onClick={onClick} aria-pressed={on} aria-label={label} title={label}>
      <svg viewBox="0 0 12 12" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 6.3l2.3 2.3 4.7-5" />
      </svg>
    </button>
  );
}

export const Bar = ({ value, total }: { value: number; total: number }) => (
  <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={total}>
    <i style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
  </div>
);

export function Ring({ value, total, size = 58 }: { value: number; total: number; size?: number }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  const f = total ? value / total : 0;
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--optimal)" strokeWidth={6} strokeDasharray={`${c * f} ${c}`} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize={size * 0.24} fontWeight={700} fill="var(--ink)" fontFamily="var(--f-ui)">{Math.round(f * 100)}%</text>
    </svg>
  );
}

export const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 1.8v12.4L14 8z" fill="currentColor" /></svg>
);

export const lcUrl = (slug: string) => `https://leetcode.com/problems/${slug}/`;
