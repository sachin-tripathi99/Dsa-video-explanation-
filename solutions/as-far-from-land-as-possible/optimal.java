class Solution {
    public int maxDistance(int[][] grid) {
        int n = grid.length;
        int[][] d = new int[n][n];
        Deque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 1) q.offer(new int[]{r, c});   // all land at distance 0
                else d[r][c] = -1;
            }
        if (q.isEmpty() || q.size() == n * n) return -1;
        int best = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            for (int[] dd : dirs) {
                int r = p[0] + dd[0], c = p[1] + dd[1];
                if (r < 0 || c < 0 || r >= n || c >= n || d[r][c] != -1) continue;
                d[r][c] = d[p[0]][p[1]] + 1;
                best = d[r][c];                             // last assigned = farthest
                q.offer(new int[]{r, c});
            }
        }
        return best;
    }
}
