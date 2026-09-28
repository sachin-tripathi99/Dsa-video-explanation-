class Solution {
    private Integer[][] memo;

    public int minFallingPathSum(int[][] matrix) {
        int n = matrix.length;
        memo = new Integer[n][n];
        int best = Integer.MAX_VALUE;
        for (int c = 0; c < n; c++) best = Math.min(best, fall(matrix, 0, c));
        return best;
    }

    private int fall(int[][] a, int r, int c) {
        if (c < 0 || c >= a.length) return Integer.MAX_VALUE;
        if (r == a.length - 1) return a[r][c];
        if (memo[r][c] != null) return memo[r][c];          // solved before
        return memo[r][c] = a[r][c] + Math.min(fall(a, r + 1, c), Math.min(fall(a, r + 1, c - 1), fall(a, r + 1, c + 1)));
    }
}
