class Solution {
    public String longestCommonPrefix(String[] strs) {
        String first = strs[0];
        for (int i = 0; i < first.length(); i++) {
            char c = first.charAt(i);
            for (String w : strs) {
                if (i == w.length() || w.charAt(i) != c) return first.substring(0, i);  // column mismatch
            }
        }
        return first;
    }
}
