class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        int[][] copy = new int[m][];
        for (int r = 0; r < m; r++) copy[r] = matrix[r].clone();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (copy[r][c] == 0) {
                    for (int k = 0; k < n; k++) matrix[r][k] = 0;
                    for (int k = 0; k < m; k++) matrix[k][c] = 0;
                }
    }
}
