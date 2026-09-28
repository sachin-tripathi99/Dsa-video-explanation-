class Solution {
public:
    bool isBipartite(vector<vector<int>>& graph) {
        int n = graph.size();
        for (int mask = 0; mask < (1 << n); mask++) {       // every 2-colouring
            bool ok = true;
            for (int u = 0; u < n && ok; u++)
                for (int w : graph[u]) if (((mask >> u) & 1) == ((mask >> w) & 1)) { ok = false; break; }
            if (ok) return true;
        }
        return false;
    }
};
