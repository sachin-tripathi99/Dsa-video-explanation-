class Solution {
    public double maxProbability(int n, int[][] edges, double[] succProb, int start_node, int end_node) {
        List<List<double[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < edges.length; i++) {
            adj.get(edges[i][0]).add(new double[]{edges[i][1], succProb[i]});
            adj.get(edges[i][1]).add(new double[]{edges[i][0], succProb[i]});
        }
        double[] prob = new double[n];
        prob[start_node] = 1;
        PriorityQueue<double[]> pq = new PriorityQueue<>((a, b) -> Double.compare(b[0], a[0]));   // max-heap
        pq.offer(new double[]{1, start_node});
        while (!pq.isEmpty()) {
            double[] t = pq.poll();
            double p = t[0];
            int u = (int) t[1];
            if (p < prob[u]) continue;                      // stale
            if (u == end_node) return p;                    // popped = final
            for (double[] e : adj.get(u)) {
                int w = (int) e[0];
                if (p * e[1] > prob[w]) { prob[w] = p * e[1]; pq.offer(new double[]{prob[w], w}); }
            }
        }
        return 0;
    }
}
