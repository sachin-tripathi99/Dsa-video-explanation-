class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < nums.length; i++) {
            int s = 0;
            for (int j = i; j < nums.length; j++) {
                s += nums[j];
                if (s >= target) { best = Math.min(best, j - i + 1); break; }
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
