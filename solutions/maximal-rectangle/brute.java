class Solution {
    public int maximalRectangle(char[][] matrix) {
        int m = matrix.length, n = matrix[0].length, best = 0;
        int[][] S = new int[m + 1][n + 1];                  // 2D prefix sums of ones
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                S[r + 1][c + 1] = (matrix[r][c] == '1' ? 1 : 0) + S[r][c + 1] + S[r + 1][c] - S[r][c];
        for (int r1 = 0; r1 < m; r1++)
            for (int c1 = 0; c1 < n; c1++)
                for (int r2 = r1; r2 < m; r2++)
                    for (int c2 = c1; c2 < n; c2++) {
                        int area = (r2 - r1 + 1) * (c2 - c1 + 1);
                        int ones = S[r2 + 1][c2 + 1] - S[r1][c2 + 1] - S[r2 + 1][c1] + S[r1][c1];
                        if (ones == area) best = Math.max(best, area);
                    }
        return best;
    }
}
