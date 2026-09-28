class Solution {
    int best = INT_MAX;
    vector<vector<int>> dist;
    void order(int last, int mask, int len) {               // every visiting order
        int n = dist.size();
        if (len >= best) return;
        if (mask == (1 << n) - 1) { best = len; return; }
        for (int w = 0; w < n; w++)
            if (!(mask >> w & 1)) order(w, mask | (1 << w), len + dist[last][w]);
    }
public:
    int shortestPathLength(vector<vector<int>>& graph) {
        int n = graph.size();
        dist.assign(n, vector<int>(n, -1));
        for (int s = 0; s < n; s++) {                       // all-pairs distances by BFS
            dist[s][s] = 0;
            queue<int> q;
            q.push(s);
            while (!q.empty()) {
                int u = q.front(); q.pop();
                for (int w : graph[u]) if (dist[s][w] < 0) { dist[s][w] = dist[s][u] + 1; q.push(w); }
            }
        }
        for (int s = 0; s < n; s++) order(s, 1 << s, 0);
        return best;
    }
};
