class Solution {
    public double findMaxAverage(int[] nums, int k) {
        long s = 0;
        for (int i = 0; i < k; i++) s += nums[i];
        long best = s;
        for (int r = k; r < nums.length; r++) {
            s += nums[r] - nums[r - k];          // one in, one out
            best = Math.max(best, s);
        }
        return (double) best / k;
    }
}
