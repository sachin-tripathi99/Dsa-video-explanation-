class Solution {
    private int[][] memo;

    public int maxCoins(int[] nums) {
        int n = nums.length;
        int[] p = new int[n + 2];
        p[0] = p[n + 1] = 1;
        for (int i = 0; i < n; i++) p[i + 1] = nums[i];
        memo = new int[n + 2][n + 2];
        for (int[] row : memo) Arrays.fill(row, -1);
        return best(p, 0, n + 1);
    }

    private int best(int[] p, int i, int j) {
        if (memo[i][j] >= 0) return memo[i][j];             // solved before
        int res = 0;
        for (int k = i + 1; k < j; k++) res = Math.max(res, best(p, i, k) + best(p, k, j) + p[i] * p[k] * p[j]);
        return memo[i][j] = res;
    }
}
