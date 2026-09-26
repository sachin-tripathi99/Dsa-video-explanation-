class Solution {
    public int jump(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 0; i < n; i++)
            for (int s = 1; s <= nums[i] && i + s < n; s++)
                dp[i + s] = Math.min(dp[i + s], dp[i] + 1);
        return dp[n - 1];
    }
}
