class Solution {
    private int[][] memo;

    public int longestCommonSubsequence(String text1, String text2) {
        memo = new int[text1.length() + 1][text2.length() + 1];
        for (int[] row : memo) Arrays.fill(row, -1);
        return lcs(text1, text2, text1.length(), text2.length());
    }

    private int lcs(String x, String y, int i, int j) {
        if (i == 0 || j == 0) return 0;
        if (memo[i][j] >= 0) return memo[i][j];             // solved before
        if (x.charAt(i - 1) == y.charAt(j - 1)) return memo[i][j] = 1 + lcs(x, y, i - 1, j - 1);
        return memo[i][j] = Math.max(lcs(x, y, i - 1, j), lcs(x, y, i, j - 1));
    }
}
