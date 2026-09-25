/**
 * The whole course, in teaching order. Every page, roadmap and check reads from here.
 * Each module = one concept lesson (video + article + quiz) + homework problems.
 */
import type { Difficulty, ModuleDef, PartDef, ProblemRef, Tier } from './types';

const D: Record<string, Difficulty> = { E: 'Easy', M: 'Medium', H: 'Hard' };
const T: Record<string, Tier> = { c: 'core', p: 'practice', x: 'challenge' };
const P = (slug: string, title: string, lc: number, d: 'E' | 'M' | 'H', t: 'c' | 'p' | 'x'): ProblemRef => ({ slug, title, lc, difficulty: D[d], tier: T[t] });

type M = Omit<ModuleDef, 'problems'> & { problems?: ProblemRef[] };
const mod = (m: M): ModuleDef => ({ problems: [], ...m });

export const PARTS: PartDef[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    blurb: 'How to think about problems, how to measure code, and the maths and recursion every later topic leans on.',
    modules: [
      mod({
        id: 'getting-started', title: 'How to solve a DSA problem', lesson: 'how-to-solve', lessonTitle: 'The problem-solving playbook', lessonMinutes: 14,
        blurb: 'A repeatable process: understand, try examples, brute force, optimise, code, test. Every video on DryRun follows it.',
      }),
      mod({
        id: 'time-complexity', title: 'Time complexity', lesson: 'time-complexity', lessonTitle: 'Time complexity and Big-O', lessonMinutes: 22,
        blurb: 'Count the work, not the seconds. Big-O, growth rates, and why O(n log n) beats O(n²) as soon as n gets big.',
      }),
      mod({
        id: 'space-complexity', title: 'Space complexity', lesson: 'space-complexity', lessonTitle: 'Space complexity', lessonMinutes: 12,
        blurb: 'Extra memory an algorithm needs: auxiliary arrays, hash maps, and the hidden cost of the recursion stack.',
      }),
      mod({
        id: 'complexity-in-practice', title: 'Complexity in practice', lesson: 'complexity-in-practice', lessonTitle: 'Analysing real code', lessonMinutes: 20,
        blurb: 'Loops, nested loops, halving loops, recursion trees, amortised cost, and reading constraints to guess the target complexity.',
      }),
      mod({
        id: 'recursion', title: 'Recursion', lesson: 'recursion-basics', lessonTitle: 'Recursion and the call stack', lessonMinutes: 20,
        blurb: 'A function that calls itself on a smaller input. Base cases, the call stack, and recursion trees.',
        signals: ['The problem is defined in terms of a smaller version of itself', 'Tree or nested structure', '"Generate all …"'],
        problems: [
          P('fibonacci-number', 'Fibonacci Number', 509, 'E', 'c'),
          P('powx-n', 'Pow(x, n)', 50, 'M', 'c'),
          P('find-the-winner-of-the-circular-game', 'Find the Winner of the Circular Game', 1823, 'M', 'p'),
          P('k-th-symbol-in-grammar', 'K-th Symbol in Grammar', 779, 'M', 'p'),
        ],
      }),
      mod({
        id: 'math', title: 'Math essentials', lesson: 'math-essentials', lessonTitle: 'Digits, GCD, primes and modulo', lessonMinutes: 18,
        blurb: 'Digit tricks, Euclid’s GCD, the Sieve of Eratosthenes, overflow and modular arithmetic.',
        signals: ['Digits of a number', 'Divisibility, primes, multiples', 'Answer "modulo 1e9+7"'],
        problems: [
          P('fizz-buzz', 'Fizz Buzz', 412, 'E', 'c'),
          P('palindrome-number', 'Palindrome Number', 9, 'E', 'c'),
          P('find-greatest-common-divisor-of-array', 'Find Greatest Common Divisor of Array', 1979, 'E', 'c'),
          P('count-primes', 'Count Primes', 204, 'M', 'c'),
          P('reverse-integer', 'Reverse Integer', 7, 'M', 'p'),
          P('factorial-trailing-zeroes', 'Factorial Trailing Zeroes', 172, 'M', 'p'),
        ],
      }),
      mod({
        id: 'sorting', title: 'Sorting algorithms', lesson: 'sorting-algorithms', lessonTitle: 'Bubble, insertion, merge, quick and counting sort', lessonMinutes: 30,
        blurb: 'Five sorts, animated. Why merge sort is O(n log n), when quick sort degrades, and when counting sort wins.',
        signals: ['Order matters or helps', 'Pairs that are "close" to each other', 'Custom ordering rule'],
        problems: [
          P('merge-sorted-array', 'Merge Sorted Array', 88, 'E', 'c'),
          P('sort-an-array', 'Sort an Array', 912, 'M', 'c'),
          P('height-checker', 'Height Checker', 1051, 'E', 'p'),
          P('largest-number', 'Largest Number', 179, 'M', 'p'),
        ],
      }),
    ],
  },
  {
    id: 'data-structures',
    title: 'Data structures',
    blurb: 'Every structure explained with a real-life picture, what each operation costs, and when to reach for it.',
    modules: [
      mod({
        id: 'arrays', title: 'Arrays', lesson: 'arrays', lessonTitle: 'Arrays and dynamic arrays', lessonMinutes: 18,
        blurb: 'Seats in a cinema row: instant access by number, slow to insert in the middle. Dynamic arrays and amortised growth.',
        problems: [
          P('running-sum-of-1d-array', 'Running Sum of 1d Array', 1480, 'E', 'c'),
          P('remove-element', 'Remove Element', 27, 'E', 'c'),
          P('plus-one', 'Plus One', 66, 'E', 'c'),
          P('best-time-to-buy-and-sell-stock', 'Best Time to Buy and Sell Stock', 121, 'E', 'c'),
          P('majority-element', 'Majority Element', 169, 'E', 'p'),
          P('pascals-triangle', "Pascal's Triangle", 118, 'E', 'p'),
          P('rotate-array', 'Rotate Array', 189, 'M', 'p'),
        ],
      }),
      mod({
        id: 'strings', title: 'Strings', lesson: 'strings', lessonTitle: 'Strings and characters', lessonMinutes: 15,
        blurb: 'Arrays of characters. Immutability, builders, character codes and the classic string traps.',
        problems: [
          P('length-of-last-word', 'Length of Last Word', 58, 'E', 'c'),
          P('longest-common-prefix', 'Longest Common Prefix', 14, 'E', 'c'),
          P('roman-to-integer', 'Roman to Integer', 13, 'E', 'c'),
          P('find-the-index-of-the-first-occurrence-in-a-string', 'Find the Index of the First Occurrence in a String', 28, 'E', 'c'),
          P('isomorphic-strings', 'Isomorphic Strings', 205, 'E', 'p'),
          P('reverse-words-in-a-string', 'Reverse Words in a String', 151, 'M', 'p'),
        ],
      }),
      mod({
        id: 'hashing', title: 'Hash maps and sets', lesson: 'hash-maps-and-sets', lessonTitle: 'Hash maps and hash sets', lessonMinutes: 22,
        blurb: 'A coat check: hand over a ticket, get your coat back instantly. O(1) lookups, counting, and grouping.',
        signals: ['"Have I seen this before?"', 'Count frequencies', 'Find a pair / complement', 'Group items by a key'],
        problems: [
          P('two-sum', 'Two Sum', 1, 'E', 'c'),
          P('contains-duplicate', 'Contains Duplicate', 217, 'E', 'c'),
          P('valid-anagram', 'Valid Anagram', 242, 'E', 'c'),
          P('ransom-note', 'Ransom Note', 383, 'E', 'c'),
          P('group-anagrams', 'Group Anagrams', 49, 'M', 'c'),
          P('word-pattern', 'Word Pattern', 290, 'E', 'p'),
          P('longest-consecutive-sequence', 'Longest Consecutive Sequence', 128, 'M', 'p'),
          P('valid-sudoku', 'Valid Sudoku', 36, 'M', 'p'),
        ],
      }),
      mod({
        id: 'linked-lists', title: 'Linked lists', lesson: 'linked-lists', lessonTitle: 'Linked lists', lessonMinutes: 20,
        blurb: 'Train carriages joined by couplings. Cheap inserts and deletes, no random access, and the dummy-node trick.',
        problems: [
          P('merge-two-sorted-lists', 'Merge Two Sorted Lists', 21, 'E', 'c'),
          P('remove-duplicates-from-sorted-list', 'Remove Duplicates from Sorted List', 83, 'E', 'c'),
          P('remove-linked-list-elements', 'Remove Linked List Elements', 203, 'E', 'c'),
          P('odd-even-linked-list', 'Odd Even Linked List', 328, 'M', 'p'),
          P('add-two-numbers', 'Add Two Numbers', 2, 'M', 'p'),
        ],
      }),
      mod({
        id: 'stacks', title: 'Stacks', lesson: 'stacks', lessonTitle: 'Stacks (LIFO)', lessonMinutes: 15,
        blurb: 'A stack of plates: last in, first out. Undo buttons, browser history, and matching brackets.',
        signals: ['Matching pairs (brackets, tags)', 'Undo / most recent first', 'Nested structure'],
        problems: [
          P('valid-parentheses', 'Valid Parentheses', 20, 'E', 'c'),
          P('min-stack', 'Min Stack', 155, 'M', 'c'),
          P('implement-queue-using-stacks', 'Implement Queue using Stacks', 232, 'E', 'c'),
          P('backspace-string-compare', 'Backspace String Compare', 844, 'E', 'p'),
          P('evaluate-reverse-polish-notation', 'Evaluate Reverse Polish Notation', 150, 'M', 'p'),
        ],
      }),
      mod({
        id: 'queues', title: 'Queues and deques', lesson: 'queues-and-deques', lessonTitle: 'Queues and deques (FIFO)', lessonMinutes: 14,
        blurb: 'A ticket counter line: first in, first out. Scheduling, buffering, and the double-ended deque.',
        signals: ['Process in arrival order', 'Level by level', 'Rolling window of recent items'],
        problems: [
          P('number-of-recent-calls', 'Number of Recent Calls', 933, 'E', 'c'),
          P('implement-stack-using-queues', 'Implement Stack using Queues', 225, 'E', 'c'),
          P('time-needed-to-buy-tickets', 'Time Needed to Buy Tickets', 2073, 'E', 'p'),
          P('design-circular-queue', 'Design Circular Queue', 622, 'M', 'p'),
          P('dota2-senate', 'Dota2 Senate', 649, 'M', 'x'),
        ],
      }),
      mod({
        id: 'trees', title: 'Binary trees', lesson: 'binary-trees', lessonTitle: 'Trees and binary trees', lessonMinutes: 20,
        blurb: 'Family trees, folders, org charts. Roots, leaves, height, and thinking recursively about subtrees.',
        problems: [
          P('maximum-depth-of-binary-tree', 'Maximum Depth of Binary Tree', 104, 'E', 'c'),
          P('same-tree', 'Same Tree', 100, 'E', 'c'),
          P('invert-binary-tree', 'Invert Binary Tree', 226, 'E', 'c'),
          P('symmetric-tree', 'Symmetric Tree', 101, 'E', 'p'),
          P('count-complete-tree-nodes', 'Count Complete Tree Nodes', 222, 'E', 'p'),
        ],
      }),
      mod({
        id: 'bst', title: 'Binary search trees', lesson: 'binary-search-trees', lessonTitle: 'Binary search trees', lessonMinutes: 18,
        blurb: 'Smaller to the left, bigger to the right. Search, insert and the in-order traversal that comes out sorted.',
        problems: [
          P('search-in-a-binary-search-tree', 'Search in a Binary Search Tree', 700, 'E', 'c'),
          P('insert-into-a-binary-search-tree', 'Insert into a Binary Search Tree', 701, 'M', 'c'),
          P('validate-binary-search-tree', 'Validate Binary Search Tree', 98, 'M', 'c'),
          P('kth-smallest-element-in-a-bst', 'Kth Smallest Element in a BST', 230, 'M', 'c'),
          P('lowest-common-ancestor-of-a-binary-search-tree', 'Lowest Common Ancestor of a Binary Search Tree', 235, 'M', 'p'),
        ],
      }),
      mod({
        id: 'heaps', title: 'Heaps and priority queues', lesson: 'heaps', lessonTitle: 'Heaps and priority queues', lessonMinutes: 20,
        blurb: 'An emergency room: the most urgent patient is always seen next. Sift up, sift down, and O(log n) updates.',
        signals: ['Kth largest / smallest', 'Repeatedly take the best item', 'Merge sorted streams'],
        problems: [
          P('last-stone-weight', 'Last Stone Weight', 1046, 'E', 'c'),
          P('kth-largest-element-in-an-array', 'Kth Largest Element in an Array', 215, 'M', 'c'),
          P('kth-largest-element-in-a-stream', 'Kth Largest Element in a Stream', 703, 'E', 'c'),
          P('remove-stones-to-minimize-the-total', 'Remove Stones to Minimize the Total', 1962, 'M', 'p'),
        ],
      }),
      mod({
        id: 'graphs', title: 'Graphs', lesson: 'graphs', lessonTitle: 'Graphs and how to store them', lessonMinutes: 20,
        blurb: 'Cities and roads, people and friendships. Nodes, edges, directed vs undirected, adjacency lists and matrices.',
        problems: [
          P('find-center-of-star-graph', 'Find Center of Star Graph', 1791, 'E', 'c'),
          P('find-the-town-judge', 'Find the Town Judge', 997, 'E', 'c'),
          P('find-if-path-exists-in-graph', 'Find if Path Exists in Graph', 1971, 'E', 'c'),
        ],
      }),
      mod({
        id: 'tries', title: 'Tries', lesson: 'tries', lessonTitle: 'Tries (prefix trees)', lessonMinutes: 15,
        blurb: 'Autocomplete in your phone’s keyboard. A tree of characters where shared prefixes share nodes.',
        signals: ['Many words, prefix queries', 'Autocomplete / dictionary', 'Wildcard word search'],
        problems: [
          P('implement-trie-prefix-tree', 'Implement Trie (Prefix Tree)', 208, 'M', 'c'),
          P('design-add-and-search-words-data-structure', 'Design Add and Search Words Data Structure', 211, 'M', 'p'),
        ],
      }),
      mod({
        id: 'union-find', title: 'Union-Find (DSU)', lesson: 'union-find', lessonTitle: 'Union-Find: disjoint sets', lessonMinutes: 18,
        blurb: 'Friend circles that merge. Find the group leader, union two groups, path compression and union by rank.',
        signals: ['Groups that merge over time', 'Are these two connected?', 'Count connected components', 'Detect a cycle while adding edges'],
        problems: [
          P('number-of-provinces', 'Number of Provinces', 547, 'M', 'c'),
          P('redundant-connection', 'Redundant Connection', 684, 'M', 'c'),
          P('satisfiability-of-equality-equations', 'Satisfiability of Equality Equations', 990, 'M', 'p'),
          P('number-of-operations-to-make-network-connected', 'Number of Operations to Make Network Connected', 1319, 'M', 'p'),
          P('accounts-merge', 'Accounts Merge', 721, 'M', 'x'),
        ],
      }),
      mod({
        id: 'choosing-ds', title: 'Choosing the right structure', lesson: 'choosing-a-data-structure', lessonTitle: 'Which data structure should I use?', lessonMinutes: 12,
        blurb: 'A decision guide: from the operations you need to the structure that makes them cheap.',
      }),
    ],
  },
  {
    id: 'patterns',
    title: 'Patterns',
    blurb: 'The techniques interviewers ask again and again, in an order where each one builds on the last.',
    modules: [
      /* Arrays & strings */
      mod({
        id: 'two-pointers', section: 'Arrays and strings', title: 'Two pointers', lesson: 'two-pointers', lessonTitle: 'Two pointers', lessonMinutes: 20,
        blurb: 'Two indexes that move toward each other or in the same direction, so one pass replaces a nested loop.',
        signals: ['Sorted array + find a pair/triplet', 'Palindromes', 'In-place rearranging (read/write pointers)', 'Compare both ends'],
        problems: [
          P('reverse-string', 'Reverse String', 344, 'E', 'c'),
          P('valid-palindrome', 'Valid Palindrome', 125, 'E', 'c'),
          P('squares-of-a-sorted-array', 'Squares of a Sorted Array', 977, 'E', 'c'),
          P('remove-duplicates-from-sorted-array', 'Remove Duplicates from Sorted Array', 26, 'E', 'c'),
          P('move-zeroes', 'Move Zeroes', 283, 'E', 'c'),
          P('two-sum-ii-input-array-is-sorted', 'Two Sum II - Input Array Is Sorted', 167, 'M', 'c'),
          P('3sum', '3Sum', 15, 'M', 'c'),
          P('container-with-most-water', 'Container With Most Water', 11, 'M', 'c'),
          P('valid-palindrome-ii', 'Valid Palindrome II', 680, 'E', 'p'),
          P('sort-colors', 'Sort Colors', 75, 'M', 'p'),
          P('3sum-closest', '3Sum Closest', 16, 'M', 'p'),
          P('4sum', '4Sum', 18, 'M', 'x'),
          P('trapping-rain-water', 'Trapping Rain Water', 42, 'H', 'x'),
        ],
      }),
      mod({
        id: 'sliding-window', section: 'Arrays and strings', title: 'Sliding window', lesson: 'sliding-window', lessonTitle: 'Sliding window', lessonMinutes: 24,
        blurb: 'A window over a contiguous range that grows on the right and shrinks on the left, reusing work as it slides.',
        signals: ['Contiguous subarray / substring', 'Longest / shortest / count with a condition', 'Window of size k'],
        problems: [
          P('maximum-average-subarray-i', 'Maximum Average Subarray I', 643, 'E', 'c'),
          P('longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters', 3, 'M', 'c'),
          P('minimum-size-subarray-sum', 'Minimum Size Subarray Sum', 209, 'M', 'c'),
          P('longest-repeating-character-replacement', 'Longest Repeating Character Replacement', 424, 'M', 'c'),
          P('permutation-in-string', 'Permutation in String', 567, 'M', 'c'),
          P('maximum-number-of-vowels-in-a-substring-of-given-length', 'Maximum Number of Vowels in a Substring of Given Length', 1456, 'M', 'p'),
          P('max-consecutive-ones-iii', 'Max Consecutive Ones III', 1004, 'M', 'p'),
          P('find-all-anagrams-in-a-string', 'Find All Anagrams in a String', 438, 'M', 'p'),
          P('fruit-into-baskets', 'Fruit Into Baskets', 904, 'M', 'p'),
          P('minimum-window-substring', 'Minimum Window Substring', 76, 'H', 'x'),
        ],
      }),
      mod({
        id: 'prefix-sum', section: 'Arrays and strings', title: 'Prefix sums', lesson: 'prefix-sum', lessonTitle: 'Prefix sums and difference arrays', lessonMinutes: 20,
        blurb: 'Precompute running totals once, then answer any range-sum question in O(1). Plus the hash-map trick for "subarray sums to k".',
        signals: ['Many range-sum queries', 'Subarray sum equals / divisible by k', 'Many range updates'],
        problems: [
          P('range-sum-query-immutable', 'Range Sum Query - Immutable', 303, 'E', 'c'),
          P('find-pivot-index', 'Find Pivot Index', 724, 'E', 'c'),
          P('subarray-sum-equals-k', 'Subarray Sum Equals K', 560, 'M', 'c'),
          P('product-of-array-except-self', 'Product of Array Except Self', 238, 'M', 'c'),
          P('contiguous-array', 'Contiguous Array', 525, 'M', 'p'),
          P('subarray-sums-divisible-by-k', 'Subarray Sums Divisible by K', 974, 'M', 'p'),
          P('range-sum-query-2d-immutable', 'Range Sum Query 2D - Immutable', 304, 'M', 'p'),
          P('car-pooling', 'Car Pooling', 1094, 'M', 'p'),
          P('corporate-flight-bookings', 'Corporate Flight Bookings', 1109, 'M', 'p'),
        ],
      }),
      mod({
        id: 'kadane', section: 'Arrays and strings', title: "Kadane's algorithm", lesson: 'kadanes-algorithm', lessonTitle: "Kadane's algorithm", lessonMinutes: 14,
        blurb: 'Best subarray ending here = extend the previous one or start fresh. The first taste of dynamic programming.',
        signals: ['Maximum / minimum subarray sum or product', 'Best contiguous stretch'],
        problems: [
          P('maximum-subarray', 'Maximum Subarray', 53, 'M', 'c'),
          P('maximum-product-subarray', 'Maximum Product Subarray', 152, 'M', 'c'),
          P('maximum-absolute-sum-of-any-subarray', 'Maximum Absolute Sum of Any Subarray', 1749, 'M', 'p'),
          P('maximum-sum-circular-subarray', 'Maximum Sum Circular Subarray', 918, 'M', 'x'),
        ],
      }),
      mod({
        id: 'matrix', section: 'Arrays and strings', title: 'Matrix traversal', lesson: 'matrix-traversal', lessonTitle: 'Working with 2D grids', lessonMinutes: 16,
        blurb: 'Rows, columns, directions and boundaries. Rotations, spirals, and using the matrix itself as memory.',
        signals: ['2D grid / matrix', 'Rotate or transpose', 'Walk in a pattern'],
        problems: [
          P('rotate-image', 'Rotate Image', 48, 'M', 'c'),
          P('spiral-matrix', 'Spiral Matrix', 54, 'M', 'c'),
          P('set-matrix-zeroes', 'Set Matrix Zeroes', 73, 'M', 'c'),
          P('game-of-life', 'Game of Life', 289, 'M', 'p'),
          P('search-a-2d-matrix-ii', 'Search a 2D Matrix II', 240, 'M', 'p'),
        ],
      }),
      /* Searching */
      mod({
        id: 'binary-search', section: 'Searching', title: 'Binary search', lesson: 'binary-search', lessonTitle: 'Binary search', lessonMinutes: 24,
        blurb: 'Halve the search space every step. Exact match, first/last position, and rotated arrays, without off-by-one bugs.',
        signals: ['Sorted (or partly sorted) input', 'Find a position / boundary', 'O(log n) required'],
        problems: [
          P('binary-search', 'Binary Search', 704, 'E', 'c'),
          P('search-insert-position', 'Search Insert Position', 35, 'E', 'c'),
          P('sqrtx', 'Sqrt(x)', 69, 'E', 'c'),
          P('find-first-and-last-position-of-element-in-sorted-array', 'Find First and Last Position of Element in Sorted Array', 34, 'M', 'c'),
          P('search-a-2d-matrix', 'Search a 2D Matrix', 74, 'M', 'c'),
          P('search-in-rotated-sorted-array', 'Search in Rotated Sorted Array', 33, 'M', 'c'),
          P('find-minimum-in-rotated-sorted-array', 'Find Minimum in Rotated Sorted Array', 153, 'M', 'c'),
          P('find-peak-element', 'Find Peak Element', 162, 'M', 'p'),
          P('single-element-in-a-sorted-array', 'Single Element in a Sorted Array', 540, 'M', 'p'),
          P('median-of-two-sorted-arrays', 'Median of Two Sorted Arrays', 4, 'H', 'x'),
        ],
      }),
      mod({
        id: 'binary-search-answer', section: 'Searching', title: 'Binary search on the answer', lesson: 'binary-search-on-answer', lessonTitle: 'Binary search on the answer', lessonMinutes: 18,
        blurb: 'When "can we do it with X?" flips from no to yes at one point, binary search over X itself.',
        signals: ['Minimise the maximum / maximise the minimum', 'Smallest speed / capacity / days that works', 'A yes/no check that is monotonic'],
        problems: [
          P('koko-eating-bananas', 'Koko Eating Bananas', 875, 'M', 'c'),
          P('capacity-to-ship-packages-within-d-days', 'Capacity To Ship Packages Within D Days', 1011, 'M', 'c'),
          P('find-the-smallest-divisor-given-a-threshold', 'Find the Smallest Divisor Given a Threshold', 1283, 'M', 'p'),
          P('minimum-number-of-days-to-make-m-bouquets', 'Minimum Number of Days to Make m Bouquets', 1482, 'M', 'p'),
          P('split-array-largest-sum', 'Split Array Largest Sum', 410, 'H', 'x'),
        ],
      }),
      mod({
        id: 'cyclic-sort', section: 'Searching', title: 'Cyclic sort', lesson: 'cyclic-sort', lessonTitle: 'Cyclic sort: index as a hash', lessonMinutes: 14,
        blurb: 'Numbers in range 1..n belong at index n-1. Put each one home, then the misfits reveal the answer.',
        signals: ['Numbers in the range 1..n or 0..n', 'Find missing / duplicate numbers', 'O(1) extra space'],
        problems: [
          P('missing-number', 'Missing Number', 268, 'E', 'c'),
          P('find-all-numbers-disappeared-in-an-array', 'Find All Numbers Disappeared in an Array', 448, 'E', 'c'),
          P('find-the-duplicate-number', 'Find the Duplicate Number', 287, 'M', 'c'),
          P('set-mismatch', 'Set Mismatch', 645, 'E', 'p'),
          P('find-all-duplicates-in-an-array', 'Find All Duplicates in an Array', 442, 'M', 'p'),
          P('first-missing-positive', 'First Missing Positive', 41, 'H', 'x'),
        ],
      }),
      /* Linked lists */
      mod({
        id: 'fast-slow-pointers', section: 'Linked lists', title: 'Fast and slow pointers', lesson: 'fast-and-slow-pointers', lessonTitle: 'Fast and slow pointers', lessonMinutes: 18,
        blurb: 'A tortoise and a hare. Find the middle, detect cycles, and find where the cycle starts.',
        signals: ['Linked list middle', 'Cycle detection', 'Sequence that may loop forever'],
        problems: [
          P('middle-of-the-linked-list', 'Middle of the Linked List', 876, 'E', 'c'),
          P('linked-list-cycle', 'Linked List Cycle', 141, 'E', 'c'),
          P('happy-number', 'Happy Number', 202, 'E', 'c'),
          P('remove-nth-node-from-end-of-list', 'Remove Nth Node From End of List', 19, 'M', 'c'),
          P('linked-list-cycle-ii', 'Linked List Cycle II', 142, 'M', 'c'),
          P('palindrome-linked-list', 'Palindrome Linked List', 234, 'E', 'p'),
          P('delete-the-middle-node-of-a-linked-list', 'Delete the Middle Node of a Linked List', 2095, 'M', 'p'),
          P('reorder-list', 'Reorder List', 143, 'M', 'x'),
        ],
      }),
      mod({
        id: 'linked-list-reversal', section: 'Linked lists', title: 'In-place reversal', lesson: 'in-place-reversal', lessonTitle: 'Reversing a linked list in place', lessonMinutes: 16,
        blurb: 'prev, curr, next: three pointers that flip arrows one at a time. Then reverse parts and groups.',
        signals: ['Reverse all or part of a list', 'Swap nodes in pairs / groups', 'O(1) extra space on a list'],
        problems: [
          P('reverse-linked-list', 'Reverse Linked List', 206, 'E', 'c'),
          P('reverse-linked-list-ii', 'Reverse Linked List II', 92, 'M', 'c'),
          P('swap-nodes-in-pairs', 'Swap Nodes in Pairs', 24, 'M', 'c'),
          P('rotate-list', 'Rotate List', 61, 'M', 'p'),
          P('maximum-twin-sum-of-a-linked-list', 'Maximum Twin Sum of a Linked List', 2130, 'M', 'p'),
          P('reverse-nodes-in-k-group', 'Reverse Nodes in k-Group', 25, 'H', 'x'),
        ],
      }),
      /* Stacks & queues */
      mod({
        id: 'stack-patterns', section: 'Stacks and queues', title: 'Stack patterns', lesson: 'stack-patterns', lessonTitle: 'Stacks for matching, parsing and simulation', lessonMinutes: 18,
        blurb: 'Use a stack whenever the most recent unfinished thing decides what happens next.',
        signals: ['Brackets / nesting', 'Cancel adjacent items', 'Evaluate an expression', 'Collisions'],
        problems: [
          P('remove-all-adjacent-duplicates-in-string', 'Remove All Adjacent Duplicates In String', 1047, 'E', 'c'),
          P('minimum-remove-to-make-valid-parentheses', 'Minimum Remove to Make Valid Parentheses', 1249, 'M', 'c'),
          P('decode-string', 'Decode String', 394, 'M', 'c'),
          P('asteroid-collision', 'Asteroid Collision', 735, 'M', 'c'),
          P('simplify-path', 'Simplify Path', 71, 'M', 'p'),
          P('basic-calculator-ii', 'Basic Calculator II', 227, 'M', 'p'),
          P('basic-calculator', 'Basic Calculator', 224, 'H', 'x'),
          P('longest-valid-parentheses', 'Longest Valid Parentheses', 32, 'H', 'x'),
        ],
      }),
      mod({
        id: 'monotonic-stack', section: 'Stacks and queues', title: 'Monotonic stack', lesson: 'monotonic-stack', lessonTitle: 'Monotonic stack', lessonMinutes: 20,
        blurb: 'Keep the stack sorted by popping anything the new element beats. Next greater element in O(n).',
        signals: ['Next greater / smaller element', 'Previous greater / smaller', 'Span, histogram, "how far until"'],
        problems: [
          P('next-greater-element-i', 'Next Greater Element I', 496, 'E', 'c'),
          P('daily-temperatures', 'Daily Temperatures', 739, 'M', 'c'),
          P('next-greater-element-ii', 'Next Greater Element II', 503, 'M', 'c'),
          P('online-stock-span', 'Online Stock Span', 901, 'M', 'p'),
          P('remove-k-digits', 'Remove K Digits', 402, 'M', 'p'),
          P('sum-of-subarray-minimums', 'Sum of Subarray Minimums', 907, 'M', 'x'),
          P('largest-rectangle-in-histogram', 'Largest Rectangle in Histogram', 84, 'H', 'x'),
          P('maximal-rectangle', 'Maximal Rectangle', 85, 'H', 'x'),
        ],
      }),
      mod({
        id: 'monotonic-queue', section: 'Stacks and queues', title: 'Monotonic queue', lesson: 'monotonic-queue', lessonTitle: 'Monotonic deque', lessonMinutes: 14,
        blurb: 'A deque that keeps the best candidates of a sliding window in order. Window max/min in O(n).',
        signals: ['Max / min of every window', 'Sliding window + need the extreme value'],
        problems: [
          P('sliding-window-maximum', 'Sliding Window Maximum', 239, 'H', 'c'),
          P('longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit', 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit', 1438, 'M', 'p'),
          P('shortest-subarray-with-sum-at-least-k', 'Shortest Subarray with Sum at Least K', 862, 'H', 'x'),
        ],
      }),
      /* Intervals & heaps */
      mod({
        id: 'intervals', section: 'Intervals and heaps', title: 'Intervals', lesson: 'intervals', lessonTitle: 'Merging and scheduling intervals', lessonMinutes: 18,
        blurb: 'Sort by start (or end), then sweep. Merge, insert, remove overlaps and count rooms.',
        signals: ['Ranges [start, end]', 'Overlaps, meetings, bookings', 'Minimum removals / arrows / rooms'],
        problems: [
          P('merge-intervals', 'Merge Intervals', 56, 'M', 'c'),
          P('insert-interval', 'Insert Interval', 57, 'M', 'c'),
          P('non-overlapping-intervals', 'Non-overlapping Intervals', 435, 'M', 'c'),
          P('minimum-number-of-arrows-to-burst-balloons', 'Minimum Number of Arrows to Burst Balloons', 452, 'M', 'p'),
          P('interval-list-intersections', 'Interval List Intersections', 986, 'M', 'p'),
          P('remove-covered-intervals', 'Remove Covered Intervals', 1288, 'M', 'p'),
          P('divide-intervals-into-minimum-number-of-groups', 'Divide Intervals Into Minimum Number of Groups', 2406, 'M', 'p'),
        ],
      }),
      mod({
        id: 'top-k', section: 'Intervals and heaps', title: 'Top K elements', lesson: 'top-k-elements', lessonTitle: 'Top K with heaps', lessonMinutes: 16,
        blurb: 'Keep a heap of size k: the smallest of the k best sits on top and is easy to evict.',
        signals: ['K largest / smallest / most frequent / closest', 'Rank items without full sorting'],
        problems: [
          P('top-k-frequent-elements', 'Top K Frequent Elements', 347, 'M', 'c'),
          P('k-closest-points-to-origin', 'K Closest Points to Origin', 973, 'M', 'c'),
          P('sort-characters-by-frequency', 'Sort Characters By Frequency', 451, 'M', 'c'),
          P('top-k-frequent-words', 'Top K Frequent Words', 692, 'M', 'p'),
          P('find-k-closest-elements', 'Find K Closest Elements', 658, 'M', 'p'),
          P('task-scheduler', 'Task Scheduler', 621, 'M', 'p'),
          P('reorganize-string', 'Reorganize String', 767, 'M', 'p'),
        ],
      }),
      mod({
        id: 'k-way-merge', section: 'Intervals and heaps', title: 'K-way merge', lesson: 'k-way-merge', lessonTitle: 'K-way merge', lessonMinutes: 14,
        blurb: 'Merge k sorted lists by always taking the smallest head, found in O(log k) with a heap.',
        signals: ['k sorted lists / arrays / rows', 'Kth smallest across sorted sources'],
        problems: [
          P('merge-k-sorted-lists', 'Merge k Sorted Lists', 23, 'H', 'c'),
          P('kth-smallest-element-in-a-sorted-matrix', 'Kth Smallest Element in a Sorted Matrix', 378, 'M', 'p'),
          P('find-k-pairs-with-smallest-sums', 'Find K Pairs with Smallest Sums', 373, 'M', 'x'),
          P('smallest-range-covering-elements-from-k-lists', 'Smallest Range Covering Elements from K Lists', 632, 'H', 'x'),
        ],
      }),
      mod({
        id: 'two-heaps', section: 'Intervals and heaps', title: 'Two heaps', lesson: 'two-heaps', lessonTitle: 'Two heaps for medians', lessonMinutes: 14,
        blurb: 'A max-heap for the smaller half and a min-heap for the bigger half. The median sits between their tops.',
        signals: ['Running median', 'Split into smaller half / bigger half', 'Best choice under a changing budget'],
        advanced: true,
        problems: [
          P('find-median-from-data-stream', 'Find Median from Data Stream', 295, 'H', 'c'),
          P('sliding-window-median', 'Sliding Window Median', 480, 'H', 'x'),
          P('ipo', 'IPO', 502, 'H', 'x'),
        ],
      }),
      /* Greedy & backtracking */
      mod({
        id: 'greedy', section: 'Greedy and backtracking', title: 'Greedy', lesson: 'greedy', lessonTitle: 'Greedy algorithms', lessonMinutes: 20,
        blurb: 'Make the locally best choice and never look back, but only after convincing yourself it can’t hurt.',
        signals: ['Maximise / minimise with a simple local rule', 'Scheduling, jumping, assigning', 'Sorting makes the choice obvious'],
        problems: [
          P('assign-cookies', 'Assign Cookies', 455, 'E', 'c'),
          P('best-time-to-buy-and-sell-stock-ii', 'Best Time to Buy and Sell Stock II', 122, 'M', 'c'),
          P('jump-game', 'Jump Game', 55, 'M', 'c'),
          P('jump-game-ii', 'Jump Game II', 45, 'M', 'c'),
          P('partition-labels', 'Partition Labels', 763, 'M', 'c'),
          P('gas-station', 'Gas Station', 134, 'M', 'p'),
          P('hand-of-straights', 'Hand of Straights', 846, 'M', 'p'),
          P('valid-parenthesis-string', 'Valid Parenthesis String', 678, 'M', 'p'),
          P('two-city-scheduling', 'Two City Scheduling', 1029, 'M', 'p'),
          P('candy', 'Candy', 135, 'H', 'x'),
        ],
      }),
      mod({
        id: 'backtracking', section: 'Greedy and backtracking', title: 'Backtracking', lesson: 'backtracking', lessonTitle: 'Backtracking: choose, explore, un-choose', lessonMinutes: 26,
        blurb: 'Build a solution one choice at a time, and undo the choice when it leads nowhere. Subsets, permutations, boards.',
        signals: ['"Return all …" combinations / permutations / subsets', 'Place items under constraints', 'Search a board for a word'],
        problems: [
          P('subsets', 'Subsets', 78, 'M', 'c'),
          P('permutations', 'Permutations', 46, 'M', 'c'),
          P('combinations', 'Combinations', 77, 'M', 'c'),
          P('combination-sum', 'Combination Sum', 39, 'M', 'c'),
          P('letter-combinations-of-a-phone-number', 'Letter Combinations of a Phone Number', 17, 'M', 'c'),
          P('generate-parentheses', 'Generate Parentheses', 22, 'M', 'c'),
          P('word-search', 'Word Search', 79, 'M', 'c'),
          P('subsets-ii', 'Subsets II', 90, 'M', 'p'),
          P('permutations-ii', 'Permutations II', 47, 'M', 'p'),
          P('combination-sum-ii', 'Combination Sum II', 40, 'M', 'p'),
          P('combination-sum-iii', 'Combination Sum III', 216, 'M', 'p'),
          P('palindrome-partitioning', 'Palindrome Partitioning', 131, 'M', 'p'),
          P('n-queens', 'N-Queens', 51, 'H', 'x'),
          P('sudoku-solver', 'Sudoku Solver', 37, 'H', 'x'),
        ],
      }),
      /* Trees */
      mod({
        id: 'tree-dfs', section: 'Trees', title: 'Tree DFS', lesson: 'tree-dfs', lessonTitle: 'Depth-first search on trees', lessonMinutes: 26,
        blurb: 'Pre-order, in-order, post-order, and the post-order trick: ask your children, then answer for yourself.',
        signals: ['Root-to-leaf paths', 'Height / diameter / balance', 'Answer depends on subtrees'],
        problems: [
          P('binary-tree-preorder-traversal', 'Binary Tree Preorder Traversal', 144, 'E', 'c'),
          P('binary-tree-inorder-traversal', 'Binary Tree Inorder Traversal', 94, 'E', 'c'),
          P('binary-tree-postorder-traversal', 'Binary Tree Postorder Traversal', 145, 'E', 'c'),
          P('path-sum', 'Path Sum', 112, 'E', 'c'),
          P('diameter-of-binary-tree', 'Diameter of Binary Tree', 543, 'E', 'c'),
          P('balanced-binary-tree', 'Balanced Binary Tree', 110, 'E', 'c'),
          P('lowest-common-ancestor-of-a-binary-tree', 'Lowest Common Ancestor of a Binary Tree', 236, 'M', 'c'),
          P('construct-binary-tree-from-preorder-and-inorder-traversal', 'Construct Binary Tree from Preorder and Inorder Traversal', 105, 'M', 'c'),
          P('binary-tree-paths', 'Binary Tree Paths', 257, 'E', 'p'),
          P('subtree-of-another-tree', 'Subtree of Another Tree', 572, 'E', 'p'),
          P('path-sum-ii', 'Path Sum II', 113, 'M', 'p'),
          P('path-sum-iii', 'Path Sum III', 437, 'M', 'p'),
          P('flatten-binary-tree-to-linked-list', 'Flatten Binary Tree to Linked List', 114, 'M', 'p'),
          P('binary-tree-maximum-path-sum', 'Binary Tree Maximum Path Sum', 124, 'H', 'x'),
        ],
      }),
      mod({
        id: 'tree-bfs', section: 'Trees', title: 'Tree BFS', lesson: 'tree-bfs', lessonTitle: 'Breadth-first search: level by level', lessonMinutes: 16,
        blurb: 'A queue processes one level at a time. Level order, zigzag, right side view, minimum depth.',
        signals: ['Level by level', 'Closest to the root', 'Per-level answers (average, max, rightmost)'],
        problems: [
          P('binary-tree-level-order-traversal', 'Binary Tree Level Order Traversal', 102, 'M', 'c'),
          P('average-of-levels-in-binary-tree', 'Average of Levels in Binary Tree', 637, 'E', 'c'),
          P('minimum-depth-of-binary-tree', 'Minimum Depth of Binary Tree', 111, 'E', 'c'),
          P('binary-tree-zigzag-level-order-traversal', 'Binary Tree Zigzag Level Order Traversal', 103, 'M', 'c'),
          P('binary-tree-right-side-view', 'Binary Tree Right Side View', 199, 'M', 'c'),
          P('binary-tree-level-order-traversal-ii', 'Binary Tree Level Order Traversal II', 107, 'M', 'p'),
          P('cousins-in-binary-tree', 'Cousins in Binary Tree', 993, 'E', 'p'),
          P('maximum-level-sum-of-a-binary-tree', 'Maximum Level Sum of a Binary Tree', 1161, 'M', 'p'),
          P('maximum-width-of-binary-tree', 'Maximum Width of Binary Tree', 662, 'M', 'p'),
        ],
      }),
      mod({
        id: 'bst-patterns', section: 'Trees', title: 'BST patterns', lesson: 'bst-patterns', lessonTitle: 'Using the BST property', lessonMinutes: 14,
        blurb: 'Sorted order for free: build balanced BSTs, iterate lazily, delete nodes, and search with bounds.',
        signals: ['Binary search tree input', 'Sorted order needed from a tree', 'Build a balanced tree'],
        problems: [
          P('convert-sorted-array-to-binary-search-tree', 'Convert Sorted Array to Binary Search Tree', 108, 'E', 'c'),
          P('minimum-absolute-difference-in-bst', 'Minimum Absolute Difference in BST', 530, 'E', 'c'),
          P('delete-node-in-a-bst', 'Delete Node in a BST', 450, 'M', 'c'),
          P('two-sum-iv-input-is-a-bst', 'Two Sum IV - Input is a BST', 653, 'E', 'p'),
          P('binary-search-tree-iterator', 'Binary Search Tree Iterator', 173, 'M', 'p'),
        ],
      }),
      /* Graphs */
      mod({
        id: 'graph-traversal', section: 'Graphs', title: 'Graph BFS and DFS', lesson: 'graph-bfs-dfs', lessonTitle: 'BFS and DFS on graphs and grids', lessonMinutes: 26,
        blurb: 'Visit everything reachable exactly once. Islands, flood fill, bipartite checks and shortest paths in unweighted graphs.',
        signals: ['Grid of land / water, connected regions', 'Reachability', 'Shortest path with equal edge weights'],
        problems: [
          P('flood-fill', 'Flood Fill', 733, 'E', 'c'),
          P('number-of-islands', 'Number of Islands', 200, 'M', 'c'),
          P('max-area-of-island', 'Max Area of Island', 695, 'M', 'c'),
          P('keys-and-rooms', 'Keys and Rooms', 841, 'M', 'c'),
          P('is-graph-bipartite', 'Is Graph Bipartite?', 785, 'M', 'c'),
          P('island-perimeter', 'Island Perimeter', 463, 'E', 'p'),
          P('surrounded-regions', 'Surrounded Regions', 130, 'M', 'p'),
          P('pacific-atlantic-water-flow', 'Pacific Atlantic Water Flow', 417, 'M', 'p'),
          P('number-of-enclaves', 'Number of Enclaves', 1020, 'M', 'p'),
          P('shortest-path-in-binary-matrix', 'Shortest Path in Binary Matrix', 1091, 'M', 'p'),
          P('word-ladder', 'Word Ladder', 127, 'H', 'x'),
        ],
      }),
      mod({
        id: 'multi-source-bfs', section: 'Graphs', title: 'Multi-source BFS', lesson: 'multi-source-bfs', lessonTitle: 'Multi-source BFS', lessonMinutes: 12,
        blurb: 'Start BFS from every source at once. Rotting oranges, nearest zero, distance from land.',
        signals: ['Distance to the nearest of many sources', 'Something spreads minute by minute'],
        problems: [
          P('rotting-oranges', 'Rotting Oranges', 994, 'M', 'c'),
          P('01-matrix', '01 Matrix', 542, 'M', 'c'),
          P('as-far-from-land-as-possible', 'As Far from Land as Possible', 1162, 'M', 'p'),
          P('map-of-highest-peak', 'Map of Highest Peak', 1765, 'M', 'p'),
          P('shortest-bridge', 'Shortest Bridge', 934, 'M', 'x'),
        ],
      }),
      mod({
        id: 'topological-sort', section: 'Graphs', title: 'Topological sort', lesson: 'topological-sort', lessonTitle: 'Topological sort (Kahn’s algorithm)', lessonMinutes: 18,
        blurb: 'Order tasks so every prerequisite comes first. Indegrees, a queue, and cycle detection for free.',
        signals: ['Prerequisites / dependencies', 'Build order', 'Detect a cycle in a directed graph'],
        problems: [
          P('course-schedule', 'Course Schedule', 207, 'M', 'c'),
          P('course-schedule-ii', 'Course Schedule II', 210, 'M', 'c'),
          P('find-eventual-safe-states', 'Find Eventual Safe States', 802, 'M', 'p'),
          P('course-schedule-iv', 'Course Schedule IV', 1462, 'M', 'p'),
          P('find-all-possible-recipes-from-given-supplies', 'Find All Possible Recipes from Given Supplies', 2115, 'M', 'p'),
          P('minimum-height-trees', 'Minimum Height Trees', 310, 'M', 'x'),
        ],
      }),
      mod({
        id: 'shortest-paths', section: 'Graphs', title: 'Shortest paths', lesson: 'shortest-paths', lessonTitle: 'Dijkstra, Bellman-Ford and Floyd-Warshall', lessonMinutes: 28,
        blurb: 'Weighted shortest paths. Dijkstra with a heap, Bellman-Ford for limited hops, Floyd-Warshall for all pairs.',
        signals: ['Weighted edges', 'Cheapest / fastest route', 'At most k stops'],
        problems: [
          P('network-delay-time', 'Network Delay Time', 743, 'M', 'c'),
          P('cheapest-flights-within-k-stops', 'Cheapest Flights Within K Stops', 787, 'M', 'c'),
          P('path-with-minimum-effort', 'Path With Minimum Effort', 1631, 'M', 'p'),
          P('path-with-maximum-probability', 'Path with Maximum Probability', 1514, 'M', 'p'),
          P('find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance', 'Find the City With the Smallest Number of Neighbors at a Threshold Distance', 1334, 'M', 'p'),
          P('swim-in-rising-water', 'Swim in Rising Water', 778, 'H', 'x'),
        ],
      }),
      mod({
        id: 'mst', section: 'Graphs', title: 'Minimum spanning tree', lesson: 'minimum-spanning-tree', lessonTitle: 'Kruskal and Prim', lessonMinutes: 16,
        blurb: 'Connect every node with the cheapest total wire. Kruskal sorts edges and uses Union-Find; Prim grows a tree with a heap.',
        signals: ['Connect all points at minimum total cost', 'Cheapest network'],
        advanced: true,
        problems: [P('min-cost-to-connect-all-points', 'Min Cost to Connect All Points', 1584, 'M', 'c')],
      }),
      mod({
        id: 'trie-patterns', section: 'Graphs', title: 'Trie patterns', lesson: 'trie-patterns', lessonTitle: 'Solving problems with tries', lessonMinutes: 14,
        blurb: 'Prefix search, autocomplete, and the bitwise trie that finds maximum XOR.',
        signals: ['Many words and prefix lookups', 'Search many words on a board', 'Maximise XOR'],
        advanced: true,
        problems: [
          P('search-suggestions-system', 'Search Suggestions System', 1268, 'M', 'c'),
          P('replace-words', 'Replace Words', 648, 'M', 'p'),
          P('longest-word-in-dictionary', 'Longest Word in Dictionary', 720, 'M', 'p'),
          P('maximum-xor-of-two-numbers-in-an-array', 'Maximum XOR of Two Numbers in an Array', 421, 'M', 'x'),
          P('word-search-ii', 'Word Search II', 212, 'H', 'x'),
        ],
      }),
      /* Dynamic programming */
      mod({
        id: 'dp-1d', section: 'Dynamic programming', title: 'DP: the basics (1D)', lesson: 'dp-introduction', lessonTitle: 'Dynamic programming from scratch', lessonMinutes: 30,
        blurb: 'Recursion → memoisation → tabulation → space optimisation. The four steps that crack every DP problem.',
        signals: ['Count the ways / min cost / max value', 'Choices at each step', 'Overlapping subproblems in the recursion'],
        problems: [
          P('climbing-stairs', 'Climbing Stairs', 70, 'E', 'c'),
          P('min-cost-climbing-stairs', 'Min Cost Climbing Stairs', 746, 'E', 'c'),
          P('house-robber', 'House Robber', 198, 'M', 'c'),
          P('house-robber-ii', 'House Robber II', 213, 'M', 'c'),
          P('coin-change', 'Coin Change', 322, 'M', 'c'),
          P('word-break', 'Word Break', 139, 'M', 'c'),
          P('n-th-tribonacci-number', 'N-th Tribonacci Number', 1137, 'E', 'p'),
          P('decode-ways', 'Decode Ways', 91, 'M', 'p'),
          P('delete-and-earn', 'Delete and Earn', 740, 'M', 'p'),
          P('combination-sum-iv', 'Combination Sum IV', 377, 'M', 'p'),
        ],
      }),
      mod({
        id: 'dp-grid', section: 'Dynamic programming', title: 'DP on grids', lesson: 'dp-on-grids', lessonTitle: '2D DP on grids', lessonMinutes: 18,
        blurb: 'Each cell’s answer comes from its neighbours above and to the left. Paths, costs and squares.',
        signals: ['Move right / down on a grid', 'Count paths or min path cost', 'Largest square / region'],
        problems: [
          P('unique-paths', 'Unique Paths', 62, 'M', 'c'),
          P('unique-paths-ii', 'Unique Paths II', 63, 'M', 'c'),
          P('minimum-path-sum', 'Minimum Path Sum', 64, 'M', 'c'),
          P('maximal-square', 'Maximal Square', 221, 'M', 'c'),
          P('triangle', 'Triangle', 120, 'M', 'p'),
          P('minimum-falling-path-sum', 'Minimum Falling Path Sum', 931, 'M', 'p'),
          P('dungeon-game', 'Dungeon Game', 174, 'H', 'x'),
        ],
      }),
      mod({
        id: 'dp-knapsack', section: 'Dynamic programming', title: 'Knapsack', lesson: 'knapsack', lessonTitle: '0/1 and unbounded knapsack', lessonMinutes: 24,
        blurb: 'Take it or leave it. Subset sums, target sums and coin combinations are all the same table.',
        signals: ['Pick items to hit a target sum / capacity', 'Each item once (0/1) or unlimited', 'Split into two equal halves'],
        problems: [
          P('partition-equal-subset-sum', 'Partition Equal Subset Sum', 416, 'M', 'c'),
          P('target-sum', 'Target Sum', 494, 'M', 'c'),
          P('coin-change-ii', 'Coin Change II', 518, 'M', 'c'),
          P('perfect-squares', 'Perfect Squares', 279, 'M', 'p'),
          P('ones-and-zeroes', 'Ones and Zeroes', 474, 'M', 'p'),
          P('last-stone-weight-ii', 'Last Stone Weight II', 1049, 'M', 'p'),
        ],
      }),
      mod({
        id: 'dp-subsequences', section: 'Dynamic programming', title: 'DP on subsequences', lesson: 'dp-on-subsequences', lessonTitle: 'LIS, LCS and edit distance', lessonMinutes: 28,
        blurb: 'Two strings, two indexes, one table. The family behind diff tools and spell checkers.',
        signals: ['Subsequence (not contiguous)', 'Compare two strings', 'Minimum edits / deletions'],
        problems: [
          P('longest-increasing-subsequence', 'Longest Increasing Subsequence', 300, 'M', 'c'),
          P('longest-common-subsequence', 'Longest Common Subsequence', 1143, 'M', 'c'),
          P('edit-distance', 'Edit Distance', 72, 'M', 'c'),
          P('delete-operation-for-two-strings', 'Delete Operation for Two Strings', 583, 'M', 'p'),
          P('interleaving-string', 'Interleaving String', 97, 'M', 'p'),
          P('number-of-longest-increasing-subsequence', 'Number of Longest Increasing Subsequence', 673, 'M', 'p'),
          P('longest-string-chain', 'Longest String Chain', 1048, 'M', 'p'),
          P('distinct-subsequences', 'Distinct Subsequences', 115, 'H', 'x'),
          P('russian-doll-envelopes', 'Russian Doll Envelopes', 354, 'H', 'x'),
        ],
      }),
      mod({
        id: 'dp-palindromes', section: 'Dynamic programming', title: 'DP on palindromes', lesson: 'dp-palindromes', lessonTitle: 'Palindromes: expand and tabulate', lessonMinutes: 16,
        blurb: 'Expand around centres, or fill a table from short substrings to long ones.',
        signals: ['Palindromic substring / subsequence', 'Minimum cuts / insertions to make palindromes'],
        problems: [
          P('longest-palindromic-substring', 'Longest Palindromic Substring', 5, 'M', 'c'),
          P('palindromic-substrings', 'Palindromic Substrings', 647, 'M', 'c'),
          P('longest-palindromic-subsequence', 'Longest Palindromic Subsequence', 516, 'M', 'c'),
          P('minimum-insertion-steps-to-make-a-string-palindrome', 'Minimum Insertion Steps to Make a String Palindrome', 1312, 'H', 'p'),
          P('palindrome-partitioning-ii', 'Palindrome Partitioning II', 132, 'H', 'x'),
        ],
      }),
      mod({
        id: 'dp-stocks', section: 'Dynamic programming', title: 'DP with states', lesson: 'dp-state-machines', lessonTitle: 'State machine DP (the stock problems)', lessonMinutes: 18,
        blurb: 'Holding or not holding, cooling down or free. Draw the states, then each day is a transition.',
        signals: ['Buy / sell with rules', 'A few modes you switch between', 'Limited number of transactions'],
        problems: [
          P('best-time-to-buy-and-sell-stock-with-cooldown', 'Best Time to Buy and Sell Stock with Cooldown', 309, 'M', 'c'),
          P('best-time-to-buy-and-sell-stock-with-transaction-fee', 'Best Time to Buy and Sell Stock with Transaction Fee', 714, 'M', 'c'),
          P('best-time-to-buy-and-sell-stock-iii', 'Best Time to Buy and Sell Stock III', 123, 'H', 'p'),
          P('best-time-to-buy-and-sell-stock-iv', 'Best Time to Buy and Sell Stock IV', 188, 'H', 'x'),
        ],
      }),
      mod({
        id: 'dp-intervals', section: 'Dynamic programming', title: 'Interval DP', lesson: 'interval-dp', lessonTitle: 'Interval DP', lessonMinutes: 16,
        blurb: 'Solve every range [i, j] by trying every split point k inside it. Short ranges first.',
        signals: ['Answer for a range depends on how you split it', 'Last operation inside a range'],
        advanced: true,
        problems: [
          P('minimum-score-triangulation-of-polygon', 'Minimum Score Triangulation of Polygon', 1039, 'M', 'c'),
          P('burst-balloons', 'Burst Balloons', 312, 'H', 'x'),
          P('minimum-cost-to-cut-a-stick', 'Minimum Cost to Cut a Stick', 1547, 'H', 'x'),
        ],
      }),
      mod({
        id: 'dp-trees', section: 'Dynamic programming', title: 'DP on trees', lesson: 'dp-on-trees', lessonTitle: 'DP on trees', lessonMinutes: 14,
        blurb: 'Each node returns a small tuple of answers ("with me" / "without me") to its parent.',
        signals: ['Tree + choose / skip nodes', 'Best path through a node'],
        problems: [
          P('house-robber-iii', 'House Robber III', 337, 'M', 'c'),
          P('longest-zigzag-path-in-a-binary-tree', 'Longest ZigZag Path in a Binary Tree', 1372, 'M', 'p'),
          P('binary-tree-cameras', 'Binary Tree Cameras', 968, 'H', 'x'),
        ],
      }),
      mod({
        id: 'dp-bitmask', section: 'Dynamic programming', title: 'Bitmask DP', lesson: 'bitmask-dp', lessonTitle: 'Bitmask DP', lessonMinutes: 16,
        blurb: 'When n ≤ 20, a bitmask can remember exactly which items are used.',
        signals: ['n is tiny (≤ 16–20)', 'Assign / visit every item exactly once'],
        advanced: true,
        problems: [
          P('beautiful-arrangement', 'Beautiful Arrangement', 526, 'M', 'c'),
          P('partition-to-k-equal-sum-subsets', 'Partition to K Equal Sum Subsets', 698, 'M', 'p'),
          P('shortest-path-visiting-all-nodes', 'Shortest Path Visiting All Nodes', 847, 'H', 'x'),
        ],
      }),
      /* Advanced */
      mod({
        id: 'bit-manipulation', section: 'Advanced topics', title: 'Bit manipulation', lesson: 'bit-manipulation', lessonTitle: 'Bits, masks and XOR tricks', lessonMinutes: 20,
        blurb: 'AND, OR, XOR and shifts. Count bits, cancel pairs with XOR, and test powers of two in one step.',
        signals: ['Every element appears twice except one', 'Powers of two', 'Count set bits', 'No + or − allowed'],
        problems: [
          P('single-number', 'Single Number', 136, 'E', 'c'),
          P('number-of-1-bits', 'Number of 1 Bits', 191, 'E', 'c'),
          P('counting-bits', 'Counting Bits', 338, 'E', 'c'),
          P('power-of-two', 'Power of Two', 231, 'E', 'c'),
          P('sum-of-two-integers', 'Sum of Two Integers', 371, 'M', 'p'),
          P('single-number-ii', 'Single Number II', 137, 'M', 'p'),
          P('single-number-iii', 'Single Number III', 260, 'M', 'p'),
          P('bitwise-and-of-numbers-range', 'Bitwise AND of Numbers Range', 201, 'M', 'x'),
        ],
      }),
      mod({
        id: 'string-matching', section: 'Advanced topics', title: 'String matching', lesson: 'string-matching', lessonTitle: 'KMP and rolling hashes', lessonMinutes: 22,
        blurb: 'Find a pattern in text in O(n + m). The KMP failure table and the Rabin-Karp rolling hash.',
        signals: ['Find a pattern inside text', 'Repeated prefix / suffix', 'Periodic strings'],
        advanced: true,
        problems: [
          P('repeated-substring-pattern', 'Repeated Substring Pattern', 459, 'E', 'c'),
          P('repeated-string-match', 'Repeated String Match', 686, 'M', 'p'),
          P('longest-happy-prefix', 'Longest Happy Prefix', 1392, 'H', 'p'),
          P('shortest-palindrome', 'Shortest Palindrome', 214, 'H', 'x'),
        ],
      }),
      mod({
        id: 'segment-fenwick', section: 'Advanced topics', title: 'Segment and Fenwick trees', lesson: 'segment-and-fenwick-trees', lessonTitle: 'Segment trees and Fenwick trees', lessonMinutes: 26,
        blurb: 'Range queries with updates in O(log n). Build, query and update, animated node by node.',
        signals: ['Range sum / min with point updates', 'Count smaller elements to the right'],
        advanced: true,
        problems: [
          P('range-sum-query-mutable', 'Range Sum Query - Mutable', 307, 'M', 'c'),
          P('count-of-smaller-numbers-after-self', 'Count of Smaller Numbers After Self', 315, 'H', 'x'),
          P('reverse-pairs', 'Reverse Pairs', 493, 'H', 'x'),
        ],
      }),
      mod({
        id: 'design', section: 'Advanced topics', title: 'Designing data structures', lesson: 'designing-data-structures', lessonTitle: 'Combining structures: LRU and friends', lessonMinutes: 20,
        blurb: 'Interview favourites that glue a hash map to a list, heap or array to hit O(1) or O(log n) per operation.',
        signals: ['"Design a class that supports …"', 'Every operation must be O(1)', 'Evict least recently / frequently used'],
        problems: [
          P('lru-cache', 'LRU Cache', 146, 'M', 'c'),
          P('time-based-key-value-store', 'Time Based Key-Value Store', 981, 'M', 'c'),
          P('snapshot-array', 'Snapshot Array', 1146, 'M', 'p'),
          P('design-twitter', 'Design Twitter', 355, 'M', 'p'),
          P('lfu-cache', 'LFU Cache', 460, 'H', 'x'),
        ],
      }),
    ],
  },
];

