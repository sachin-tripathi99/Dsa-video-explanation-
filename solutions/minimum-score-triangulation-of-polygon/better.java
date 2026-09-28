class Solution {
    private int[][] memo;

    public int minScoreTriangulation(int[] values) {
        memo = new int[values.length][values.length];
        return best(values, 0, values.length - 1);
    }

    private int best(int[] v, int i, int j) {
        if (j - i < 2) return 0;
        if (memo[i][j] != 0) return memo[i][j];             // solved before
        int res = Integer.MAX_VALUE;
        for (int k = i + 1; k < j; k++) res = Math.min(res, best(v, i, k) + best(v, k, j) + v[i] * v[k] * v[j]);
        return memo[i][j] = res;
    }
}
