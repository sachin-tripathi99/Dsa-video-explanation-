class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(best(nums, 0, n - 2), best(nums, 1, n - 1));   // drop last / drop first
    }

    private int best(int[] a, int lo, int i) {              // most from houses lo..i
        if (i < lo) return 0;
        return Math.max(best(a, lo, i - 1), best(a, lo, i - 2) + a[i]);
    }
}
