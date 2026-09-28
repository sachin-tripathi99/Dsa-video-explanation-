class Solution {
    public int swimInWater(int[][] grid) {
        for (int t = grid[0][0]; ; t++)                     // raise the water step by step
            if (reach(grid, t)) return t;
    }

    private boolean reach(int[][] g, int t) {
        int n = g.length;
        boolean[][] seen = new boolean[n][n];
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0});
        seen[0][0] = true;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            if (p[0] == n - 1 && p[1] == n - 1) return true;
            for (int[] d : dirs) {
                int r = p[0] + d[0], c = p[1] + d[1];
                if (r < 0 || c < 0 || r >= n || c >= n || seen[r][c] || g[r][c] > t) continue;
                seen[r][c] = true;
                q.offer(new int[]{r, c});
            }
        }
        return false;
    }
}
