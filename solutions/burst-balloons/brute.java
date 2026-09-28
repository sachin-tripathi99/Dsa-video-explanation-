class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        int[] p = new int[n + 2];
        p[0] = p[n + 1] = 1;
        for (int i = 0; i < n; i++) p[i + 1] = nums[i];
        return best(p, 0, n + 1);
    }

    private int best(int[] p, int i, int j) {               // burst everything strictly between i and j
        int res = 0;
        for (int k = i + 1; k < j; k++)                     // k bursts last
            res = Math.max(res, best(p, i, k) + best(p, k, j) + p[i] * p[k] * p[j]);
        return res;
    }
}
