class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        return lcs(text1, text2, text1.length(), text2.length());
    }

    private int lcs(String x, String y, int i, int j) {
        if (i == 0 || j == 0) return 0;
        if (x.charAt(i - 1) == y.charAt(j - 1)) return 1 + lcs(x, y, i - 1, j - 1);   // use both
        return Math.max(lcs(x, y, i - 1, j), lcs(x, y, i, j - 1));                   // drop one
    }
}
