class Solution {
    public int longestStrChain(String[] words) {
        Arrays.sort(words, (a, b) -> a.length() - b.length());   // predecessors first
        Map<String, Integer> best = new HashMap<>();
        int ans = 0;
        for (String w : words) {
            int b = 1;
            for (int i = 0; i < w.length(); i++) {
                String prev = w.substring(0, i) + w.substring(i + 1);   // delete one letter
                b = Math.max(b, best.getOrDefault(prev, 0) + 1);
            }
            best.put(w, b);
            ans = Math.max(ans, b);
        }
        return ans;
    }
}
