class Solution {
public:
    vector<bool> checkIfPrerequisite(int numCourses, vector<vector<int>>& prerequisites, vector<vector<int>>& queries) {
        int n = numCourses;
        vector<vector<int>> adj(n);
        vector<int> indeg(n, 0);
        for (auto& p : prerequisites) { adj[p[0]].push_back(p[1]); indeg[p[1]]++; }
        vector<bitset<100>> before(n);                      // before[v][u]: u comes before v
        queue<int> q;
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int w : adj[u]) {
                before[w] |= before[u];                     // hand down u's set, plus u
                before[w][u] = 1;
                if (--indeg[w] == 0) q.push(w);
            }
        }
        vector<bool> res;
        for (auto& qu : queries) res.push_back(before[qu[1]][qu[0]]);
        return res;
    }
};
