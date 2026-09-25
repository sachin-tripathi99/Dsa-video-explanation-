class Solution {
public:
    bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {
        vector<vector<int>> adj(n);
        for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }

        vector<bool> seen(n, false);
        queue<int> q;
        q.push(source);
        seen[source] = true;
        while (!q.empty()) {
            int node = q.front(); q.pop();
            if (node == destination) return true;
            for (int nb : adj[node]) {
                if (!seen[nb]) { seen[nb] = true; q.push(nb); }   // mark on push
            }
        }
        return false;
    }
};
