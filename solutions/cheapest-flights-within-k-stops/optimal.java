class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        int[] cost = new int[n];
        Arrays.fill(cost, Integer.MAX_VALUE);
        cost[src] = 0;
        for (int round = 0; round <= k; round++) {          // k + 1 flights at most
            int[] prev = cost.clone();                      // read only last round's prices
            for (int[] f : flights)
                if (prev[f[0]] != Integer.MAX_VALUE && prev[f[0]] + f[2] < cost[f[1]]) cost[f[1]] = prev[f[0]] + f[2];
        }
        return cost[dst] == Integer.MAX_VALUE ? -1 : cost[dst];
    }
}
