class Solution {
    private int[] memo;

    public int combinationSum4(int[] nums, int target) {
        memo = new int[target + 1];
        Arrays.fill(memo, -1);
        return count(nums, target);
    }

    private int count(int[] nums, int t) {
        if (t == 0) return 1;
        if (memo[t] >= 0) return memo[t];                   // solved before
        int ways = 0;
        for (int x : nums) if (x <= t) ways += count(nums, t - x);
        return memo[t] = ways;
    }
}
