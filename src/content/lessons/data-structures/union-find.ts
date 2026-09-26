import type { Lesson } from '../../types';
import { Video } from '../../helpers';
import { dsuViz } from '../../dsuviz';

function video() {
  const v = new Video('union-find', 'Union-Find: disjoint sets');
  v.chapter('intro', 'Friend circles that merge');
  v.text('q', { title: 'Six students, friendships arriving one at a time', lines: ['0 – 1 become friends', '2 – 3 become friends', '1 – 3 become friends', 'Question: are 0 and 2 in the same circle now?'], shown: 4 });
  v.say('Six students. Friendships arrive one at a time, and a friend of a friend is in the same circle. At any moment we may ask: are these two in the same circle?');
  v.say('We need two operations: union, to merge two circles, and find, to name the circle someone is in. A structure that does exactly this is called union find, or a disjoint set union.');

  v.chapter('naive', 'First idea: a group label per person', { cx: 'union O(n)', code: ['group[i] = i', 'union(a, b): relabel every member of b’s group', 'same(a, b): group[a] == group[b]'] });
  v.clear();
  const g = v.array('g', [0, 0, 2, 2, 4, 5], { label: 'group[i] after 0–1 and 2–3' });
  v.line(0).say('Store a group label for each person. After zero with one, and two with three, the labels are zero, zero, two, two, four, five.');
  g.tone(2, 'warn').tone(3, 'warn');
  v.line(1).eq('union(1, 3): every “2” must become “0”').say('Now one and three become friends. Every person labelled two must be relabelled zero. To find them, we scan the whole array.');
  g.set(2, 0).set(3, 0).clearTones().tone(2, 'ok').tone(3, 'ok');
  v.eq('each union scans n labels → O(n)', 'bad').say('Checking is instant, but each merge costs O of n. With n merges, that is n squared.');

  v.chapter('forest', 'Better: a forest of parent pointers', { code: ['find(x): while parent[x] != x: x = parent[x]', '         return x', 'union(a, b): ra = find(a), rb = find(b)', '             if ra != rb: parent[rb] = ra'] });
  v.clear().layout('row');
  const D = dsuViz(v, 6);
  v.say('Instead, each person points to a parent. Following parents upward always ends at a root, who points to itself. The root is the leader and names the group. At first, everyone is their own leader.');
  const U = [[0, 1], [2, 3], [1, 3], [4, 5]];
  U.forEach(([a, b], k) => {
    D.t.clearTones();
    D.arr!.clearTones();
    const ra = D.find(a);
    const rb = D.find(b);
    D.t.tone(D.ID(ra), 'active').tone(D.ID(rb), 'cmp');
    v.line(2).eq(`union(${a}, ${b}): find(${a}) = ${ra}, find(${b}) = ${rb}`);
    if (k === 0) v.say('Union zero and one. Each is its own root, so point one’s root at zero’s root.');
    else if (k === 2) v.say(`Union one and three. Find one: its parent is ${D.parent[1]}, the root. Find three: its root is ${rb}. Different roots, so the groups are different.`);
    else v.hold(700);
    const r = D.union(a, b)!;
    D.t.tone(D.ID(r.child), 'visit').edge(D.ID(r.root), D.ID(r.child), 'visit');
    D.arr!.tone(r.child, 'visit');
    v.line(3).eq(`parent[${r.child}] = ${r.root}`, 'ok');
    if (k === 2) v.say(`Link root ${r.child} under root ${r.root}. One pointer change merges the whole group: three comes along automatically, because it points to ${r.child}.`);
    else v.hold(800);
  });
  D.showPath(3);
  v.line(0, 1).eq(`find(3): ${D.path(3).join(' → ')} · root 0`, 'ok').say('Now find three walks up: three to two to zero. Zero is its own parent, so zero is the leader.');
  D.showPath(5);
  v.eq(`find(5) = ${D.find(5)} ≠ 0 → different groups`, 'bad').say('Are three and five in the same group? Find five gives four, a different root. So no.');
  D.t.clearTones();
  D.arr!.clearTones();
  v.eq(`${D.groups()} roots → ${D.groups()} groups`, 'ok').say(`We now have ${D.groups()} groups: count the roots. Every union that merges two groups lowers the count by one.`);

  v.chapter('tall', 'The catch: trees can grow tall', { code: ['union(a, b): parent[find(a)] = find(b)'] });
  v.clear().layout('row');
  const C = dsuViz(v, 5, { label: 'always hang root(a) under root(b)' });
  v.say('Nothing stops trees from becoming long chains. Suppose we always hang the first root under the second, and the unions come in an unlucky order.');
  for (let i = 0; i < 4; i++) {
    const r = C.union(i, i + 1, 'naive')!;
    C.t.clearTones().tone(C.ID(r.child), 'visit');
    v.line(0).eq(`union(${i}, ${i + 1}): parent[${r.child}] = ${r.root}`).hold(650);
  }
  C.showPath(0);
  v.eq(`find(0): ${C.path(0).join(' → ')} = ${C.path(0).length - 1} hops`, 'bad').say('Now the tree is a chain, and find zero walks the entire height: four hops for five people, n in general. We fix this with two tricks.');

  v.chapter('size', 'Fix 1: union by size', { code: ['ra, rb = find(a), find(b)', 'if size[ra] < size[rb]: swap', 'parent[rb] = ra; size[ra] += size[rb]'] });
  v.clear().layout('row');
  const S = dsuViz(v, 5, { label: 'hang the smaller tree under the larger' });
  S.sizeBadges();
  v.say('Fix one: always hang the smaller tree under the bigger one. Track the size of each root.');
  for (let i = 0; i < 4; i++) {
    const r = S.union(i, i + 1)!;
    S.sizeBadges();
    S.t.clearTones().tone(S.ID(r.child), 'visit').tone(S.ID(r.root), 'ok');
    v.line(1, 2).eq(`union(${i}, ${i + 1}): smaller root ${r.child} under ${r.root}`);
    if (i === 1) v.say(`Zero’s tree had size ${S.size[0] - 1} and two was alone with size one, so the smaller one, two, went under zero. Size ${S.size[0]} now, and the tree stays flat.`);
    else v.hold(650);
  }
  S.t.clearTones();
  v.eq('height ≤ log₂ n: a node only moves down when its tree at least doubles', 'ok').say('Same unions, but now everyone is one hop from the root. In general the height never exceeds log n, because a node gets deeper only when its group at least doubles in size.');

  v.chapter('compress', 'Fix 2: path compression', { code: ['find(x):', '  if parent[x] != x:', '    parent[x] = find(parent[x])   # point straight at the root', '  return parent[x]'] });
  v.clear().layout('row');
  const P = dsuViz(v, 5, { label: 'the tall chain from before' });
  for (let i = 0; i < 4; i++) P.union(i, i + 1, 'naive');
  const pth = P.showPath(0);
  v.line(0, 1).eq(`find(0) walks ${pth.join(' → ')}`).say('Fix two works during find. Take the tall chain again. Find zero walks all the way up to four.');
  const moved = P.compress(0);
  P.t.clearTones().tone(P.ID(4), 'ok');
  moved.forEach((y) => P.t.tone(P.ID(y), 'visit').edge(P.ID(4), P.ID(y), 'visit'));
  P.arr!.clearTones();
  moved.forEach((y) => P.arr!.tone(y, 'visit'));
  v.line(2).eq(`on the way back: parent[${moved.join('], parent[')}] = 4`, 'ok').say(`On the way back, point every node we passed directly at the root. ${moved.join(', ')} now point to four. The next find on any of them takes one hop.`);

  v.chapter('cost', 'How fast is it?');
  v.clear();
  v.table('c', ['Version', 'find / union'], [
    ['Group labels', 'O(1) / O(n)'],
    ['Parent pointers only', 'O(n) worst case'],
    ['+ union by size (or rank)', 'O(log n)'],
    ['+ path compression', 'O(α(n)) amortised ≈ constant'],
  ]).tone(3, 'ok');
  v.say('With both tricks, each operation costs inverse Ackermann of n, amortised. That function is at most four for any input that fits in the universe. Treat it as constant time.');

  v.chapter('recap', 'When to use union-find');
  v.clear();
  v.table('r', ['Signal', 'Example'], [
    ['Groups that merge over time', 'friend circles, accounts merge'],
    ['“Are a and b connected?” many times', 'dynamic connectivity'],
    ['Count connected components', 'number of provinces'],
    ['An edge joins two nodes already connected → cycle', 'redundant connection'],
    ['Build a minimum spanning tree', 'Kruskal’s algorithm'],
  ]);
  v.say('Use union find when groups only ever merge and you keep asking who belongs together. It counts components, detects cycles as edges arrive, and powers Kruskal’s minimum spanning tree.');
  return v.build();
}

