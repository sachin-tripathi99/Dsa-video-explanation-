class Solution {
    public int minPathSum(int[][] grid) {
        return best(grid, grid.length - 1, grid[0].length - 1);
    }

    private int best(int[][] g, int r, int c) {
        if (r < 0 || c < 0) return Integer.MAX_VALUE;       // off-grid
        if (r == 0 && c == 0) return g[0][0];
        return g[r][c] + Math.min(best(g, r - 1, c), best(g, r, c - 1));
    }
}
