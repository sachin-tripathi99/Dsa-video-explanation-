class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        int[] best = new int[n];                            // cheapest link from the tree
        Arrays.fill(best, Integer.MAX_VALUE);
        boolean[] inTree = new boolean[n];
        best[0] = 0;
        int total = 0;
        for (int k = 0; k < n; k++) {
            int u = -1;
            for (int i = 0; i < n; i++) if (!inTree[i] && (u < 0 || best[i] < best[u])) u = i;
            inTree[u] = true;
            total += best[u];
            for (int i = 0; i < n; i++)
                if (!inTree[i]) best[i] = Math.min(best[i], Math.abs(points[u][0] - points[i][0]) + Math.abs(points[u][1] - points[i][1]));
        }
        return total;
    }
}
