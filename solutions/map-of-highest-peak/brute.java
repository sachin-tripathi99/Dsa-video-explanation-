class Solution {
    public int[][] highestPeak(int[][] isWater) {
        int m = isWater.length, n = isWater[0].length;
        int[][] h = new int[m][n];
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int sr = 0; sr < m; sr++)
            for (int sc = 0; sc < n; sc++) {
                boolean[][] seen = new boolean[m][n];       // fresh BFS per cell
                Deque<int[]> q = new ArrayDeque<>();
                q.offer(new int[]{sr, sc, 0});
                seen[sr][sc] = true;
                while (!q.isEmpty()) {
                    int[] p = q.poll();
                    if (isWater[p[0]][p[1]] == 1) { h[sr][sc] = p[2]; break; }
                    for (int[] d : dirs) {
                        int r = p[0] + d[0], c = p[1] + d[1];
                        if (r < 0 || c < 0 || r >= m || c >= n || seen[r][c]) continue;
                        seen[r][c] = true;
                        q.offer(new int[]{r, c, p[2] + 1});
                    }
                }
            }
        return h;
    }
}
