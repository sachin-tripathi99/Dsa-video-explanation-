class Solution {
    public int findTheCity(int n, int[][] edges, int distanceThreshold) {
        int best = -1, bestCnt = Integer.MAX_VALUE;
        for (int s = 0; s < n; s++) {                       // Bellman-Ford from every city
            int[] d = new int[n];
            Arrays.fill(d, Integer.MAX_VALUE);
            d[s] = 0;
            for (int round = 1; round < n; round++)
                for (int[] e : edges) {
                    if (d[e[0]] != Integer.MAX_VALUE && d[e[0]] + e[2] < d[e[1]]) d[e[1]] = d[e[0]] + e[2];
                    if (d[e[1]] != Integer.MAX_VALUE && d[e[1]] + e[2] < d[e[0]]) d[e[0]] = d[e[1]] + e[2];
                }
            int cnt = 0;
            for (int j = 0; j < n; j++) if (j != s && d[j] <= distanceThreshold) cnt++;
            if (cnt <= bestCnt) { bestCnt = cnt; best = s; }   // ≤ keeps the larger index
        }
        return best;
    }
}
