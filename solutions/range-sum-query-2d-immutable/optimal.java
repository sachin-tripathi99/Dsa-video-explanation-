class NumMatrix {
    private final int[][] S;                    // S[i][j] = sum of the top-left i × j block

    public NumMatrix(int[][] matrix) {
        int R = matrix.length, C = matrix[0].length;
        S = new int[R + 1][C + 1];
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                S[r + 1][c + 1] = matrix[r][c] + S[r][c + 1] + S[r + 1][c] - S[r][c];
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        return S[row2 + 1][col2 + 1] - S[row1][col2 + 1] - S[row2 + 1][col1] + S[row1][col1];
    }
}
