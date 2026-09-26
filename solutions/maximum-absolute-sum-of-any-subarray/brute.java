class Solution {
    public int maxAbsoluteSum(int[] nums) {
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            int s = 0;
            for (int j = i; j < nums.length; j++) {
                s += nums[j];
                best = Math.max(best, Math.abs(s));
            }
        }
        return best;
    }
}
