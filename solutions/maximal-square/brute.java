class Solution {
    public int maximalSquare(char[][] matrix) {
        int R = matrix.length, C = matrix[0].length, best = 0;
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++) {
                if (matrix[r][c] != '1') continue;
                int k = 1;                                  // grow while the new edge is all 1s
                outer:
                while (r + k < R && c + k < C) {
                    for (int i = 0; i <= k; i++)
                        if (matrix[r + k][c + i] != '1' || matrix[r + i][c + k] != '1') break outer;
                    k++;
                }
                best = Math.max(best, k);
            }
        return best * best;
    }
}
