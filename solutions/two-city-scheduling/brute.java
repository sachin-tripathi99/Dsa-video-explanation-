class Solution {
    public int twoCitySchedCost(int[][] costs) {
        int m = costs.length, n = m / 2;
        int[][] dp = new int[m + 1][n + 1];                 // dp[i][a]: first i people, a sent to A
        for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE / 2);
        dp[0][0] = 0;
        for (int i = 1; i <= m; i++)
            for (int a = 0; a <= Math.min(i, n); a++) {
                int toB = dp[i - 1][a] + costs[i - 1][1];
                int toA = a > 0 ? dp[i - 1][a - 1] + costs[i - 1][0] : Integer.MAX_VALUE / 2;
                dp[i][a] = Math.min(toA, toB);
            }
        return dp[m][n];
    }
}
