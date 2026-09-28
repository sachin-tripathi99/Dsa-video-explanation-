class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        if (!wordList.contains(endWord)) return 0;
        Set<String> seen = new HashSet<>(List.of(beginWord));
        Deque<String> q = new ArrayDeque<>(List.of(beginWord));
        for (int d = 1; !q.isEmpty(); d++) {
            for (int k = q.size(); k > 0; k--) {
                String w = q.poll();
                if (w.equals(endWord)) return d;
                for (String x : wordList)                   // compare with every word
                    if (!seen.contains(x) && oneApart(w, x)) { seen.add(x); q.offer(x); }
            }
        }
        return 0;
    }

    private boolean oneApart(String a, String b) {
        int diff = 0;
        for (int i = 0; i < a.length(); i++) if (a.charAt(i) != b.charAt(i) && ++diff > 1) return false;
        return diff == 1;
    }
}