/* ---------- lookups ---------- */

export const MODULES: ModuleDef[] = PARTS.flatMap((p) => p.modules);
export const PROBLEMS: (ProblemRef & { module: string })[] = MODULES.flatMap((m) => m.problems.map((p) => ({ ...p, module: m.id })));
const byProblem = new Map(PROBLEMS.map((p) => [p.slug, p]));
const byModule = new Map(MODULES.map((m) => [m.id, m]));
const byLesson = new Map(MODULES.map((m) => [m.lesson, m]));

export const problemRef = (slug: string) => byProblem.get(slug);
export const moduleById = (id: string) => byModule.get(id);
export const moduleOfLesson = (slug: string) => byLesson.get(slug);
export const moduleOfProblem = (slug: string) => byModule.get(byProblem.get(slug)?.module ?? '');
export const partOfModule = (id: string) => PARTS.find((p) => p.modules.some((m) => m.id === id));

/** Flat learning sequence: lesson, then its problems, module by module. */
export type Step = { type: 'lesson'; slug: string; title: string; module: string } | { type: 'problem'; slug: string; title: string; module: string };
export const SEQUENCE: Step[] = MODULES.flatMap((m) => [
  { type: 'lesson' as const, slug: m.lesson, title: m.lessonTitle, module: m.id },
  ...m.problems.map((p) => ({ type: 'problem' as const, slug: p.slug, title: p.title, module: m.id })),
]);
