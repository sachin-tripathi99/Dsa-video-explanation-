class Solution {
    public int maximalSquare(char[][] matrix) {
        int C = matrix[0].length, best = 0;
        int[] row = new int[C + 1];                         // row[c + 1] = dp for column c
        for (char[] line : matrix) {
            int diag = 0;                                   // dp[r − 1][c − 1]
            for (int c = 1; c <= C; c++) {
                int up = row[c];
                row[c] = line[c - 1] == '1' ? 1 + Math.min(up, Math.min(row[c - 1], diag)) : 0;
                diag = up;
                best = Math.max(best, row[c]);
            }
        }
        return best * best;
    }
}
