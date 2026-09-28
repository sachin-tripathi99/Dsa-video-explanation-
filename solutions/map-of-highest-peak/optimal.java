class Solution {
    public int[][] highestPeak(int[][] isWater) {
        int m = isWater.length, n = isWater[0].length;
        int[][] h = new int[m][n];
        Deque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (isWater[r][c] == 1) q.offer(new int[]{r, c});   // all water at height 0
                else h[r][c] = -1;
            }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            for (int[] d : dirs) {
                int r = p[0] + d[0], c = p[1] + d[1];
                if (r < 0 || c < 0 || r >= m || c >= n || h[r][c] != -1) continue;
                h[r][c] = h[p[0]][p[1]] + 1;
                q.offer(new int[]{r, c});
            }
        }
        return h;
    }
}
