class Solution {
    public boolean repeatedSubstringPattern(String s) {
        int n = s.length();
        int[] lps = new int[n];
        for (int i = 1, len = 0; i < n; ) {
            if (s.charAt(i) == s.charAt(len)) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];           // fall back to a shorter border
            else lps[i++] = 0;
        }
        int l = lps[n - 1], p = n - l;                      // p is the period
        return l > 0 && n % p == 0;
    }
}
