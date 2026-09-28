class Solution {
    private int best = Integer.MAX_VALUE;

    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] f : flights) adj.get(f[0]).add(new int[]{f[1], f[2]});
        dfs(adj, src, dst, 0, k + 1);
        return best == Integer.MAX_VALUE ? -1 : best;
    }

    private void dfs(List<List<int[]>> adj, int city, int dst, int cost, int flightsLeft) {
        if (city == dst) { best = Math.min(best, cost); return; }
        if (flightsLeft == 0) return;
        for (int[] e : adj.get(city)) dfs(adj, e[0], dst, cost + e[1], flightsLeft - 1);   // every route
    }
}
