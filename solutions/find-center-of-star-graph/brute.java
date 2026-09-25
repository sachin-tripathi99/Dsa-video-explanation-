class Solution {
    public int findCenter(int[][] edges) {
        int n = edges.length + 1;
        int[] deg = new int[n + 1];
        for (int[] e : edges) { deg[e[0]]++; deg[e[1]]++; }
        for (int v = 1; v <= n; v++) if (deg[v] == n - 1) return v;
        return -1;
    }
}
