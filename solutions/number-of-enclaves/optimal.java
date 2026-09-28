class Solution {
    public int numEnclaves(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        for (int r = 0; r < m; r++) { sink(grid, r, 0); sink(grid, r, n - 1); }   // border land
        for (int c = 0; c < n; c++) { sink(grid, 0, c); sink(grid, m - 1, c); }
        int count = 0;
        for (int[] row : grid) for (int x : row) count += x;    // trapped land
        return count;
    }

    private void sink(int[][] g, int r, int c) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != 1) return;
        g[r][c] = 0;
        sink(g, r + 1, c); sink(g, r - 1, c); sink(g, r, c + 1); sink(g, r, c - 1);
    }
}