const body = String.raw`
## The idea

**Union-Find** (also called **Disjoint Set Union, DSU**) keeps elements in disjoint groups and supports:

- \`find(x)\`: return the group's representative (its **root**).
- \`union(a, b)\`: merge the groups of \`a\` and \`b\`.

Each group is a tree stored in a \`parent[]\` array; a root points to itself.

> Real-life picture: friend circles. When two people become friends, their whole circles merge. To check whether two people share a circle, compare their circles' leaders.

## Two optimisations

| Trick | What it does | Effect |
|---|---|---|
| **Union by size / rank** | hang the smaller tree under the larger | height ≤ log n |
| **Path compression** | during \`find\`, point every visited node straight at the root | later finds are ~1 hop |
| **Both** | | **O(α(n))** amortised per operation: effectively constant |

## Template

\`\`\`java
class DSU {
    int[] parent, size;
    int groups;
    DSU(int n) {
        parent = new int[n];
        size = new int[n];
        groups = n;
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    }
    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];   // path halving (iterative compression)
            x = parent[x];
        }
        return x;
    }
    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;           // already together: this edge closes a cycle
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        size[ra] += size[rb];
        groups--;
        return true;
    }
}
\`\`\`

\`\`\`python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.groups = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path halving
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                                   # already together
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        self.groups -= 1
        return True
\`\`\`

\`\`\`cpp
struct DSU {
    vector<int> parent, sz;
    int groups;
    DSU(int n) : parent(n), sz(n, 1), groups(n) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];   // path halving
            x = parent[x];
        }
        return x;
    }
    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;           // already together
        if (sz[ra] < sz[rb]) swap(ra, rb);
        parent[rb] = ra;
        sz[ra] += sz[rb];
        groups--;
        return true;
    }
};
\`\`\`

> **Path halving** (\`parent[x] = parent[parent[x]]\`) is an iterative form of path compression with the same guarantees and no recursion-depth risk.

## Union-Find vs. BFS/DFS

| Situation | Prefer |
|---|---|
| The graph is fixed and you traverse it once | BFS / DFS |
| Edges **arrive over time**, with connectivity queries in between | Union-Find |
| Detect the edge that first creates a cycle | Union-Find |
| Need actual paths or distances | BFS / DFS |
| Edges get **deleted** | neither directly (union-find cannot split groups) |

## Pitfalls

- Comparing \`parent[a] == parent[b]\` instead of \`find(a) == find(b)\`.
- Forgetting to use roots in \`union\`: always link \`find(a)\` and \`find(b)\`, never \`a\` and \`b\` directly.
- Mapping non-integer items (emails, strings) to indices first, with a hash map.
`;

const lesson: Lesson = {
  slug: 'union-find',
  video,
  body,
  quiz: [
    { q: 'How do you check whether a and b are in the same group?', options: ['parent[a] == parent[b]', 'find(a) == find(b)', 'size[a] == size[b]', 'a == b'], answer: 1, why: 'Only the roots identify groups; direct parents may differ inside one tree.' },
    { q: 'What does union by size guarantee?', options: ['Trees have height ≤ log n', 'Every find is O(1)', 'Groups never merge', 'Sorted order'], answer: 0, why: 'A node only gets deeper when its group at least doubles, which can happen log n times.' },
    { q: 'While adding edges, union(a, b) finds a and b already share a root. What does that mean?', options: ['A bug', 'This edge closes a cycle', 'The graph is disconnected', 'a == b'], answer: 1, why: 'They were already connected, so the new edge creates a second path between them.' },
    { q: 'With both optimisations, the amortised cost per operation is…', options: ['O(n)', 'O(log n)', 'O(α(n)), practically constant', 'O(n log n)'], answer: 2, why: 'The inverse Ackermann function is below 5 for any realistic n.' },
  ],
};

export default lesson;
