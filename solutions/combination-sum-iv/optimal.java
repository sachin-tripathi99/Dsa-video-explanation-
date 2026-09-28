class Solution {
    public int combinationSum4(int[] nums, int target) {
        int[] dp = new int[target + 1];
        dp[0] = 1;                                          // the empty sequence
        for (int s = 1; s <= target; s++)                   // totals outside → orders count
            for (int x : nums) if (x <= s) dp[s] += dp[s - x];
        return dp[target];
    }
}
