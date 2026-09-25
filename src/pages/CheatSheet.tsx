import { Link } from 'react-router-dom';
import { MODULES } from '../content/curriculum';

const CONSTRAINTS: [string, string, string][] = [
  ['n ≤ 10', 'O(n!) or O(2ⁿ · n)', 'Permutations, brute-force search'],
  ['n ≤ 20', 'O(2ⁿ)', 'Subsets, bitmask DP, backtracking'],
  ['n ≤ 500', 'O(n³)', 'Interval DP, Floyd-Warshall'],
  ['n ≤ 5,000', 'O(n²)', '2D DP, nested loops over pairs'],
  ['n ≤ 10⁶', 'O(n log n) or O(n)', 'Sorting, heaps, binary search, two pointers, sliding window, hashing'],
  ['n ≤ 10⁹ or more', 'O(log n) or O(1)', 'Binary search on the answer, math'],
];

export function CheatSheetPage() {
  const withSignals = MODULES.filter((m) => m.signals?.length);
  return (
    <>
      <div className="page-head">
        <div>
          <span className="label">Pattern finder</span>
          <h1>Read the problem, spot the pattern</h1>
          <p>Interviewers rarely say “use a sliding window”. They describe a situation. This page maps the situations to the techniques, and the input size to the complexity you should aim for.</p>
        </div>
      </div>
      <section>
        <div className="section-title"><h2>Input size tells you the target complexity</h2></div>
        <div className="table-wrap">
          <table className="cheat">
            <thead><tr><th>Constraint</th><th>Aim for</th><th>Usually means</th></tr></thead>
            <tbody>
              {CONSTRAINTS.map(([a, b, c]) => (
                <tr key={a}><td><code>{a}</code></td><td><code>{b}</code></td><td>{c}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted" style={{ fontSize: 14 }}>Rule of thumb: about 10⁸ simple operations run in one second.</p>
      </section>
      <section className="block">
        <div className="section-title"><h2>Signals → pattern</h2></div>
        <div className="table-wrap">
          <table className="cheat">
            <thead><tr><th>If the problem says…</th><th>Try</th></tr></thead>
            <tbody>
              {withSignals.map((m) => (
                <tr key={m.id}>
                  <td><ul>{m.signals!.map((s) => <li key={s}>{s}</li>)}</ul></td>
                  <td style={{ minWidth: 200 }}>
                    <Link to={`/learn/${m.id}`}>{m.title}</Link>
                    <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{m.blurb}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
