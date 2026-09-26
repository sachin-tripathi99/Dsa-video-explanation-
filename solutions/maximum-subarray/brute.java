class Solution {
    public int maxSubArray(int[] nums) {
        int best = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            int s = 0;
            for (int j = i; j < nums.length; j++) {
                s += nums[j];
                best = Math.max(best, s);
            }
        }
        return best;
    }
}
