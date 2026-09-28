class Solution {
    public int minFallingPathSum(int[][] matrix) {
        int best = Integer.MAX_VALUE;
        for (int c = 0; c < matrix.length; c++) best = Math.min(best, fall(matrix, 0, c));
        return best;
    }

    private int fall(int[][] a, int r, int c) {
        if (c < 0 || c >= a.length) return Integer.MAX_VALUE;   // off the edge
        if (r == a.length - 1) return a[r][c];
        return a[r][c] + Math.min(fall(a, r + 1, c), Math.min(fall(a, r + 1, c - 1), fall(a, r + 1, c + 1)));
    }
}
