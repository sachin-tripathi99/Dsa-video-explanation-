class Solution {
    public int minimumEffortPath(int[][] heights) {
        int R = heights.length, C = heights[0].length;
        int[][] eff = new int[R][C];
        for (int[] row : eff) Arrays.fill(row, Integer.MAX_VALUE);
        eff[0][0] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, 0, 0});
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!pq.isEmpty()) {
            int[] t = pq.poll();
            int d = t[0], r = t[1], c = t[2];
            if (d > eff[r][c]) continue;                    // stale
            if (r == R - 1 && c == C - 1) return d;         // popped = final
            for (int[] dd : dirs) {
                int nr = r + dd[0], nc = c + dd[1];
                if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
                int e = Math.max(d, Math.abs(heights[nr][nc] - heights[r][c]));   // worst step so far
                if (e < eff[nr][nc]) { eff[nr][nc] = e; pq.offer(new int[]{e, nr, nc}); }
            }
        }
        return 0;
    }
}
