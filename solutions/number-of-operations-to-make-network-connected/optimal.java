class Solution {
    private int[] parent, size;

    private int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    public int makeConnected(int n, int[][] connections) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
        int components = n, spare = 0;
        for (int[] c : connections) {
            int ra = find(c[0]), rb = find(c[1]);
            if (ra == rb) { spare++; continue; }         // already connected: a cable we can move
            if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
            parent[rb] = ra;
            size[ra] += size[rb];
            components--;
        }
        return spare >= components - 1 ? components - 1 : -1;
    }
}
