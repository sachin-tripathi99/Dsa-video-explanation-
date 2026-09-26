class Solution {
    public int splitArray(int[] nums, int k) {
        int n = nums.length;
        long[] P = new long[n + 1];
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];
        long INF = Long.MAX_VALUE / 4;
        long[][] dp = new long[k + 1][n + 1];              // dp[j][i]: first i numbers into j parts
        for (long[] row : dp) Arrays.fill(row, INF);
        dp[0][0] = 0;
        for (int j = 1; j <= k; j++)
            for (int i = 1; i <= n; i++)
                for (int p = j - 1; p < i; p++)
                    if (dp[j - 1][p] < INF) dp[j][i] = Math.min(dp[j][i], Math.max(dp[j - 1][p], P[i] - P[p]));
        return (int) dp[k][n];
    }
}
