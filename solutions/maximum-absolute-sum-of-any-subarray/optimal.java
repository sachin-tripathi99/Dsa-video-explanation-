class Solution {
    public int maxAbsoluteSum(int[] nums) {
        int hi = 0, lo = 0, bestHi = 0, bestLo = 0;
        for (int x : nums) {
            hi = Math.max(x, hi + x);             // Kadane for the maximum
            lo = Math.min(x, lo + x);             // Kadane for the minimum
            bestHi = Math.max(bestHi, hi);
            bestLo = Math.min(bestLo, lo);
        }
        return Math.max(bestHi, -bestLo);
    }
}
