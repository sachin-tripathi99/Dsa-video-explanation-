class Solution {
    public int longestSubarray(int[] nums, int limit) {
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            int mx = nums[i], mn = nums[i];
            for (int j = i; j < nums.length; j++) {
                mx = Math.max(mx, nums[j]);
                mn = Math.min(mn, nums[j]);
                if (mx - mn > limit) break;
                best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}
