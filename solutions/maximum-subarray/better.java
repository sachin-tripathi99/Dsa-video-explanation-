class Solution {
    public int maxSubArray(int[] nums) {
        return best(nums, 0, nums.length - 1);
    }

    private int best(int[] a, int l, int r) {
        if (l == r) return a[l];
        int m = (l + r) / 2;
        int leftSuffix = Integer.MIN_VALUE, s = 0;
        for (int i = m; i >= l; i--) { s += a[i]; leftSuffix = Math.max(leftSuffix, s); }
        int rightPrefix = Integer.MIN_VALUE;
        s = 0;
        for (int i = m + 1; i <= r; i++) { s += a[i]; rightPrefix = Math.max(rightPrefix, s); }
        int crossing = leftSuffix + rightPrefix;
        return Math.max(crossing, Math.max(best(a, l, m), best(a, m + 1, r)));
    }
}
