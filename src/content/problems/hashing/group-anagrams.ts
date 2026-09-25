import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const W = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];

function video() {
  const v = new Video('group-anagrams', 'Group Anagrams');
  v.chapter('intro', 'The problem');
  v.array('w', W, { label: 'strs' });
  v.say('Group the words that are anagrams of each other. Eat, tea and ate belong together; tan and nat; and bat is alone.');

  v.chapter('brute', 'Brute force: compare every pair', { cx: 'O(n² · k log k)', code: ['for each word w:', '  if w is an anagram of an existing group’s first word: add it', '  else start a new group'] });
  v.eq('each word compared with every group → up to n² comparisons', 'bad').say('We could compare each word against the first word of every group using the anagram check. With n words that is up to n squared comparisons.');

  v.chapter('better', 'Better: sorted letters as the key', { cx: 'O(n · k log k)', code: ['groups = {}', 'for w in strs:', '  key = sorted(w)', '  groups[key].append(w)'] });
  v.clear().layout('row');
  const a = v.array('w', W, { label: 'strs' });
  const m = v.map('groups', { label: 'key → group' });
  const groups: Record<string, string[]> = {};
  W.forEach((w, i) => {
    const key = [...w].sort().join('');
    (groups[key] ??= []).push(w);
    a.clearTones().ptr('w', i).tone(i, 'active');
    m.put(key, `[${groups[key].join(', ')}]`).clearTones().tone(key, groups[key].length > 1 ? 'ok' : 'active');
    v.line(2, 3).eq(`sorted("${w}") = "${key}"`);
    if (i === 0) v.say('Every anagram looks the same once its letters are sorted. Eat becomes a e t. Use that as the key in a hash map of groups.');
    else if (i === 1) v.say('Tea also sorts to a e t, so it joins the same group.');
    else v.hold(650);
  });
  v.say('One pass. Each key costs k log k to build, where k is the word length.');

  v.chapter('optimal', 'Optimal: letter counts as the key', { cx: 'O(n · k)', code: ['for w in strs:', '  count = [0]*26; count[c]++ for c in w', '  key = tuple(count)', '  groups[key].append(w)'] });
  v.clear();
  v.table('k', ['word', 'count signature (a … z)'], W.map((w) => {
    const c = Array(26).fill(0);
    for (const ch of w) c[ch.charCodeAt(0) - 97]++;
    return [w, c.map((x, i) => (x ? `${String.fromCharCode(97 + i)}${x}` : '')).filter(Boolean).join(' ')];
  })).tone(0, 'ok').tone(1, 'ok').tone(3, 'ok');
  v.line(1, 2).say('To drop the sort, count letters instead. The twenty-six counts form a signature that is identical for all anagrams, and building it is O of k.');
  v.answer(Object.values(groups));

  recap(v, [{ name: 'Compare with every group', time: 'O(n² · k log k)', space: 'O(nk)' }, { name: 'Sorted key', time: 'O(n · k log k)', space: 'O(nk)' }, { name: 'Count key', time: 'O(n · k)', space: 'O(nk)' }], 'A canonical key turns grouping into one pass with a hash map.', ['Group things that are "the same up to rearrangement" → canonical key in a hash map', 'Keys: sorted string, or a tuple / string of counts'], 'Find a canonical form that is identical for everything in the same group, and use it as a hash map key.');
  return v.build();
}

const problem: Problem = {
  slug: 'group-anagrams',
  statement: 'Given an array of strings `strs`, group the anagrams together. Return the groups in any order.',
  examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }, { input: 'strs = [""]', output: '[[""]]' }, { input: 'strs = ["a"]', output: '[["a"]]' }],
  constraints: ['1 ≤ strs.length ≤ 10⁴', '0 ≤ strs[i].length ≤ 100', 'lowercase letters'],
  hints: ['What do all anagrams have in common?', 'Use that common form as a hash map key.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Compare with each group', idea: 'For each word, check it against the first word of every existing group (sorted comparison); append or start a new group.', time: 'O(n² · k log k)', space: 'O(nk)', bottleneck: 'Each word is compared with every group.' },
    { id: 'better', kind: 'better', name: 'Sorted-letters key', idea: 'Map `sorted(word)` → list of words.', time: 'O(n · k log k)', space: 'O(nk)', bottleneck: 'Sorting each word costs k log k.' },
    { id: 'optimal', kind: 'optimal', name: 'Letter-count key', idea: 'Map a 26-count signature → list of words.', time: 'O(n · k)', space: 'O(nk)' },
  ],
  pitfalls: ['Python lists are not hashable: use a tuple of counts as the key.', 'In Java, build the count key as a string (e.g. "#1#0#2…") so equal counts give equal keys.'],
  takeaway: 'Group by a **canonical key** (sorted letters or letter counts) in a hash map.',
  video,
  videoArgs: [W],
  judge: {
    type: 'fn', fn: 'groupAnagrams', params: ['String[]'], ret: 'List<List<String>>', cmp: 'deepSorted',
    tests: [{ args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], out: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] }, { args: [['']], out: [['']] }, { args: [['a']], out: [['a']] }],
    gen: (r) => [Array.from({ length: r.int(1, 8) }, () => r.str(r.int(0, 3), 'abc'))],
    ref: (w: string[]) => { const g = new Map<string, string[]>(); for (const s of w) { const k = [...s].sort().join(''); g.set(k, [...(g.get(k) ?? []), s]); } return [...g.values()]; },
  },
};

export default problem;
