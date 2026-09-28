class Solution {
public:
    int shortestPathLength(vector<vector<int>>& graph) {
        int n = graph.size(), full = (1 << n) - 1, INF = 1000000;
        vector<vector<int>> dist(n, vector<int>(n, -1));
        for (int s = 0; s < n; s++) {                       // all-pairs distances
            dist[s][s] = 0;
            queue<int> q;
            q.push(s);
            while (!q.empty()) {
                int u = q.front(); q.pop();
                for (int w : graph[u]) if (dist[s][w] < 0) { dist[s][w] = dist[s][u] + 1; q.push(w); }
            }
        }
        vector<vector<int>> dp(1 << n, vector<int>(n, INF));   // dp[mask][last]
        for (int i = 0; i < n; i++) dp[1 << i][i] = 0;
        for (int mask = 1; mask <= full; mask++)
            for (int last = 0; last < n; last++) {
                if (dp[mask][last] >= INF) continue;
                for (int w = 0; w < n; w++) {
                    if (mask >> w & 1) continue;
                    int nm = mask | (1 << w);
                    dp[nm][w] = min(dp[nm][w], dp[mask][last] + dist[last][w]);
                }
            }
        return *min_element(dp[full].begin(), dp[full].end());
    }
};
