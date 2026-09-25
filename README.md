# DryRun: learn DSA by patterns

A pattern-based data structures and algorithms course. Every concept and every problem has an
animated, narrated explainer video that runs the real algorithm on a real input, going from
brute force to optimal and explaining why each step is needed. Solutions come in Java, Python and C++.

- **Foundations**: problem-solving playbook, time and space complexity, recursion, math, sorting.
- **Data structures**: each one with a real-life picture, operation costs and when to use it.
- **Patterns**: two pointers through dynamic programming, graphs and advanced topics, in an order where each builds on the last.
- **Roadmaps**: 2, 3, 4, 5, 6 and 12-month plans generated from the curriculum.
- **Progress** is stored in the browser (localStorage) with export/import.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ (works from any folder or static host)
```

## Checks

```bash
npm run verify                 # curriculum, every video, every solution in Java/Python/C++
npm run verify -- --only 3sum  # one or more problems (comma separated)
npm run verify -- --module two-pointers
npm run build && npm run smoke # opens every page in Chromium and steps through every video
npx tsx scripts/frames.ts /problem/3sum every:5   # screenshots of video frames for review
```

`verify` generates a driver for each language from the problem's judge spec, compiles and runs
every approach against fixed tests, seeded random tests checked against a reference
implementation, and the exact example used in the video.

## How content is organised

```
src/content/curriculum.ts          order of parts, modules and problems (single source of truth)
src/content/lessons/<slug>.ts      concept lessons: video script + article + quiz
src/content/problems/<module>/<slug>.ts   problem walkthroughs: statement, hints, approaches, video, judge
solutions/<slug>/<approach>.{java,py,cpp} solution code shown on the site and executed by verify
src/engine/                        video engine: builder DSL, panels, stage, player, narration
```

Videos are written with a small builder: mutate panels (arrays, grids, lists, trees, graphs,
stacks, heaps, charts…) and call `say()` to snapshot a narrated frame. The player animates between frames.

## Narration

Narration uses the browser's speech engine and picks the most natural voice available
(Edge and Chrome ship neural voices). Captions highlight each word as it's spoken.
