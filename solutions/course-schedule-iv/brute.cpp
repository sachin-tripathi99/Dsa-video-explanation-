class Solution {
    bool reach(vector<vector<int>>& adj, int u, int target, vector<bool>& seen) {
        if (u == target) return true;
        seen[u] = true;
        for (int w : adj[u]) if (!seen[w] && reach(adj, w, target, seen)) return true;
        return false;
    }
public:
    vector<bool> checkIfPrerequisite(int numCourses, vector<vector<int>>& prerequisites, vector<vector<int>>& queries) {
        vector<vector<int>> adj(numCourses);
        for (auto& p : prerequisites) adj[p[0]].push_back(p[1]);
        vector<bool> res;
        for (auto& q : queries) {                           // a fresh search per query
            vector<bool> seen(numCourses, false);
            res.push_back(reach(adj, q[0], q[1], seen));
        }
        return res;
    }
};
