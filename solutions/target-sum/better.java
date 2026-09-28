class Solution {
    private Integer[][] memo;
    private int offset;

    public int findTargetSumWays(int[] nums, int target) {
        int total = 0;
        for (int x : nums) total += x;
        offset = total;
        memo = new Integer[nums.length][2 * total + 1];
        return count(nums, 0, 0, target);
    }

    private int count(int[] a, int i, int sum, int target) {
        if (i == a.length) return sum == target ? 1 : 0;
        if (memo[i][sum + offset] != null) return memo[i][sum + offset];   // solved before
        return memo[i][sum + offset] = count(a, i + 1, sum + a[i], target) + count(a, i + 1, sum - a[i], target);
    }
}
