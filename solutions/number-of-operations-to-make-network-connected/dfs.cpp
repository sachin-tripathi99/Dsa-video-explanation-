class Solution {
public:
    int makeConnected(int n, vector<vector<int>>& connections) {
        if ((int)connections.size() < n - 1) return -1;     // not enough cables in total
        vector<vector<int>> adj(n);
        for (auto& c : connections) { adj[c[0]].push_back(c[1]); adj[c[1]].push_back(c[0]); }
        vector<bool> seen(n, false);
        int components = 0;
        for (int s = 0; s < n; s++) {
            if (seen[s]) continue;
            components++;
            vector<int> stack = {s};
            seen[s] = true;
            while (!stack.empty()) {
                int x = stack.back(); stack.pop_back();
                for (int y : adj[x]) if (!seen[y]) { seen[y] = true; stack.push_back(y); }
            }
        }
        return components - 1;
    }
};
