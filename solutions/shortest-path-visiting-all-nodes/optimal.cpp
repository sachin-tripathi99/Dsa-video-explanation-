class Solution {
public:
    int shortestPathLength(vector<vector<int>>& graph) {
        int n = graph.size(), full = (1 << n) - 1;
        vector<vector<bool>> seen(n, vector<bool>(1 << n, false));
        queue<pair<int, int>> q;
        for (int i = 0; i < n; i++) { q.push({i, 1 << i}); seen[i][1 << i] = true; }   // start anywhere
        for (int d = 0; !q.empty(); d++)
            for (int k = q.size(); k > 0; k--) {
                auto [u, mask] = q.front(); q.pop();
                if (mask == full) return d;                 // everything visited
                for (int w : graph[u]) {
                    int nm = mask | (1 << w);
                    if (!seen[w][nm]) { seen[w][nm] = true; q.push({w, nm}); }
                }
            }
        return -1;
    }
};
