class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int r = 0; r < n; r++)                        // transpose
            for (int c = r + 1; c < n; c++) {
                int t = matrix[r][c]; matrix[r][c] = matrix[c][r]; matrix[c][r] = t;
            }
        for (int[] row : matrix)                           // reverse each row
            for (int l = 0, h = n - 1; l < h; l++, h--) {
                int t = row[l]; row[l] = row[h]; row[h] = t;
            }
    }
}
