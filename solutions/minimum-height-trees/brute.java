class Solution {
    public List<Integer> findMinHeightTrees(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        int[] h = new int[n];
        int best = Integer.MAX_VALUE;
        for (int r = 0; r < n; r++) {                       // one BFS per possible root
            int[] d = new int[n];
            Arrays.fill(d, -1);
            d[r] = 0;
            Deque<Integer> q = new ArrayDeque<>(List.of(r));
            while (!q.isEmpty()) {
                int x = q.poll();
                h[r] = Math.max(h[r], d[x]);
                for (int w : adj.get(x)) if (d[w] < 0) { d[w] = d[x] + 1; q.offer(w); }
            }
            best = Math.min(best, h[r]);
        }
        List<Integer> res = new ArrayList<>();
        for (int r = 0; r < n; r++) if (h[r] == best) res.add(r);
        return res;
    }
}
