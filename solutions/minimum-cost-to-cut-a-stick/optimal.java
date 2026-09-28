class Solution {
    public int minCost(int n, int[] cuts) {
        int m = cuts.length + 2;
        int[] c = new int[m];
        for (int i = 0; i < cuts.length; i++) c[i + 1] = cuts[i];
        c[m - 1] = n;
        Arrays.sort(c);                                     // 0, sorted cuts, n
        int[][] dp = new int[m][m];
        for (int len = 2; len < m; len++)                   // narrow pieces first
            for (int i = 0; i + len < m; i++) {
                int j = i + len;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i + 1; k < j; k++) dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j]);
                dp[i][j] += c[j] - c[i];                    // the first cut pays the piece length
            }
        return dp[0][m - 1];
    }
}
