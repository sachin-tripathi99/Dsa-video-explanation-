class Solution {
    private Set<String> words;

    public int longestStrChain(String[] ws) {
        words = new HashSet<>(Arrays.asList(ws));
        int best = 0;
        for (String w : ws) best = Math.max(best, grow(w));   // start anywhere
        return best;
    }

    private int grow(String w) {                            // longest chain starting at w
        int best = 1;
        for (int i = 0; i <= w.length(); i++)
            for (char c = 'a'; c <= 'z'; c++) {
                String nxt = w.substring(0, i) + c + w.substring(i);
                if (words.contains(nxt)) best = Math.max(best, 1 + grow(nxt));
            }
        return best;
    }
}
