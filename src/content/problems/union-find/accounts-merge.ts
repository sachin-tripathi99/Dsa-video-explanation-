import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { dsuViz } from '../../dsuviz';

const ACC = [
  ['John', 'john@a.com', 'jn@b.com'],
  ['John', 'john@a.com', 'j00@c.com'],
  ['Mary', 'mary@m.com'],
  ['John', 'jb@x.com'],
];

function merge(accounts: string[][]) {
  const p = accounts.map((_, i) => i);
  const f = (x: number): number => (p[x] === x ? x : (p[x] = f(p[x])));
  const owner = new Map<string, number>();
  accounts.forEach((a, i) => a.slice(1).forEach((e) => { if (owner.has(e)) p[f(i)] = f(owner.get(e)!); else owner.set(e, i); }));
  const groups = new Map<number, string[]>();
  for (const [e, i] of owner) { const r = f(i); if (!groups.has(r)) groups.set(r, []); groups.get(r)!.push(e); }
  return [...groups].map(([r, es]) => [accounts[r][0], ...es.sort()]);
}

function video() {
  const v = new Video('accounts-merge', 'Accounts Merge');
  const show = (a: string[]) => [a[0], a.slice(1).join(', ')];
  v.chapter('intro', 'The problem');
  const t = v.table('acc', ['#', 'name', 'emails'], ACC.map((a, i) => [String(i), ...show(a)]));
  v.say('Each account is a name followed by emails. Two accounts belong to the same person if they share any email. Merge them, and return each person’s name with their emails sorted.');
  t.tone(0, 'warn').tone(1, 'warn');
  v.eq('accounts 0 and 1 share john@a.com → same person').say('Accounts zero and one share john at a dot com, so they merge. Account three is also called John, but it shares no email, so it is a different John. Names alone prove nothing.');
  t.clearTones();

  v.chapter('brute', 'Brute force: merge pairs until nothing changes', { cx: 'O(n² · k) per pass, many passes', code: ['repeat:', '  find two accounts sharing an email', '  merge them into one', 'until no pair shares an email'] });
  v.clear();
  v.table('acc', ['#', 'name', 'emails'], ACC.map((a, i) => [String(i), ...show(a)])).tone(0, 'active').tone(1, 'active');
  v.say('The direct approach compares every pair of accounts, merges any pair that shares an email, and starts over, until a full pass finds nothing. Each pass compares n squared pairs of email lists, and a long chain of merges needs many passes.');
  v.eq('slow and fiddly: merged accounts must be re-compared', 'warn');

  v.chapter('optimal', 'Optimal: Union-Find over accounts', { cx: 'O(E log E)', code: ['owner = {}   # email → first account that had it', 'for account i, for email e:', '  if e in owner: union(i, owner[e])', '  else: owner[e] = i', 'group emails by find(owner[e]); sort; prepend the name'] });
  v.clear().layout('row');
  const D = dsuViz(v, ACC.length, { labels: ACC.map((_, i) => `#${i}`), label: 'accounts as union-find nodes', arr: false });
  const own = v.map('own', { label: 'owner[email] = first account seen' });
  v.say('Treat accounts as nodes. Keep a map from each email to the first account that listed it. When another account lists the same email, union the two accounts.');
  const owner = new Map<string, number>();
  ACC.forEach((a, i) => {
    a.slice(1).forEach((e) => {
      own.clearTones();
      D.t.clearTones();
      if (owner.has(e)) {
        const j = owner.get(e)!;
        const r = D.union(i, j);
        own.tone(e, 'ok');
        if (r) D.t.tone(D.ID(r.child), 'visit').tone(D.ID(r.root), 'ok');
        v.line(2).eq(`#${i} lists ${e}, owned by #${j} → union(#${i}, #${j})`, 'ok');
        v.say(`Account ${i} lists ${e.replace('@', ' at ').replace('.com', ' dot com')}, which account ${j} already owns. So union accounts ${i} and ${j}.`);
      } else {
        owner.set(e, i);
        own.put(e, `#${i}`).tone(e, 'active');
        v.line(3).eq(`owner["${e}"] = #${i}`).hold(550);
      }
    });
  });
  own.clearTones();
  D.t.clearTones();
  const res = merge(ACC);
  v.line(4).eq(`${res.length} people: group emails by root, sort each group`).say(`Now group every email by the root of its owner. ${res.length} roots, so ${res.length} people. Sort each group’s emails and put the name in front.`);
  v.clear();
  v.table('res', ['name', 'emails (sorted)'], res.map((r) => [r[0], r.slice(1).join(', ')])).tone(0, 'ok');
  v.eq('j00@c.com < jn@b.com < john@a.com (character by character)', 'ok');
  v.say('John’s merged account has three emails, sorted character by character. Mary is unchanged, and the other John stays separate.');
  v.answer(res);

  recap(v, [
    { name: 'Merge pairs until stable', time: 'O(n² · k) per pass', space: 'O(E)' },
    { name: 'Union-Find over accounts', time: 'O(E log E) (sorting dominates)', space: 'O(E)' },
  ], 'Map each email to its first account; shared emails union accounts.', ['Items linked by shared attributes → union-find', 'Map non-integer keys to indices with a hash map'], 'When records are linked through shared values, union the records through a value → first-owner map.');
  return v.build();
}

