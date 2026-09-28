class Solution {
    public int minimumEffortPath(int[][] heights) {
        for (int limit = 0; ; limit++)                      // try every limit
            if (reach(heights, limit)) return limit;
    }

    private boolean reach(int[][] h, int limit) {
        int R = h.length, C = h[0].length;
        boolean[][] seen = new boolean[R][C];
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0});
        seen[0][0] = true;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            if (p[0] == R - 1 && p[1] == C - 1) return true;
            for (int[] d : dirs) {
                int r = p[0] + d[0], c = p[1] + d[1];
                if (r < 0 || c < 0 || r >= R || c >= C || seen[r][c] || Math.abs(h[r][c] - h[p[0]][p[1]]) > limit) continue;
                seen[r][c] = true;
                q.offer(new int[]{r, c});
            }
        }
        return false;
    }
}
