class Solution {
    public boolean validPath(int n, int[][] edges, int source, int destination) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }

        boolean[] seen = new boolean[n];
        Deque<Integer> queue = new ArrayDeque<>();
        queue.offer(source);
        seen[source] = true;
        while (!queue.isEmpty()) {
            int node = queue.poll();
            if (node == destination) return true;
            for (int nb : adj.get(node)) {
                if (!seen[nb]) { seen[nb] = true; queue.offer(nb); }   // mark on push
            }
        }
        return false;
    }
}
