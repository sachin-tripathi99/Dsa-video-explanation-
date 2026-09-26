class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int n = nums.length, best = Integer.MIN_VALUE;
        for (int start = 0; start < n; start++) {
            int s = 0;
            for (int len = 1; len <= n; len++) {
                s += nums[(start + len - 1) % n];
                best = Math.max(best, s);
            }
        }
        return best;
    }
}
