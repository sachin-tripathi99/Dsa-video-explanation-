class Solution {
    public String longestWord(String[] words) {
        Set<String> set = new HashSet<>(Arrays.asList(words));
        String best = "";
        for (String w : words) {
            boolean ok = true;
            for (int i = 1; i < w.length() && ok; i++) ok = set.contains(w.substring(0, i));   // every prefix
            if (ok && (w.length() > best.length() || (w.length() == best.length() && w.compareTo(best) < 0))) best = w;
        }
        return best;
    }
}
