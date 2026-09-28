class Solution {
    public int longestPalindromeSubseq(String s) {
        return lps(s, 0, s.length() - 1);
    }

    private int lps(String s, int i, int j) {
        if (i > j) return 0;
        if (i == j) return 1;
        if (s.charAt(i) == s.charAt(j)) return 2 + lps(s, i + 1, j - 1);   // both ends join
        return Math.max(lps(s, i + 1, j), lps(s, i, j - 1));               // drop one end
    }
}
