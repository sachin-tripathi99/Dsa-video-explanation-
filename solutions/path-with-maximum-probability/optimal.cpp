class Solution {
public:
    double maxProbability(int n, vector<vector<int>>& edges, vector<double>& succProb, int start_node, int end_node) {
        vector<vector<pair<int, double>>> adj(n);
        for (int i = 0; i < (int)edges.size(); i++) {
            adj[edges[i][0]].push_back({edges[i][1], succProb[i]});
            adj[edges[i][1]].push_back({edges[i][0], succProb[i]});
        }
        vector<double> prob(n, 0.0);
        prob[start_node] = 1.0;
        priority_queue<pair<double, int>> pq;               // max-heap
        pq.push({1.0, start_node});
        while (!pq.empty()) {
            auto [p, u] = pq.top(); pq.pop();
            if (p < prob[u]) continue;                      // stale
            if (u == end_node) return p;                    // popped = final
            for (auto [w, q] : adj[u])
                if (p * q > prob[w]) { prob[w] = p * q; pq.push({prob[w], w}); }
        }
        return 0.0;
    }
};
