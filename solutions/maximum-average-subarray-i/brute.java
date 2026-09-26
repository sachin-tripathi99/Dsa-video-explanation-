class Solution {
    public double findMaxAverage(int[] nums, int k) {
        long best = Long.MIN_VALUE;
        for (int i = 0; i + k <= nums.length; i++) {
            long s = 0;
            for (int j = i; j < i + k; j++) s += nums[j];
            best = Math.max(best, s);
        }
        return (double) best / k;
    }
}
