class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> words = new HashSet<>(wordList);
        if (!words.contains(endWord)) return 0;
        Set<String> seen = new HashSet<>(List.of(beginWord));
        Deque<String> q = new ArrayDeque<>(List.of(beginWord));
        for (int d = 1; !q.isEmpty(); d++) {
            for (int k = q.size(); k > 0; k--) {
                String w = q.poll();
                if (w.equals(endWord)) return d;
                char[] cs = w.toCharArray();
                for (int i = 0; i < cs.length; i++) {
                    char orig = cs[i];
                    for (char ch = 'a'; ch <= 'z'; ch++) {  // change letter i
                        cs[i] = ch;
                        String x = new String(cs);
                        if (words.contains(x) && seen.add(x)) q.offer(x);
                    }
                    cs[i] = orig;
                }
            }
        }
        return 0;
    }
}
