class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        List<int[]> edges = new ArrayList<>();              // every pair
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                edges.add(new int[]{Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]), i, j});
        edges.sort((a, b) -> a[0] - b[0]);
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int total = 0, used = 0;
        for (int[] e : edges) {
            int a = find(parent, e[1]), b = find(parent, e[2]);
            if (a == b) continue;                           // would close a cycle
            parent[a] = b;
            total += e[0];
            if (++used == n - 1) break;
        }
        return total;
    }

    private int find(int[] p, int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    }
}
