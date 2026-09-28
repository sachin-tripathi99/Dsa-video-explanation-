class Solution {
public:
    vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
        if (n <= 2) {
            vector<int> all(n);
            iota(all.begin(), all.end(), 0);
            return all;
        }
        vector<vector<int>> adj(n);
        vector<int> deg(n, 0);
        for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); deg[e[0]]++; deg[e[1]]++; }
        vector<int> leaves;
        for (int i = 0; i < n; i++) if (deg[i] == 1) leaves.push_back(i);
        int left = n;
        while (left > 2) {                                  // peel one layer of leaves
            left -= leaves.size();
            vector<int> next;
            for (int x : leaves)
                for (int w : adj[x]) if (--deg[w] == 1) next.push_back(w);
            leaves = next;
        }
        return leaves;
    }
};
