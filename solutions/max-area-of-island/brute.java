class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int m = grid.length, n = grid[0].length, best = 0;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (grid[r][c] == 1) best = Math.max(best, measure(grid, r, c, new boolean[m][n]));   // fresh visited each time
        return best;
    }

    private int measure(int[][] g, int r, int c, boolean[][] seen) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != 1 || seen[r][c]) return 0;
        seen[r][c] = true;
        return 1 + measure(g, r + 1, c, seen) + measure(g, r - 1, c, seen) + measure(g, r, c + 1, seen) + measure(g, r, c - 1, seen);
    }
}
