class Solution {
    public int findTheCity(int n, int[][] edges, int distanceThreshold) {
        final int INF = 1_000_000_000;
        int[][] d = new int[n][n];
        for (int i = 0; i < n; i++) { Arrays.fill(d[i], INF); d[i][i] = 0; }
        for (int[] e : edges) { d[e[0]][e[1]] = e[2]; d[e[1]][e[0]] = e[2]; }
        for (int k = 0; k < n; k++)                         // stopover k outermost
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
        int best = -1, bestCnt = Integer.MAX_VALUE;
        for (int i = 0; i < n; i++) {
            int cnt = 0;
            for (int j = 0; j < n; j++) if (j != i && d[i][j] <= distanceThreshold) cnt++;
            if (cnt <= bestCnt) { bestCnt = cnt; best = i; }   // ≤ keeps the larger index
        }
        return best;
    }
}
