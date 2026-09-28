class Solution {
    public int shortestPathBinaryMatrix(int[][] grid) {
        int n = grid.length;
        if (grid[0][0] == 1 || grid[n - 1][n - 1] == 1) return -1;
        int[][] dist = new int[n][n];
        dist[0][0] = 1;
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0});
        while (!q.isEmpty()) {
            int[] p = q.poll();
            if (p[0] == n - 1 && p[1] == n - 1) return dist[p[0]][p[1]];
            for (int dr = -1; dr <= 1; dr++)
                for (int dc = -1; dc <= 1; dc++) {          // 8 directions
                    int r = p[0] + dr, c = p[1] + dc;
                    if (r < 0 || c < 0 || r >= n || c >= n || grid[r][c] == 1 || dist[r][c] != 0) continue;
                    dist[r][c] = dist[p[0]][p[1]] + 1;      // mark when pushing
                    q.offer(new int[]{r, c});
                }
        }
        return -1;
    }
}
