class Solution {
public:
    vector<int> eventualSafeNodes(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<vector<int>> rev(n);
        vector<int> out(n);
        for (int x = 0; x < n; x++) {
            out[x] = graph[x].size();
            for (int y : graph[x]) rev[y].push_back(x);     // reversed arrows
        }
        queue<int> q;
        for (int x = 0; x < n; x++) if (out[x] == 0) q.push(x);   // terminal = safe
        vector<bool> safe(n, false);
        while (!q.empty()) {
            int y = q.front(); q.pop();
            safe[y] = true;
            for (int x : rev[y]) if (--out[x] == 0) q.push(x);
        }
        vector<int> res;
        for (int x = 0; x < n; x++) if (safe[x]) res.push_back(x);
        return res;
    }
};
