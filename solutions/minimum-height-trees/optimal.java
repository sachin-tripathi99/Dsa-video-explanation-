class Solution {
    public List<Integer> findMinHeightTrees(int n, int[][] edges) {
        if (n <= 2) {
            List<Integer> all = new ArrayList<>();
            for (int i = 0; i < n; i++) all.add(i);
            return all;
        }
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] deg = new int[n];
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); deg[e[0]]++; deg[e[1]]++; }
        List<Integer> leaves = new ArrayList<>();
        for (int i = 0; i < n; i++) if (deg[i] == 1) leaves.add(i);
        int left = n;
        while (left > 2) {                                  // peel one layer of leaves
            left -= leaves.size();
            List<Integer> next = new ArrayList<>();
            for (int x : leaves)
                for (int w : adj.get(x)) if (--deg[w] == 1) next.add(w);
            leaves = next;
        }
        return leaves;
    }
}
