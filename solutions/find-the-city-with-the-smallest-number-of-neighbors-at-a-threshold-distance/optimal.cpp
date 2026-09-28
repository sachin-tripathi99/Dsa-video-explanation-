class Solution {
public:
    int findTheCity(int n, vector<vector<int>>& edges, int distanceThreshold) {
        const int INF = 1e9;
        vector<vector<int>> d(n, vector<int>(n, INF));
        for (int i = 0; i < n; i++) d[i][i] = 0;
        for (auto& e : edges) { d[e[0]][e[1]] = e[2]; d[e[1]][e[0]] = e[2]; }
        for (int k = 0; k < n; k++)                         // stopover k outermost
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
        int best = -1, bestCnt = INT_MAX;
        for (int i = 0; i < n; i++) {
            int cnt = 0;
            for (int j = 0; j < n; j++) if (j != i && d[i][j] <= distanceThreshold) cnt++;
            if (cnt <= bestCnt) { bestCnt = cnt; best = i; }   // ≤ keeps the larger index
        }
        return best;
    }
};
