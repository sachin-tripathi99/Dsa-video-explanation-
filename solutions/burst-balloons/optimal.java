class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length, m = n + 2;
        int[] p = new int[m];
        p[0] = p[m - 1] = 1;
        for (int i = 0; i < n; i++) p[i + 1] = nums[i];
        int[][] dp = new int[m][m];
        for (int len = 2; len < m; len++)                   // narrow intervals first
            for (int i = 0; i + len < m; i++) {
                int j = i + len;
                for (int k = i + 1; k < j; k++)             // k bursts last
                    dp[i][j] = Math.max(dp[i][j], dp[i][k] + dp[k][j] + p[i] * p[k] * p[j]);
            }
        return dp[0][m - 1];
    }
}
