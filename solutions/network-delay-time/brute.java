class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        for (int round = 1; round < n; round++)             // n − 1 passes
            for (int[] t : times)
                if (dist[t[0]] != Integer.MAX_VALUE && dist[t[0]] + t[2] < dist[t[1]]) dist[t[1]] = dist[t[0]] + t[2];
        int best = 0;
        for (int v = 1; v <= n; v++) {
            if (dist[v] == Integer.MAX_VALUE) return -1;
            best = Math.max(best, dist[v]);
        }
        return best;
    }
}
