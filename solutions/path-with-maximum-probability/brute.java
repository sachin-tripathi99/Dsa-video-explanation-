class Solution {
    public double maxProbability(int n, int[][] edges, double[] succProb, int start_node, int end_node) {
        double[] prob = new double[n];
        prob[start_node] = 1;
        for (int round = 1; round < n; round++) {           // n − 1 passes
            boolean changed = false;
            for (int i = 0; i < edges.length; i++) {
                int a = edges[i][0], b = edges[i][1];
                double p = succProb[i];
                if (prob[a] * p > prob[b]) { prob[b] = prob[a] * p; changed = true; }
                if (prob[b] * p > prob[a]) { prob[a] = prob[b] * p; changed = true; }
            }
            if (!changed) break;
        }
        return prob[end_node];
    }
}
