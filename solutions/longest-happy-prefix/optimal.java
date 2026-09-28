class Solution {
    public String longestPrefix(String s) {
        int n = s.length();
        int[] lps = new int[n];
        for (int i = 1, len = 0; i < n; ) {
            if (s.charAt(i) == s.charAt(len)) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];           // fall back to a shorter border
            else lps[i++] = 0;
        }
        return s.substring(0, lps[n - 1]);
    }
}
