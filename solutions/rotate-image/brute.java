class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        int[][] out = new int[n][n];
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++) out[c][n - 1 - r] = matrix[r][c];
        for (int r = 0; r < n; r++) matrix[r] = out[r].clone();
    }
}
