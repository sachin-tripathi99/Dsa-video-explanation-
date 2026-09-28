class Solution {
    bool loops(vector<vector<int>>& adj, int u, vector<bool>& onPath) {
        if (onPath[u]) return true;                         // came back to the current path
        onPath[u] = true;
        for (int w : adj[u]) if (loops(adj, w, onPath)) return true;
        onPath[u] = false;
        return false;
    }
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        for (auto& p : prerequisites) adj[p[1]].push_back(p[0]);
        for (int s = 0; s < numCourses; s++) {              // a fresh search from every course
            vector<bool> onPath(numCourses, false);
            if (loops(adj, s, onPath)) return false;
        }
        return true;
    }
};
