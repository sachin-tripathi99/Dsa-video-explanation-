class Solution {
public:
    double maxProbability(int n, vector<vector<int>>& edges, vector<double>& succProb, int start_node, int end_node) {
        vector<double> prob(n, 0.0);
        prob[start_node] = 1.0;
        for (int round = 1; round < n; round++) {           // n − 1 passes
            bool changed = false;
            for (int i = 0; i < (int)edges.size(); i++) {
                int a = edges[i][0], b = edges[i][1];
                double p = succProb[i];
                if (prob[a] * p > prob[b]) { prob[b] = prob[a] * p; changed = true; }
                if (prob[b] * p > prob[a]) { prob[a] = prob[b] * p; changed = true; }
            }
            if (!changed) break;
        }
        return prob[end_node];
    }
};
