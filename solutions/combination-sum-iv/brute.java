class Solution {
    public int combinationSum4(int[] nums, int target) {
        if (target == 0) return 1;
        int ways = 0;
        for (int x : nums) if (x <= target) ways += combinationSum4(nums, target - x);   // x is last
        return ways;
    }
}
