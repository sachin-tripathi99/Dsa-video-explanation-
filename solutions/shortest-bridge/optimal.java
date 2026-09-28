class Solution {
    private final Deque<int[]> q = new ArrayDeque<>();

    public int shortestBridge(int[][] grid) {
        int n = grid.length;
        outer:
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++)
                if (grid[r][c] == 1) { mark(grid, r, c); break outer; }   // island A → sources
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int flips = 0; !q.isEmpty(); flips++) {
            for (int k = q.size(); k > 0; k--) {
                int[] p = q.poll();
                for (int[] d : dirs) {
                    int r = p[0] + d[0], c = p[1] + d[1];
                    if (r < 0 || c < 0 || r >= n || c >= n || grid[r][c] == 2) continue;
                    if (grid[r][c] == 1) return flips;      // touched island B
                    grid[r][c] = 2;
                    q.offer(new int[]{r, c});
                }
            }
        }
        return -1;
    }

    private void mark(int[][] g, int r, int c) {
        if (r < 0 || c < 0 || r >= g.length || c >= g.length || g[r][c] != 1) return;
        g[r][c] = 2;
        q.offer(new int[]{r, c});
        mark(g, r + 1, c); mark(g, r - 1, c); mark(g, r, c + 1); mark(g, r, c - 1);
    }
}
