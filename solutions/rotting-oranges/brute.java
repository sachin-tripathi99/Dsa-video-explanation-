class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, minutes = 0;
        while (true) {
            List<int[]> toRot = new ArrayList<>();
            for (int r = 0; r < m; r++)                     // full scan every minute
                for (int c = 0; c < n; c++)
                    if (grid[r][c] == 1 && ((r > 0 && grid[r - 1][c] == 2) || (r + 1 < m && grid[r + 1][c] == 2) || (c > 0 && grid[r][c - 1] == 2) || (c + 1 < n && grid[r][c + 1] == 2)))
                        toRot.add(new int[]{r, c});
            if (toRot.isEmpty()) break;
            for (int[] p : toRot) grid[p[0]][p[1]] = 2;
            minutes++;
        }
        for (int[] row : grid) for (int x : row) if (x == 1) return -1;
        return minutes;
    }
}