const problem: Problem = {
  slug: 'accounts-merge',
  statement: 'Given `accounts`, where `accounts[i][0]` is a name and the rest are emails, merge accounts that belong to the same person: two accounts belong to the same person if they share **any** email. People can share a name. Return the merged accounts, each as the name followed by its emails in **sorted** order. The accounts may be returned in any order.',
  examples: [
    { input: 'accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]', output: '[["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]' },
  ],
  constraints: ['1 ≤ accounts.length ≤ 1000', '2 ≤ accounts[i].length ≤ 10', 'accounts sharing an email always have the same name'],
  hints: ['Which accounts need to be merged? Those sharing an email, possibly through a chain.', 'Remember the first account each email appeared in.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Merge pairs until stable', idea: 'Repeatedly find two accounts sharing an email and merge them, until no pair shares one.', time: 'O(n² · k) per pass, up to n passes', space: 'O(E)', bottleneck: 'Merged accounts must be compared again and again.' },
    { id: 'optimal', kind: 'optimal', name: 'Union-Find over accounts', idea: 'Map each email to the first account containing it; union any later account containing it. Group emails by root, sort, prepend the name.', steps: ['owner = {} (email → account index).', 'For each email of account i: union(i, owner[e]) if present, else owner[e] = i.', 'Group emails by find(owner[e]).', 'Sort each group and prepend accounts[root][0].'], time: 'O(E log E)', space: 'O(E)' },
  ],
  pitfalls: ['Merging by name: different people can share a name.', 'Duplicate emails inside one account; a map from email to owner handles them.', 'Forgetting to sort the emails.'],
  takeaway: 'Link records through shared values with a **value → first owner** map and union-find.',
  video,
  videoArgs: [ACC],
  judge: {
    type: 'fn', fn: 'accountsMerge', params: ['List<List<String>>'], ret: 'List<List<String>>', cmp: 'sorted',
    tests: [
      {
        args: [[['John', 'johnsmith@mail.com', 'john_newyork@mail.com'], ['John', 'johnsmith@mail.com', 'john00@mail.com'], ['Mary', 'mary@mail.com'], ['John', 'johnnybravo@mail.com']]],
        out: [['John', 'john00@mail.com', 'john_newyork@mail.com', 'johnsmith@mail.com'], ['Mary', 'mary@mail.com'], ['John', 'johnnybravo@mail.com']],
      },
      { args: [[['A', 'a@x', 'b@x'], ['A', 'c@x'], ['A', 'b@x', 'c@x']]], out: [['A', 'a@x', 'b@x', 'c@x']] },
    ],
    gen: (r: Rng) => {
      const people = Array.from({ length: r.int(1, 4) }, (_, p) => ({ name: r.pick(['Ann', 'Bob', 'Cat']), emails: Array.from({ length: r.int(1, 4) }, (_, k) => `p${p}e${k}@m.com`) }));
      return [Array.from({ length: r.int(1, 6) }, () => {
        const who = r.pick(people);
        const es = r.shuffle([...who.emails]).slice(0, r.int(1, who.emails.length));
        return [who.name, ...es];
      })];
    },
    ref: (a: string[][]) => merge(a),
  },
};

export default problem;
