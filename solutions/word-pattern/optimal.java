class Solution {
    public boolean wordPattern(String pattern, String s) {
        String[] words = s.split(" ");
        if (words.length != pattern.length()) return false;
        Map<Character, String> pw = new HashMap<>();
        Map<String, Character> wp = new HashMap<>();
        for (int i = 0; i < words.length; i++) {
            char c = pattern.charAt(i);
            String w = words[i];
            if (pw.containsKey(c) && !pw.get(c).equals(w)) return false;
            if (wp.containsKey(w) && wp.get(w) != c) return false;
            pw.put(c, w);
            wp.put(w, c);
        }
        return true;
    }
}
