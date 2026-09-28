import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { layered, kahnViz, andList } from '../../topoviz';

const RECIPES = ['bread', 'sandwich', 'burger', 'cake', 'pie'];
const ING = [['yeast', 'flour'], ['bread', 'meat'], ['sandwich', 'meat', 'bread'], ['flour', 'sugar'], ['cake', 'flour']];
const SUP = ['yeast', 'flour', 'meat'];
const EMOJI: Record<string, string> = { yeast: '🫙', flour: '🌾', meat: '🥩', sugar: '🍬', bread: '🍞', sandwich: '🥪', burger: '🍔', cake: '🎂', pie: '🥧' };

function cook(recipes: string[], ing: string[][], sup: string[]) {
  const need = new Map<string, number>(); const users = new Map<string, number[]>();
  recipes.forEach((r, i) => { need.set(r, ing[i].length); ing[i].forEach((x) => users.set(x, [...(users.get(x) ?? []), i])); });
  const q = [...sup]; const made: string[] = [];
  for (let k = 0; k < q.length; k++) for (const i of users.get(q[k]) ?? []) { const r = recipes[i]; need.set(r, need.get(r)! - 1); if (need.get(r) === 0) { made.push(r); q.push(r); } }
  return made;
}

function video() {
  const v = new Video('find-all-possible-recipes-from-given-supplies', 'Find All Possible Recipes from Given Supplies');
  const names = [...new Set([...SUP, ...ING.flat(), ...RECIPES])];
  const idx = new Map(names.map((x, i) => [x, i]));
  const n = names.length;
  const E: [number, number][] = RECIPES.flatMap((r, i) => ING[i].map((x) => [idx.get(x)!, idx.get(r)!] as [number, number]));
  const nodes = layered(n, E, { label: (i) => EMOJI[names[i]] ?? names[i][0], sub: (i) => names[i] });
  const edges = E.map(([a, b]) => ({ a: String(a), b: String(b) }));
  const adj = Array.from({ length: n }, () => [] as number[]);
  E.forEach(([a, b]) => adj[a].push(b));
  const made = cook(RECIPES, ING, SUP);
  const missing = names.filter((x) => !SUP.includes(x) && !RECIPES.includes(x));

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'ingredient → recipe that uses it', directed: true });
  v.say('You have some basic supplies, unlimited amounts of each. Each recipe needs a list of ingredients, and an ingredient can itself be another recipe. Which recipes can you make?');
  v.eq(`supplies: ${SUP.join(', ')} → can make: ${made.join(', ')}`);
  v.say(`Draw an arrow from each ingredient to each recipe that uses it. A recipe can be made once everything pointing into it is available. Notice ${andList(missing)}: nobody supplies it and no recipe makes it.`);

  v.chapter('brute', 'Brute force: keep sweeping the recipe list', { cx: 'O(R · (R + I))', code: ['have = set(supplies)', 'repeat until nothing changes:', '  for each recipe not made: if all ingredients in have → make it'] });
  v.eq('a sweep may unlock only one recipe', 'bad').say('Sweep over all recipes, making any whose ingredients you have, and repeat until a sweep makes nothing new. A long chain of recipes can need one full sweep per recipe.');

  v.chapter('optimal', 'Kahn’s algorithm with supplies as the start', { cx: 'O(R + I + S)', code: ['need[r] = # ingredients of r', 'queue = all supplies', 'pop x: each recipe using x: need--, 0 → made, queue', 'return made recipes'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = ingredients still missing', directed: true });
  const seed = SUP.map((x) => idx.get(x)!);
  missing.forEach((x) => g.tone(String(idx.get(x)), 'bad'));
  v.say('Treat it as a dependency graph. Each recipe counts how many ingredients it still needs. The queue starts with the supplies, not with every node that has no arrows in: an unsupplied ingredient has none either, but we do not have it.');
  kahnViz(v, g, n, adj, {
    name: (i) => names[i],
    seed,
    zeroBadge: false,
    lines: { init: [0, 1], pop: [2], done: [3] },
    badge: (d) => `need ${d}`,
    unit: ['ingredient', 'ingredients'],
    queueName: 'available',
    orderLabel: 'used',
    sayInit: `Each recipe starts with its ingredient count. The queue holds the supplies: ${andList(SUP)}.`,
    popSay: (i) => (RECIPES.includes(names[i]) ? `${names[i][0].toUpperCase()}${names[i].slice(1)} is made, so it is now an ingredient too.` : `${names[i][0].toUpperCase()}${names[i].slice(1)} is available.`),
    leafEq: 'used by nothing',
    leafSay: 'No recipe uses it.',
    finalOk: true,
    finalEq: () => `made: ${made.join(', ')}`,
    finalSay: (o, stuck) => `The queue is empty. We made ${andList(made)}. ${cap(andList(stuck.filter((i) => RECIPES.includes(names[i])).map((i) => names[i])))} never reached zero, because ${andList(missing)} is never available. Only recipes are returned, not supplies.`,
  });
  v.answer(made);

  recap(v, [{ name: 'Sweep until stable', time: 'O(R · (R + I))', space: 'O(R + S)' }, { name: 'Kahn from the supplies', time: 'O(R + I + S)', space: 'O(R + I + S)' }], 'Start the queue with what you actually have.', ['Items built from other items → dependency graph, Kahn from the raw materials'], 'Unavailable sources simply never enter the queue.');
  return v.build();
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const WORDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const problem: Problem = {
  slug: 'find-all-possible-recipes-from-given-supplies',
  statement: 'You have `n` recipes. `recipes[i]` can be made if you have every ingredient in `ingredients[i]`; an ingredient may itself be a recipe. You start with an infinite amount of every item in `supplies`. Return all recipes you can create, in any order.',
  examples: [{ input: 'recipes = ["bread"], ingredients = [["yeast","flour"]], supplies = ["yeast","flour","corn"]', output: '["bread"]' }, { input: 'recipes = ["bread","sandwich","burger"], ingredients = [["yeast","flour"],["bread","meat"],["sandwich","meat","bread"]], supplies = ["yeast","flour","meat"]', output: '["bread","sandwich","burger"]' }],
  constraints: ['1 ≤ n ≤ 100', 'recipes, supplies and ingredient names are distinct lowercase strings', 'a recipe never lists itself'],
  hints: ['Draw ingredient → recipe arrows.', 'Seed the queue with the supplies.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sweep until stable', idea: 'Repeatedly make any recipe whose ingredients are all available.', time: 'O(R · (R + I))', space: 'O(R + S)', bottleneck: 'Many sweeps.' },
    { id: 'optimal', kind: 'optimal', name: 'Kahn from supplies', idea: 'Count missing ingredients per recipe; process available items from a queue.', time: 'O(R + I + S)', space: 'O(R + I + S)' },
  ],
  takeaway: 'Seed Kahn with **what you have**.',
  video,
  videoArgs: [RECIPES, ING, SUP],
  judge: {
    type: 'fn', fn: 'findAllRecipes', params: ['String[]', 'List<List<String>>', 'String[]'], ret: 'List<String>', cmp: 'sorted',
    tests: [
      { args: [['bread'], [['yeast', 'flour']], ['yeast', 'flour', 'corn']], out: ['bread'] },
      { args: [['bread', 'sandwich'], [['yeast', 'flour'], ['bread', 'meat']], ['yeast', 'flour', 'meat']], out: ['bread', 'sandwich'] },
      { args: [['ju', 'fzjnm', 'x', 'e', 'zpmcz', 'h', 'q'], [['d'], ['hveml', 'f', 'cpivl'], ['cpivl', 'zpmcz', 'h', 'e', 'fzjnm', 'ju'], ['cpivl', 'hveml', 'zpmcz', 'ju', 'h'], ['h', 'fzjnm', 'e', 'q', 'x'], ['d', 'hveml', 'cpivl', 'q', 'zpmcz', 'ju', 'e', 'x'], ['f', 'hveml', 'cpivl']], ['f', 'hveml', 'cpivl', 'd']], out: ['ju', 'fzjnm', 'q'] },
      { args: [['a', 'b'], [['b'], ['a']], []], out: [] },
      { args: [RECIPES, ING, SUP], out: cook(RECIPES, ING, SUP) },
    ],
    gen: (r: Rng) => {
      const pool = r.shuffle([...WORDS]);
      const nr = r.int(1, 4), ns = r.int(0, 3);
      const recipes = pool.slice(0, nr), sup = pool.slice(nr, nr + ns);
      const items = pool.slice(0, Math.min(pool.length, nr + ns + 1));
      const ing = recipes.map((rc) => [...new Set(Array.from({ length: r.int(1, 3) }, () => items[r.int(0, items.length - 1)]))].filter((x) => x !== rc)).map((l, i) => (l.length ? l : [items.find((x) => x !== recipes[i])!]));
      return [recipes, ing, sup];
    },
    ref: (recipes: string[], ing: string[][], sup: string[]) => cook(recipes, ing, sup),
  },
};

export default problem;
