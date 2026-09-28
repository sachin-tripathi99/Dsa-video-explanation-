class Solution {
public:
    vector<vector<int>> highestPeak(vector<vector<int>>& isWater) {
        int m = isWater.size(), n = isWater[0].size();
        vector<vector<int>> h(m, vector<int>(n, -1));
        queue<pair<int, int>> q;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (isWater[r][c]) { h[r][c] = 0; q.push({r, c}); }   // all water at height 0
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (nr < 0 || nc < 0 || nr >= m || nc >= n || h[nr][nc] != -1) continue;
                h[nr][nc] = h[r][c] + 1;
                q.push({nr, nc});
            }
        }
        return h;
    }
};
