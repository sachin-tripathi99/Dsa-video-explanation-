class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 == 1) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];             // dp[s]: some subset sums to s
        dp[0] = true;
        for (int x : nums)
            for (int c = target; c >= x; c--) dp[c] |= dp[c - x];   // high → low: x used once
        return dp[target];
    }
}
