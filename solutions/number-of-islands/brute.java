class Solution {
    public int numIslands(char[][] grid) {
        int m = grid.length, n = grid[0].length, count = 0;
        boolean[][] seen = new boolean[m][n];
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (grid[r][c] != '1' || seen[r][c]) continue;
                count++;
                Deque<int[]> q = new ArrayDeque<>();
                q.offer(new int[]{r, c});
                seen[r][c] = true;
                while (!q.isEmpty()) {                      // BFS over this island
                    int[] cur = q.poll();
                    for (int[] d : dirs) {
                        int nr = cur[0] + d[0], nc = cur[1] + d[1];
                        if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] != '1' || seen[nr][nc]) continue;
                        seen[nr][nc] = true;
                        q.offer(new int[]{nr, nc});
                    }
                }
            }
        return count;
    }
}
