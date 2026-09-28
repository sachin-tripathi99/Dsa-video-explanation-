class Solution {
    private int[][] memo;

    public int minPathSum(int[][] grid) {
        memo = new int[grid.length][grid[0].length];
        for (int[] row : memo) Arrays.fill(row, -1);
        return best(grid, grid.length - 1, grid[0].length - 1);
    }

    private int best(int[][] g, int r, int c) {
        if (r < 0 || c < 0) return Integer.MAX_VALUE;
        if (r == 0 && c == 0) return g[0][0];
        if (memo[r][c] >= 0) return memo[r][c];             // solved before
        return memo[r][c] = g[r][c] + Math.min(best(g, r - 1, c), best(g, r, c - 1));
    }
}
