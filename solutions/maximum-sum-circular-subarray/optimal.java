class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int hi = nums[0], lo = nums[0], bestHi = nums[0], bestLo = nums[0], total = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i];
            hi = Math.max(x, hi + x);
            bestHi = Math.max(bestHi, hi);
            lo = Math.min(x, lo + x);
            bestLo = Math.min(bestLo, lo);
            total += x;
        }
        if (bestHi < 0) return bestHi;                  // all negative: wrapping would mean empty
        return Math.max(bestHi, total - bestLo);
    }
}
