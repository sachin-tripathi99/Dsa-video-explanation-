class Solution {
    private int[][] memo;
    private char[][] m;

    public int maximalSquare(char[][] matrix) {
        m = matrix;
        memo = new int[matrix.length][matrix[0].length];
        for (int[] row : memo) Arrays.fill(row, -1);
        int best = 0;
        for (int r = 0; r < matrix.length; r++)
            for (int c = 0; c < matrix[0].length; c++) best = Math.max(best, side(r, c));
        return best * best;
    }

    private int side(int r, int c) {                        // largest square ending at (r, c)
        if (r < 0 || c < 0 || m[r][c] != '1') return 0;
        if (memo[r][c] >= 0) return memo[r][c];
        return memo[r][c] = 1 + Math.min(side(r - 1, c), Math.min(side(r, c - 1), side(r - 1, c - 1)));
    }
}
