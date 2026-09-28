class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        return count(nums, 0, 0, target);
    }

    private int count(int[] a, int i, int sum, int target) {
        if (i == a.length) return sum == target ? 1 : 0;
        return count(a, i + 1, sum + a[i], target) + count(a, i + 1, sum - a[i], target);   // + or −
    }
}
