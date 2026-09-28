import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { opsTable } from '../../designviz';

const OPS: [string, number[]][] = [['postTweet', [1, 5]], ['postTweet', [2, 6]], ['postTweet', [1, 3]], ['follow', [1, 2]], ['postTweet', [2, 9]], ['postTweet', [3, 7]], ['getNewsFeed', [1]], ['unfollow', [1, 2]], ['getNewsFeed', [1]]];

type Op = { ops: string[]; args: unknown[][] };
function ref(ops: string[], args: unknown[][]) {
  const all: [number, number][] = [];
  const fol = new Map<number, Set<number>>();
  return ops.map((op, i) => {
    const a = args[i] as number[];
    if (op === 'postTweet') { all.push([a[0], a[1]]); return null; }
    if (op === 'follow') { if (!fol.has(a[0])) fol.set(a[0], new Set()); fol.get(a[0])!.add(a[1]); return null; }
    if (op === 'unfollow') { fol.get(a[0])?.delete(a[1]); return null; }
    if (op === 'getNewsFeed') { const f: number[] = []; for (let k = all.length - 1; k >= 0 && f.length < 10; k--) if (all[k][0] === a[0] || fol.get(a[0])?.has(all[k][0])) f.push(all[k][1]); return f; }
    return null;
  });
}

