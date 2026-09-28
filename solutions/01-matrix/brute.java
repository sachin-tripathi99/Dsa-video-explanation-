class Solution {
    public int[][] updateMatrix(int[][] mat) {
        int m = mat.length, n = mat[0].length;
        int[][] out = new int[m][n];
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int sr = 0; sr < m; sr++)
            for (int sc = 0; sc < n; sc++) {
                if (mat[sr][sc] == 0) continue;
                int[][] d = new int[m][n];                  // fresh BFS per cell
                for (int[] row : d) Arrays.fill(row, -1);
                d[sr][sc] = 0;
                Deque<int[]> q = new ArrayDeque<>();
                q.offer(new int[]{sr, sc});
                while (!q.isEmpty()) {
                    int[] p = q.poll();
                    if (mat[p[0]][p[1]] == 0) { out[sr][sc] = d[p[0]][p[1]]; break; }
                    for (int[] dd : dirs) {
                        int r = p[0] + dd[0], c = p[1] + dd[1];
                        if (r < 0 || c < 0 || r >= m || c >= n || d[r][c] != -1) continue;
                        d[r][c] = d[p[0]][p[1]] + 1;
                        q.offer(new int[]{r, c});
                    }
                }
            }
        return out;
    }
}
