/** Helpers for binary-tree videos built with v.binaryTree (node ids are "t<index>"). */
import type { TreeH } from '../engine/builder';

export type Order = 'pre' | 'in' | 'post';

export function orderIds(t: TreeH, kind: Order, root = t.root()): string[] {
  const out: string[] = [];
  const walk = (id: string | null) => {
    if (!id) return;
    if (kind === 'pre') out.push(id);
    walk(t.left(id));
    if (kind === 'in') out.push(id);
    walk(t.right(id));
    if (kind === 'post') out.push(id);
  };
  walk(root);
  return out;
}

/** Ids on the path from the root to `id` (inclusive). */
export function pathTo(t: TreeH, id: string, root = t.root()): string[] {
  const path: string[] = [];
  const go = (x: string | null): boolean => {
    if (!x) return false;
    path.push(x);
    if (x === id || go(t.left(x)) || go(t.right(x))) return true;
    path.pop();
    return false;
  };
  go(root);
  return path;
}

export function parentOf(t: TreeH, id: string): string | null {
  for (const [pid, nd] of Object.entries(t.p.nodes)) if (nd.kids.includes(id)) return pid;
  return null;
}

import { Video } from '../engine/builder';
import { recap, words } from './helpers';

/** Full video for the three traversal problems: recursive, iterative (stack) and Morris / one-stack. */
export function traversalVideo(kind: Order, T: (number | null)[]) {
  const name = { pre: 'Preorder', in: 'Inorder', post: 'Postorder' }[kind];
  const v = new Video(`${kind}order-traversal`, `Binary Tree ${name} Traversal`);
  const seq = { pre: 'node, left, right', in: 'left, node, right', post: 'left, right, node' }[kind];
  v.chapter('intro', 'The problem');
  const t0 = v.binaryTree('t', T, { label: `root = [${T.map((x) => (x === null ? 'null' : x)).join(',')}]` });
  const ids0 = orderIds(t0, kind);
  v.say(`Return the ${name.toLowerCase()} traversal of the tree: ${seq}.`);
  v.eq(`[${ids0.map((x) => t0.val(x)).join(', ')}]`);

  // Recursive
  const recCode = kind === 'pre' ? ['dfs(node):', '  if not node: return', '  out.append(node.val)', '  dfs(node.left); dfs(node.right)'] : kind === 'in' ? ['dfs(node):', '  if not node: return', '  dfs(node.left)', '  out.append(node.val); dfs(node.right)'] : ['dfs(node):', '  if not node: return', '  dfs(node.left); dfs(node.right)', '  out.append(node.val)'];
  v.chapter('brute', 'Recursive', { cx: 'O(n) time · O(h) stack', code: recCode });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'call stack in purple' });
  const out = v.array('o', [], { label: 'out' });
  const walkStack: string[] = [];
  let told = 0;
  const rec = (id: string | null) => {
    if (!id) return;
    walkStack.push(id);
    const show = (verb: string) => { t.clearTones(); walkStack.forEach((x) => t.tone(x, 'path')); t.tone(id, 'active'); v.eq(verb); };
    const visit = () => {
      out.push(t.val(id) as number);
      show(`visit ${t.val(id)}`);
      v.line(kind === 'post' ? 3 : kind === 'pre' ? 2 : 3);
      if (told === 0) { v.say(`The recursion keeps the path from the root in its call stack, shown in purple. ${kind === 'pre' ? 'Pre-order visits the node as soon as the call starts.' : kind === 'in' ? 'In-order visits the node after its whole left subtree returns, so the leftmost node comes first.' : 'Post-order visits the node only when both children have returned, so leaves come first.'}`); told++; } else v.hold(450);
    };
    if (kind === 'pre') visit();
    rec(t.left(id));
    if (kind === 'in') visit();
    rec(t.right(id));
    if (kind === 'post') visit();
    walkStack.pop();
  };
  rec(t.root());
  t.clearTones();
  v.eq(`[${ids0.map((x) => t0.val(x)).join(', ')}]`, 'ok').say('Three lines of code, O of n time, and the call stack uses O of h space. On a very deep tree, h can be n, which can overflow the language’s recursion limit. An explicit stack avoids that.');

  // Iterative
  const itCode = kind === 'pre' ? ['stack = [root]', 'while stack: node = pop()', '  out.append(node.val)', '  push right, then left   # left pops first'] : kind === 'in' ? ['cur = root', 'while cur or stack:', '  while cur: push cur; cur = cur.left', '  cur = pop(); out.append(cur.val)', '  cur = cur.right'] : ['stack = [root]', 'while stack: node = pop()', '  out.append(node.val)   # node, right, left', '  push node.left, then node.right', 'reverse(out)           # left, right, node'];
  v.chapter(kind === 'post' ? 'optimal' : 'better', kind === 'post' ? 'Iterative: reversed "node, right, left"' : 'Iterative with an explicit stack', { cx: 'O(n) time · O(h) space', code: itCode });
  v.clear().layout('row');
  const u = v.binaryTree('t', T, { label: 'tree' });
  const st = v.stack('s', [], { label: 'stack' });
  const o2 = v.array('o', [], { label: 'out' });
  v.weight('t', 2).weight('s', 0.8).weight('o', 1.2);
  const S: string[] = [];
  const res: string[] = [];
  const push = (id: string) => { S.push(id); st.push(u.val(id) as number); };
  const pop = () => { st.pop(); return S.pop()!; };
  const paint = (cur?: string | null) => { u.clearTones(); res.forEach((x) => u.tone(x, 'done')); S.forEach((x) => u.tone(x, 'path')); if (cur) u.tone(cur, 'active'); };
  let first = true;
  if (kind === 'pre' || kind === 'post') {
    push(u.root()!);
    paint(); v.line(0).eq('push the root').say(kind === 'pre' ? 'Put the root on a stack. Repeatedly pop a node, visit it, and push its children: right first, then left, so the left child is popped first.' : 'Trick: run a pre-order that goes node, right, left. Reversed, that is exactly left, right, node: post-order.');
    while (S.length) {
      const id = pop();
      res.push(id);
      o2.push(u.val(id) as number);
      const a = kind === 'pre' ? u.right(id) : u.left(id), b = kind === 'pre' ? u.left(id) : u.right(id);
      if (a) push(a);
      if (b) push(b);
      paint(id);
      v.line(1, 2, 3).eq(`pop ${u.val(id)} → out; push ${[a, b].filter(Boolean).map((x) => u.val(x!)).join(', ') || 'nothing'}`);
      if (first) { v.say(`Pop ${words(u.val(id) as number)} and visit it. Push its children${kind === 'pre' ? ', right before left' : ', left before right'}.`); first = false; } else v.hold(550);
    }
    if (kind === 'post') {
      const rev = [...res].reverse();
      o2.p.items = []; rev.forEach((x) => o2.push(u.val(x) as number));
      u.clearTones();
      v.line(4).eq(`reverse → [${rev.map((x) => u.val(x)).join(', ')}]`, 'ok').say('Reverse the list and we have the post-order, with no recursion at all.');
    }
  } else {
    let cur: string | null = u.root();
    while (cur || S.length) {
      while (cur) { push(cur); paint(cur); v.line(2).eq(`push ${u.val(cur)}, go left`); if (first) { v.say('Walk down to the left as far as possible, pushing every node. They are all waiting for their left subtree to finish.'); first = false; } else v.hold(400); cur = u.left(cur); }
      const id = pop();
      res.push(id); o2.push(u.val(id) as number);
      paint(id);
      v.line(3).eq(`pop ${u.val(id)} → out`);
      if (res.length === 1) v.say(`No more left children. Pop ${words(u.val(id) as number)}: its left side is done, so visit it, then move into its right subtree.`); else v.hold(450);
      cur = u.right(id);
      v.line(4).hold(250);
    }
  }
  u.clearTones();
  v.eq(`[${ids0.map((x) => t0.val(x)).join(', ')}]`, 'ok').hold(800);

  if (kind !== 'post') {
    v.chapter('optimal', 'Morris traversal: O(1) extra space', { cx: 'O(n) time · O(1) space', code: ['cur = root', 'no left child: visit; cur = right', 'else pre = rightmost of cur.left', kind === 'pre' ? '  no thread: add it; visit; go left' : '  no thread: add it; go left', kind === 'in' ? '  thread: remove it; visit; go right' : '  thread: remove it; go right'] });
    v.clear();
    const m = v.binaryTree('t', T, { label: 'badge → = temporary thread back to an ancestor' });
    const o3 = v.array('o', [], { label: 'out' });
    const thread: Record<string, string> = {};
    const done: string[] = [];
    let cur: string | null = m.root();
    let tt = 0;
    const paintM = () => { m.clearTones(); done.forEach((x) => m.tone(x, 'done')); if (cur) m.tone(cur, 'active'); m.ptr('cur', cur); };
    v.say('Morris traversal removes the stack entirely. The idea: before descending into a left subtree, make the rightmost node of that subtree point back to the current node. That temporary thread tells us how to come back up. On the second arrival we remove the thread, so the tree ends unchanged.');
    while (cur) {
      const l = m.left(cur);
      if (!l) {
        done.push(cur); o3.push(m.val(cur) as number); paintM();
        v.line(1).eq(`${m.val(cur)} has no left child → visit, go right`).hold(550);
        cur = thread[cur] ?? m.right(cur);
        continue;
      }
      let pre = l;
      while (m.right(pre) && m.right(pre) !== cur) pre = m.right(pre)!;
      if (!thread[pre]) {
        thread[pre] = cur;
        m.badge(pre, `→${m.val(cur)}`);
        if (kind === 'pre') { done.push(cur); o3.push(m.val(cur) as number); }
        paintM(); m.tone(pre, 'cmp');
        v.line(2, 3).eq(`thread ${m.val(pre)}.right → ${m.val(cur)}${kind === 'pre' ? `; visit ${m.val(cur)}` : ''}; go left`);
        if (tt === 0) { v.say(`The rightmost node of ${words(m.val(cur) as number)}’s left subtree is ${words(m.val(pre) as number)}. Point its right pointer back to ${words(m.val(cur) as number)}${kind === 'pre' ? ', visit ' + words(m.val(cur) as number) : ''}, then go left.`); tt++; } else v.hold(600);
        cur = l;
      } else {
        delete thread[pre];
        m.badge(pre, null);
        if (kind === 'in') { done.push(cur); o3.push(m.val(cur) as number); }
        paintM();
        v.line(4).eq(`thread found again → remove it${kind === 'in' ? `; visit ${m.val(cur)}` : ''}; go right`);
        if (tt === 1) { v.say(`We followed a thread back to ${words(m.val(cur) as number)}. Finding the thread already in place means the left subtree is finished. Remove it${kind === 'in' ? ', visit ' + words(m.val(cur) as number) : ''}, and continue to the right.`); tt++; } else v.hold(600);
        cur = m.right(cur);
      }
    }
    m.clearTones(); m.noPtr();
    v.eq(`[${ids0.map((x) => t0.val(x)).join(', ')}] · O(1) extra space`, 'ok').say('Every edge is walked a constant number of times, so it is still linear time, but the only extra memory is a couple of pointers.');
  }
  v.answer(ids0.map((x) => t0.val(x)));

  const rows = kind === 'post'
    ? [{ name: 'Recursive', time: 'O(n)', space: 'O(h)' }, { name: 'Iterative (reversed)', time: 'O(n)', space: 'O(h)' }]
    : [{ name: 'Recursive', time: 'O(n)', space: 'O(h)' }, { name: 'Iterative stack', time: 'O(n)', space: 'O(h)' }, { name: 'Morris', time: 'O(n)', space: 'O(1)' }];
  recap(v, rows, `${name}: ${seq}.`, ['Traversal → recursion first; stack to avoid deep recursion; Morris for O(1) space'], 'Know all three: interviewers often ask for the iterative version as a follow-up.');
  return v.build();
}
