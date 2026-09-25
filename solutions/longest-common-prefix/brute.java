class Solution {
    public String longestCommonPrefix(String[] strs) {
        String prefix = strs[0];
        for (String w : strs) {
            while (!w.startsWith(prefix)) prefix = prefix.substring(0, prefix.length() - 1);
        }
        return prefix;
    }
}
