class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int n = nums.length, best = Integer.MAX_VALUE;
        long[] P = new long[n + 1];
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];
        for (int i = 0; i < n; i++) {
            long need = P[i] + target;                // first j with P[j] >= need
            int lo = i + 1, hi = n;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (P[mid] >= need) hi = mid; else lo = mid + 1;
            }
            if (lo <= n && P[lo] >= need) best = Math.min(best, lo - i);
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
