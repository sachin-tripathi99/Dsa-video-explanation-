class Solution {
    bool loops(vector<vector<int>>& g, int u, vector<bool>& onPath, vector<bool>& clear) {
        if (onPath[u]) return true;                         // back into the current path
        if (clear[u]) return false;                         // already explored in this search
        onPath[u] = true;
        for (int w : g[u]) if (loops(g, w, onPath, clear)) return true;
        onPath[u] = false;
        clear[u] = true;
        return false;
    }
public:
    vector<int> eventualSafeNodes(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> res;
        for (int s = 0; s < n; s++) {                       // a fresh search from every node
            vector<bool> onPath(n, false), clear(n, false);
            if (!loops(graph, s, onPath, clear)) res.push_back(s);
        }
        return res;
    }
};
