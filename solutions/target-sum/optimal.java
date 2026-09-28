class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int total = 0;
        for (int x : nums) total += x;
        if (Math.abs(target) > total || (total + target) % 2 != 0) return 0;
        int p = (total + target) / 2;                       // sum of the plus group
        int[] dp = new int[p + 1];
        dp[0] = 1;
        for (int x : nums)
            for (int c = p; c >= x; c--) dp[c] += dp[c - x];   // count subsets, x used once
        return dp[p];
    }
}
