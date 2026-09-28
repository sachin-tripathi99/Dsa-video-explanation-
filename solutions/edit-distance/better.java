class Solution {
    private int[][] memo;

    public int minDistance(String word1, String word2) {
        memo = new int[word1.length() + 1][word2.length() + 1];
        for (int[] row : memo) Arrays.fill(row, -1);
        return ed(word1, word2, word1.length(), word2.length());
    }

    private int ed(String x, String y, int i, int j) {
        if (i == 0) return j;
        if (j == 0) return i;
        if (memo[i][j] >= 0) return memo[i][j];             // solved before
        if (x.charAt(i - 1) == y.charAt(j - 1)) return memo[i][j] = ed(x, y, i - 1, j - 1);
        return memo[i][j] = 1 + Math.min(ed(x, y, i - 1, j - 1), Math.min(ed(x, y, i - 1, j), ed(x, y, i, j - 1)));
    }
}