function video() {
  const v = new Video('design-twitter', 'Design Twitter');
  const outs = ref(OPS.map((o) => o[0]), OPS.map((o) => o[1]));
  v.chapter('intro', 'The problem');
  opsTable(v, OPS.map(([op, a]) => `${op}(${a.join(', ')})`), outs.map((x) => (x === null ? null : `[${(x as number[]).join(',')}]`)));
  v.say('A tiny Twitter: users post tweets, follow and unfollow each other, and ask for a news feed: the ten most recent tweets from themselves and everyone they follow, newest first.');

  const posts: [number, number, number][] = [];
  OPS.forEach(([op, a]) => { if (op === 'postTweet') posts.push([posts.length + 1, a[0], a[1]]); });
  v.chapter('brute', 'Brute force: scan every tweet, newest first', { cx: 'O(T) per feed', code: ['feed(u): walk all tweets from newest', '  keep those by u or a followee', '  stop at 10'] });
  v.clear();
  const tb = v.table('tb', ['time', 'user', 'tweet'], posts.slice().reverse().map(([t, u, id]) => [String(t), String(u), String(id)]));
  posts.slice().reverse().forEach(([, u], r) => tb.tone(r, u === 1 || u === 2 ? 'ok' : 'dim'));
  v.line(0, 1, 2).eq(`feed(1), following 2 → [${(outs[6] as number[]).join(', ')}]`, 'ok').say('The straightforward feed walks the global list of tweets from newest to oldest and keeps those written by the user or someone they follow. It reads everybody’s tweets, including users it does not follow: with millions of tweets, one feed can scan millions to show ten.');

  v.chapter('optimal', 'Optimal: merge the newest tweets with a heap', { cx: 'O(F + 10 log F) per feed', code: ['post: tweets[u].append((time++, id))', 'feed(u): heap ← newest tweet of u and each followee', '  pop the newest → feed', '  push the next older tweet of that user', '  stop at 10 tweets or an empty heap'] });
  v.clear();
  const tweets = new Map<number, [number, number][]>();
  const fol = new Map<number, Set<number>>();
  const users = [1, 2, 3];
  const row = (u: number) => [String(u), (tweets.get(u) ?? []).slice().reverse().map(([t, id]) => `t${t}:${id}`).join('  ') || '—', [...(fol.get(u) ?? [])].join(', ') || '—'];
  const ut = v.table('ut', ['user', 'tweets, newest first (time:id)', 'follows'], users.map(row));
  const time = new Map<string, number>();
  const h = v.heap('h', { label: 'max-heap by time', treeOnly: true, cmp: (x, y) => time.get(String(y))! - time.get(String(x))! });
  const fv = v.vars('fv', { feed: '[]' });
  v.layout('row').weight('ut', 1.7);
  const refresh = () => users.forEach((u, r) => { const [a, b, c] = row(u); ut.setCell(r, 0, a); ut.setCell(r, 1, b); ut.setCell(r, 2, c); });
  let clock = 0;
  let feedNo = 0;
  OPS.forEach(([op, a]) => {
    ut.clearTones();
    if (op === 'postTweet') {
      clock++;
      if (!tweets.has(a[0])) tweets.set(a[0], []);
      tweets.get(a[0])!.push([clock, a[1]]);
      refresh();
      ut.tone(users.indexOf(a[0]), 'active');
      v.line(0).eq(`postTweet(${a[0]}, ${a[1]}) at time ${clock}`);
      if (clock === 1) v.say('Posting appends the tweet to the author’s own list with a global time stamp. Each list is sorted by time for free.');
      else v.hold(700);
      return;
    }
    if (op === 'follow' || op === 'unfollow') {
      if (!fol.has(a[0])) fol.set(a[0], new Set());
      if (op === 'follow') fol.get(a[0])!.add(a[1]); else fol.get(a[0])!.delete(a[1]);
      refresh();
      ut.tone(users.indexOf(a[0]), 'active');
      v.eq(`${op}(${a[0]}, ${a[1]})`).hold(800);
      return;
    }
    feedNo++;
    const u = a[0];
    const who = [u, ...(fol.get(u) ?? [])];
    fv.set({ feed: '[]' });
    const idx = new Map<number, number>();
    for (const w of who) {
      const list = tweets.get(w) ?? [];
      if (!list.length) continue;
      idx.set(w, list.length - 1);
      const [t, id] = list[list.length - 1];
      const key = `t${t}:${id}`;
      time.set(key, t);
      h.push(key);
      ut.tone(users.indexOf(w), 'cmp');
    }
    v.line(1).eq(`getNewsFeed(${u}): heap ← newest of users ${who.join(', ')}`);
    if (feedNo === 1) v.say(`User one follows two. Each of their lists is already sorted, so this is merging sorted lists, like merge k sorted lists. Put only the newest tweet of each user in a max-heap by time.`);
    else v.say('After unfollowing, only user one’s own list takes part.');
    let n = 0;
    const got: number[] = [];
    while (h.size && n < 10) {
      const top = String(h.peek());
      h.pop();
      const [t, id] = top.slice(1).split(':').map(Number);
      const w = [...idx.keys()].find((x) => (tweets.get(x) ?? []).some(([tt]) => tt === t))!;
      got.push(id);
      fv.set({ feed: `[${got.join(', ')}]` }, 'ok');
      n++;
      const next = idx.get(w)! - 1;
      idx.set(w, next);
      let extra = '';
      if (next >= 0) {
        const [nt, nid] = tweets.get(w)![next];
        const key = `t${nt}:${nid}`;
        time.set(key, nt);
        h.push(key);
        extra = `; push user ${w}'s next: ${key}`;
      }
      v.line(2, 3).eq(`pop ${top} → feed${extra}`, 'ok');
      if (feedNo === 1 && n === 1) v.say(`Pop the newest, tweet ${words(id)} at time ${words(t)}. Then push the next older tweet from the same user, ${next >= 0 ? `user ${words(w)}` : 'if any'}. The heap always holds the best remaining candidate of each user.`);
      else v.hold(750);
    }
    v.line(4).eq(`getNewsFeed(${u}) = [${got.join(', ')}]`, 'ok');
    if (feedNo === 1) v.say('The heap ran empty before ten tweets, so the feed has four. Only the tweets we actually output ever enter the heap, so a feed costs about ten heap operations, no matter how many tweets exist.');
    else v.hold(900);
  });
  v.answer(`[${(outs[6] as number[]).join(',')}], [${(outs[8] as number[]).join(',')}]`);

  recap(v, [{ name: 'Gather + sort', time: 'O(T log T) per feed', space: 'O(T)' }, { name: 'Heap merge of newest tweets', time: 'O(F + 10 log F) per feed', space: 'O(F)' }], 'Per-user sorted lists + a heap of each list’s head = k-way merge.', ['“Most recent k across many sources” → heap merge'], 'A user always sees their own tweets; do not let follow(u, u) duplicate them.');
  return v.build();
}

