class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(solve(nums, 0, n - 2), solve(nums, 1, n - 1));
    }

    private int solve(int[] a, int lo, int hi) {
        int[] memo = new int[a.length];
        Arrays.fill(memo, -1);
        return best(a, lo, hi, memo);
    }

    private int best(int[] a, int lo, int i, int[] memo) {
        if (i < lo) return 0;
        if (memo[i] >= 0) return memo[i];                   // solved before
        return memo[i] = Math.max(best(a, lo, i - 1, memo), best(a, lo, i - 2, memo) + a[i]);
    }
}
