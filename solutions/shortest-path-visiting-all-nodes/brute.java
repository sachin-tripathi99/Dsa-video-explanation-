class Solution {
    private int best = Integer.MAX_VALUE;

    public int shortestPathLength(int[][] graph) {
        int n = graph.length;
        int[][] dist = new int[n][n];
        for (int s = 0; s < n; s++) {                       // all-pairs distances by BFS
            Arrays.fill(dist[s], -1);
            dist[s][s] = 0;
            Deque<Integer> q = new ArrayDeque<>(List.of(s));
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int w : graph[u]) if (dist[s][w] < 0) { dist[s][w] = dist[s][u] + 1; q.offer(w); }
            }
        }
        for (int s = 0; s < n; s++) order(dist, s, 1 << s, 0);
        return best;
    }

    private void order(int[][] dist, int last, int mask, int len) {   // every visiting order
        int n = dist.length;
        if (len >= best) return;
        if (mask == (1 << n) - 1) { best = len; return; }
        for (int w = 0; w < n; w++)
            if ((mask >> w & 1) == 0) order(dist, w, mask | (1 << w), len + dist[last][w]);
    }
}
