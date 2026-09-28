class Solution {
    public int islandPerimeter(int[][] grid) {
        int m = grid.length, n = grid[0].length, p = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 0) continue;
                for (int[] d : dirs) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] == 0) p++;   // exposed side
                }
            }
        return p;
    }
}
