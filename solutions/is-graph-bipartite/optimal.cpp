class Solution {
public:
    bool isBipartite(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> col(n, -1);
        for (int s = 0; s < n; s++) {                       // every component
            if (col[s] != -1) continue;
            col[s] = 0;
            queue<int> q;
            q.push(s);
            while (!q.empty()) {
                int x = q.front(); q.pop();
                for (int y : graph[x]) {
                    if (col[y] == -1) { col[y] = 1 - col[x]; q.push(y); }   // forced colour
                    else if (col[y] == col[x]) return false;                // conflict
                }
            }
        }
        return true;
    }
};
