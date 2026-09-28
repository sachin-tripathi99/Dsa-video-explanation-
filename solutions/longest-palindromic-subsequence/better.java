class Solution {
    private int[][] memo;

    public int longestPalindromeSubseq(String s) {
        memo = new int[s.length()][s.length()];
        return lps(s, 0, s.length() - 1);
    }

    private int lps(String s, int i, int j) {
        if (i > j) return 0;
        if (i == j) return 1;
        if (memo[i][j] != 0) return memo[i][j];             // solved before
        if (s.charAt(i) == s.charAt(j)) return memo[i][j] = 2 + lps(s, i + 1, j - 1);
        return memo[i][j] = Math.max(lps(s, i + 1, j), lps(s, i, j - 1));
    }
}
