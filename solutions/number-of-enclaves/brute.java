class Solution {
    public int numEnclaves(int[][] grid) {
        int m = grid.length, n = grid[0].length, count = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int sr = 0; sr < m; sr++)
            for (int sc = 0; sc < n; sc++) {
                if (grid[sr][sc] != 1) continue;
                boolean[][] seen = new boolean[m][n];           // fresh search per land cell
                Deque<int[]> q = new ArrayDeque<>();
                q.offer(new int[]{sr, sc});
                seen[sr][sc] = true;
                boolean escapes = false;
                while (!q.isEmpty() && !escapes) {
                    int[] p = q.poll();
                    if (p[0] == 0 || p[1] == 0 || p[0] == m - 1 || p[1] == n - 1) escapes = true;
                    for (int[] d : dirs) {
                        int r = p[0] + d[0], c = p[1] + d[1];
                        if (r < 0 || c < 0 || r >= m || c >= n || seen[r][c] || grid[r][c] != 1) continue;
                        seen[r][c] = true;
                        q.offer(new int[]{r, c});
                    }
                }
                if (!escapes) count++;
            }
        return count;
    }
}
