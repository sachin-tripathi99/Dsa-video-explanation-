class Solution {
    public int lengthOfLIS(int[] nums) {
        return best(nums, 0, Long.MIN_VALUE);
    }

    private int best(int[] a, int i, long prev) {
        if (i == a.length) return 0;
        int res = best(a, i + 1, prev);                     // skip a[i]
        if (a[i] > prev) res = Math.max(res, 1 + best(a, i + 1, a[i]));   // take a[i]
        return res;
    }
}
