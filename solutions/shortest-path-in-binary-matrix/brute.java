class Solution {
    private int best, n;
    private int[][] g;
    private boolean[][] onPath;

    public int shortestPathBinaryMatrix(int[][] grid) {
        g = grid; n = grid.length;
        if (g[0][0] == 1) return -1;
        best = Integer.MAX_VALUE;
        onPath = new boolean[n][n];
        dfs(0, 0, 1);
        return best == Integer.MAX_VALUE ? -1 : best;
    }

    private void dfs(int r, int c, int len) {              // every simple path
        if (len >= best) return;
        if (r == n - 1 && c == n - 1) { best = len; return; }
        onPath[r][c] = true;
        for (int dr = -1; dr <= 1; dr++)
            for (int dc = -1; dc <= 1; dc++) {
                int nr = r + dr, nc = c + dc;
                if (nr < 0 || nc < 0 || nr >= n || nc >= n || g[nr][nc] == 1 || onPath[nr][nc]) continue;
                dfs(nr, nc, len + 1);
            }
        onPath[r][c] = false;
    }
}
