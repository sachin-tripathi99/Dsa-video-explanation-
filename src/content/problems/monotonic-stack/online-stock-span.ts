import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const P = [100, 80, 60, 70, 60, 75, 85];
function spans(p: number[]) { const st: [number, number][] = []; return p.map((x) => { let s = 1; while (st.length && st[st.length - 1][0] <= x) s += st.pop()![1]; st.push([x, s]); return s; }); }

function video() {
  const v = new Video('online-stock-span', 'Online Stock Span');
  v.chapter('intro', 'The problem');
  v.array('p', P, { label: 'prices arrive one per day', bars: true });
  v.say('Prices arrive one day at a time. For each new price, return its span: how many consecutive days, ending today, the price was less than or equal to today’s price.');
  v.eq(`spans: [${spans(P).join(', ')}]`);

  v.chapter('brute', 'Brute force: walk back through history', { cx: 'O(n) per call', code: ['next(price): store price; count backwards while prices ≤ price'] });
  v.eq('a rising market makes each call walk back through everything', 'warn').say('Walking back day by day works, but in a steadily rising market every call walks back through the whole history: n squared overall.');

  v.chapter('optimal', 'Optimal: stack of (price, span), merging spans', { cx: 'O(1) amortised per call', code: ['span = 1', 'while stack and stack.top.price <= price:', '  span += stack.pop().span        # absorb its whole span', 'push (price, span); return span'] });
  v.clear();
  const a = v.array('p', P, { label: 'prices', bars: true });
  const out = v.array('s', P.map(() => null), { label: 'span' });
  const st = v.stack('st', [], { label: '(price, span)' });
  const stack: [number, number][] = [];
  let told = 0;
  v.say('Keep a stack of earlier prices together with their spans, in decreasing price order. When today’s price is at least the top price, today’s span swallows the top’s entire span, because every day inside that span was even lower.');
  P.forEach((x, i) => {
    a.clearTones().tone(i, 'active');
    let s = 1;
    const eaten: number[] = [];
    while (stack.length && stack[stack.length - 1][0] <= x) { const [pp, sp] = stack.pop()!; st.pop(); s += sp; eaten.push(pp); }
    stack.push([x, s]);
    st.push(`(${x}, ${s})`);
    out.set(i, s).tone(i, 'ok');
    for (let k = i - s + 1; k < i; k++) a.tone(k, 'win');
    v.line(eaten.length ? 2 : 3).eq(eaten.length ? `${x}: absorb ${eaten.join(', ')} → span ${s}` : `${x}: nothing below → span 1`);
    if (eaten.length >= 2 && told === 0) { v.say(`Price ${words(x)} absorbs ${eaten.map(words).join(' and ')}, together with the days hidden inside their spans. The span is ${words(s)}.`); told++; }
    else v.hold(700);
  });
  a.clearTones();
  v.eq('each price is pushed once and popped once → O(1) amortised', 'ok').say('Every price enters the stack once and leaves at most once, so over many calls each call costs constant time on average.');

  recap(v, [{ name: 'Walk back through history', time: 'O(n) per call', space: 'O(n)' }, { name: 'Stack with merged spans', time: 'O(1) amortised', space: 'O(n)' }], 'Absorb the spans of lower previous prices.', ['Previous greater, online → monotonic stack storing counts'], 'Store what you learned about popped elements, here their spans, so you never look at them again.');
  return v.build();
}

const problem: Problem = {
  slug: 'online-stock-span',
  statement: 'Design `StockSpanner`, which collects daily price quotes and returns the span of the stock’s price for the current day: the maximum number of consecutive days (starting from today and going backward) for which the price was less than or equal to today’s price.',
  examples: [{ input: '["StockSpanner","next","next","next","next","next","next","next"]\n[[],[100],[80],[60],[70],[60],[75],[85]]', output: '[null,1,1,1,2,1,4,6]' }],
  constraints: ['1 ≤ price ≤ 10⁵', 'at most 10⁴ calls'],
  hints: ['A lower previous price is “covered” forever by today’s price.', 'Store spans alongside prices.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Walk back', idea: 'Keep all prices; count backwards while ≤ price.', time: 'O(n) per call', space: 'O(n)', bottleneck: 'Long walks.' },
    { id: 'optimal', kind: 'optimal', name: 'Stack of (price, span)', idea: 'Pop while top price ≤ price, adding their spans; push (price, span).', time: 'O(1) amortised', space: 'O(n)' },
  ],
  takeaway: 'Monotonic stack that **stores counts** of what it popped.',
  video,
  judge: {
    type: 'design', cls: 'StockSpanner', ctor: [],
    methods: { next: { params: ['int'], ret: 'int' } },
    tests: [{ ops: ['StockSpanner', 'next', 'next', 'next', 'next', 'next', 'next', 'next'], args: [[], [100], [80], [60], [70], [60], [75], [85]], out: [null, 1, 1, 1, 2, 1, 4, 6] }],
    gen: (r: Rng) => { const ops = ['StockSpanner']; const args: unknown[][] = [[]]; for (let k = 0; k < 15; k++) { ops.push('next'); args.push([r.int(1, 10)]); } return { ops, args }; },
    ref: (ops, args) => { const ps: number[] = []; return ops.map((op, i) => { if (op === 'StockSpanner') return null; ps.push(args[i][0] as number); return spans(ps)[ps.length - 1]; }); },
  },
};

export default problem;
