class Solution {
public:
    vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
        vector<vector<int>> adj(n);
        for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
        vector<int> h(n, 0);
        for (int r = 0; r < n; r++) {                       // one BFS per possible root
            vector<int> d(n, -1);
            d[r] = 0;
            queue<int> q;
            q.push(r);
            while (!q.empty()) {
                int x = q.front(); q.pop();
                h[r] = max(h[r], d[x]);
                for (int w : adj[x]) if (d[w] < 0) { d[w] = d[x] + 1; q.push(w); }
            }
        }
        int best = *min_element(h.begin(), h.end());
        vector<int> res;
        for (int r = 0; r < n; r++) if (h[r] == best) res.push_back(r);
        return res;
    }
};
