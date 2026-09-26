class Solution {
    public int shortestSubarray(int[] nums, int k) {
        int n = nums.length, best = Integer.MAX_VALUE;
        long[] P = new long[n + 1];
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];
        for (int j = 1; j <= n; j++)
            for (int i = 0; i < j; i++)
                if (P[j] - P[i] >= k) best = Math.min(best, j - i);
        return best == Integer.MAX_VALUE ? -1 : best;
    }
}
