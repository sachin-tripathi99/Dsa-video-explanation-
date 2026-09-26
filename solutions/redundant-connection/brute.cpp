class Solution {
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n = edges.size();
        vector<vector<int>> adj(n + 1);
        for (auto& e : edges) {
            if (connected(adj, e[0], e[1], n)) return e;
            adj[e[0]].push_back(e[1]);
            adj[e[1]].push_back(e[0]);
        }
        return {};
    }
private:
    bool connected(vector<vector<int>>& adj, int from, int to, int n) {
        vector<bool> seen(n + 1, false);
        vector<int> stack = {from};
        seen[from] = true;
        while (!stack.empty()) {
            int x = stack.back(); stack.pop_back();
            if (x == to) return true;
            for (int y : adj[x]) if (!seen[y]) { seen[y] = true; stack.push_back(y); }
        }
        return false;
    }
};
