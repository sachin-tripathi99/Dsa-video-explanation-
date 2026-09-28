class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indeg(numCourses, 0), order;
        for (auto& p : prerequisites) { adj[p[1]].push_back(p[0]); indeg[p[0]]++; }
        queue<int> q;
        for (int c = 0; c < numCourses; c++) if (indeg[c] == 0) q.push(c);
        while (!q.empty()) {
            int c = q.front(); q.pop();
            order.push_back(c);                             // pop order = schedule
            for (int next : adj[c]) if (--indeg[next] == 0) q.push(next);
        }
        if ((int)order.size() != numCourses) return {};
        return order;
    }
};
