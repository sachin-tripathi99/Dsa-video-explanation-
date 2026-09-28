class Solution {
    public boolean canPartitionKSubsets(int[] nums, int k) {
        int sum = 0, n = nums.length;
        for (int x : nums) sum += x;
        if (sum % k != 0) return false;
        int target = sum / k;
        int[] dp = new int[1 << n];                         // fill of the current group, −1 = impossible
        Arrays.fill(dp, -1);
        dp[0] = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask] < 0) continue;
            for (int i = 0; i < n; i++) {
                int nm = mask | (1 << i);
                if (nm == mask || dp[nm] >= 0 || dp[mask] + nums[i] > target) continue;
                dp[nm] = (dp[mask] + nums[i]) % target;     // a full group resets to 0
            }
        }
        return dp[(1 << n) - 1] == 0;
    }
}
