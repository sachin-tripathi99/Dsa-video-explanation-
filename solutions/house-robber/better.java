class Solution {
    private int[] memo;

    public int rob(int[] nums) {
        memo = new int[nums.length];
        Arrays.fill(memo, -1);
        return best(nums, nums.length - 1);
    }

    private int best(int[] a, int i) {
        if (i < 0) return 0;
        if (memo[i] >= 0) return memo[i];                   // solved before
        return memo[i] = Math.max(best(a, i - 1), best(a, i - 2) + a[i]);
    }
}
