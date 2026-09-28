class Solution {
    public int shortestPathLength(int[][] graph) {
        int n = graph.length, full = (1 << n) - 1, INF = 1_000_000;
        int[][] dist = new int[n][n];
        for (int s = 0; s < n; s++) {                       // all-pairs distances
            Arrays.fill(dist[s], -1);
            dist[s][s] = 0;
            Deque<Integer> q = new ArrayDeque<>(List.of(s));
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int w : graph[u]) if (dist[s][w] < 0) { dist[s][w] = dist[s][u] + 1; q.offer(w); }
            }
        }
        int[][] dp = new int[1 << n][n];                    // dp[mask][last]
        for (int[] row : dp) Arrays.fill(row, INF);
        for (int i = 0; i < n; i++) dp[1 << i][i] = 0;
        for (int mask = 1; mask <= full; mask++)
            for (int last = 0; last < n; last++) {
                if (dp[mask][last] >= INF) continue;
                for (int w = 0; w < n; w++) {
                    if ((mask >> w & 1) == 1) continue;
                    int nm = mask | (1 << w);
                    dp[nm][w] = Math.min(dp[nm][w], dp[mask][last] + dist[last][w]);
                }
            }
        int best = INF;
        for (int last = 0; last < n; last++) best = Math.min(best, dp[full][last]);
        return best;
    }
}
