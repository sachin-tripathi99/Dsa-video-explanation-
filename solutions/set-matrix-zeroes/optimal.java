class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRow = false, firstCol = false;
        for (int c = 0; c < n; c++) if (matrix[0][c] == 0) firstRow = true;
        for (int r = 0; r < m; r++) if (matrix[r][0] == 0) firstCol = true;
        for (int r = 1; r < m; r++)                       // mark in row 0 / column 0
            for (int c = 1; c < n; c++)
                if (matrix[r][c] == 0) { matrix[r][0] = 0; matrix[0][c] = 0; }
        for (int r = 1; r < m; r++)                       // clear inner cells from the marks
            for (int c = 1; c < n; c++)
                if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
        if (firstRow) for (int c = 0; c < n; c++) matrix[0][c] = 0;
        if (firstCol) for (int r = 0; r < m; r++) matrix[r][0] = 0;
    }
}