const problem: Problem = {
  slug: 'design-twitter',
  statement: 'Design a simplified Twitter:\n\n- `Twitter()` initialises the object.\n- `void postTweet(int userId, int tweetId)` composes a new tweet (each call has a unique `tweetId`).\n- `List<Integer> getNewsFeed(int userId)` returns the 10 most recent tweet ids from the user and the users they follow, most recent first.\n- `void follow(int followerId, int followeeId)` and `void unfollow(int followerId, int followeeId)`.',
  examples: [{ input: '["Twitter","postTweet","getNewsFeed","follow","postTweet","getNewsFeed","unfollow","getNewsFeed"]\n[[],[1,5],[1],[1,2],[2,6],[1],[1,2],[1]]', output: '[null,null,[5],null,null,[6,5],null,[5]]' }],
  constraints: ['1 ≤ userId, followerId, followeeId ≤ 500', '0 ≤ tweetId ≤ 10⁴, all unique', 'at most 3 · 10⁴ calls'],
  hints: ['Each user’s tweets are already sorted by time.', 'Merge the heads of the lists with a heap and stop after 10.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan all tweets', idea: 'Walk the global tweet list from newest, keeping tweets by the user or followees until 10.', time: 'O(T) per feed', space: 'O(T)', bottleneck: 'Scans tweets of everyone.' },
    { id: 'optimal', kind: 'optimal', name: 'Heap merge', idea: 'Heap of each followed user’s newest tweet; pop 10 times, pushing that user’s next older tweet.', time: 'O(F + 10 log F) per feed', space: 'O(F)' },
  ],
  takeaway: 'Newest across many sorted lists → **k-way heap merge**.',
  video,
  judge: {
    type: 'design', cls: 'Twitter', ctor: [],
    methods: { postTweet: { params: ['int', 'int'], ret: 'void' }, getNewsFeed: { params: ['int'], ret: 'List<Integer>' }, follow: { params: ['int', 'int'], ret: 'void' }, unfollow: { params: ['int', 'int'], ret: 'void' } },
    tests: [
      { ops: ['Twitter', 'postTweet', 'getNewsFeed', 'follow', 'postTweet', 'getNewsFeed', 'unfollow', 'getNewsFeed'], args: [[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]], out: [null, null, [5], null, null, [6, 5], null, [5]] },
      { ops: ['Twitter', ...OPS.map((o) => o[0])], args: [[], ...OPS.map((o) => o[1])], out: [null, null, null, null, null, null, null, [9, 3, 6, 5], null, [3, 5]] },
      { ops: ['Twitter', ...Array(12).fill('postTweet'), 'getNewsFeed'], args: [[], ...Array.from({ length: 12 }, (_, i) => [1, 100 + i]), [1]], out: [null, ...Array(12).fill(null), [111, 110, 109, 108, 107, 106, 105, 104, 103, 102]] },
      { ops: ['Twitter', 'getNewsFeed', 'unfollow', 'getNewsFeed'], args: [[], [3], [3, 4], [3]], out: [null, [], null, []] },
    ],
    gen: (r: Rng): Op => {
      const ops = ['Twitter'];
      const args: unknown[][] = [[]];
      let id = r.int(0, 50);
      for (let k = 0; k < 40; k++) {
        const op = r.pick(['postTweet', 'postTweet', 'postTweet', 'follow', 'unfollow', 'getNewsFeed', 'getNewsFeed']);
        ops.push(op);
        const u = r.int(1, 4);
        if (op === 'postTweet') { id += r.int(1, 7); args.push([u, id]); }
        else if (op === 'getNewsFeed') args.push([u]);
        else { let w = r.int(1, 4); if (w === u) w = (w % 4) + 1; args.push([u, w]); }
      }
      return { ops, args };
    },
    ref,
  },
};

export default problem;
