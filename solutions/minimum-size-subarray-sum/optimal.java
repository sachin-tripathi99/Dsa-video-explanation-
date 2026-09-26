class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int l = 0, s = 0, best = Integer.MAX_VALUE;
        for (int r = 0; r < nums.length; r++) {
            s += nums[r];
            while (s >= target) {                   // valid: record, then try shorter
                best = Math.min(best, r - l + 1);
                s -= nums[l++];
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
