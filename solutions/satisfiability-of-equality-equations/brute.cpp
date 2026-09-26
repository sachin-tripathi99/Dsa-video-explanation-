class Solution {
public:
    bool equationsPossible(vector<string>& equations) {
        vector<vector<int>> adj(26);
        for (auto& e : equations)
            if (e[1] == '=') {
                int x = e[0] - 'a', y = e[3] - 'a';
                adj[x].push_back(y);
                adj[y].push_back(x);
            }
        for (auto& e : equations)
            if (e[1] == '!' && reaches(adj, e[0] - 'a', e[3] - 'a')) return false;
        return true;
    }
private:
    bool reaches(vector<vector<int>>& adj, int from, int to) {
        vector<bool> seen(26, false);
        queue<int> q;
        q.push(from);
        seen[from] = true;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (u == to) return true;
            for (int w : adj[u]) if (!seen[w]) { seen[w] = true; q.push(w); }
        }
        return false;
    }
};
