class Solution {
    public int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            if (connected(adj, e[0], e[1], n)) return e;
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        return new int[0];
    }

    private boolean connected(List<List<Integer>> adj, int from, int to, int n) {
        boolean[] seen = new boolean[n + 1];
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(from);
        seen[from] = true;
        while (!stack.isEmpty()) {
            int x = stack.pop();
            if (x == to) return true;
            for (int y : adj.get(x)) if (!seen[y]) { seen[y] = true; stack.push(y); }
        }
        return false;
    }
}
