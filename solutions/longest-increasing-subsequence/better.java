class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length, best = 0;
        int[] dp = new int[n];                              // dp[i]: longest ending at i
        for (int i = 0; i < n; i++) {
            dp[i] = 1;
            for (int j = 0; j < i; j++) if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            best = Math.max(best, dp[i]);
        }
        return best;
    }
}
