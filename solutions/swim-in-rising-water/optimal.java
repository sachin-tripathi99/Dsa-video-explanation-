class Solution {
    public int swimInWater(int[][] grid) {
        int n = grid.length;
        int[][] time = new int[n][n];
        for (int[] row : time) Arrays.fill(row, Integer.MAX_VALUE);
        time[0][0] = grid[0][0];
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{grid[0][0], 0, 0});
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!pq.isEmpty()) {
            int[] t = pq.poll();
            int d = t[0], r = t[1], c = t[2];
            if (d > time[r][c]) continue;                   // stale
            if (r == n - 1 && c == n - 1) return d;         // popped = final
            for (int[] dd : dirs) {
                int nr = r + dd[0], nc = c + dd[1];
                if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
                int x = Math.max(d, grid[nr][nc]);          // highest cell on the route
                if (x < time[nr][nc]) { time[nr][nc] = x; pq.offer(new int[]{x, nr, nc}); }
            }
        }
        return -1;
    }
}
