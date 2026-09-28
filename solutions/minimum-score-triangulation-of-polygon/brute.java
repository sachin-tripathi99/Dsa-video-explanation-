class Solution {
    public int minScoreTriangulation(int[] values) {
        return best(values, 0, values.length - 1);
    }

    private int best(int[] v, int i, int j) {
        if (j - i < 2) return 0;
        int res = Integer.MAX_VALUE;
        for (int k = i + 1; k < j; k++)                     // triangle (i, k, j)
            res = Math.min(res, best(v, i, k) + best(v, k, j) + v[i] * v[k] * v[j]);
        return res;
    }
}
