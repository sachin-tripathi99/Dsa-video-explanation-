class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 == 1) return false;
        return can(nums, 0, sum / 2);
    }

    private boolean can(int[] a, int i, int remaining) {
        if (remaining == 0) return true;
        if (i == a.length || remaining < 0) return false;
        return can(a, i + 1, remaining) || can(a, i + 1, remaining - a[i]);   // skip or take
    }
}
