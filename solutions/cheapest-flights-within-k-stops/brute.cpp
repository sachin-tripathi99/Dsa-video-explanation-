class Solution {
    int best = INT_MAX;
    void dfs(vector<vector<pair<int, int>>>& adj, int city, int dst, int cost, int left) {
        if (city == dst) { best = min(best, cost); return; }
        if (left == 0) return;
        for (auto [nxt, p] : adj[city]) dfs(adj, nxt, dst, cost + p, left - 1);   // every route
    }
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<vector<pair<int, int>>> adj(n);
        for (auto& f : flights) adj[f[0]].push_back({f[1], f[2]});
        dfs(adj, src, dst, 0, k + 1);
        return best == INT_MAX ? -1 : best;
    }
};
