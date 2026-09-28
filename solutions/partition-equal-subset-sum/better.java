class Solution {
    private Boolean[][] memo;

    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 == 1) return false;
        memo = new Boolean[nums.length][sum / 2 + 1];
        return can(nums, 0, sum / 2);
    }

    private boolean can(int[] a, int i, int remaining) {
        if (remaining == 0) return true;
        if (i == a.length || remaining < 0) return false;
        if (memo[i][remaining] != null) return memo[i][remaining];   // solved before
        return memo[i][remaining] = can(a, i + 1, remaining) || can(a, i + 1, remaining - a[i]);
    }
}
