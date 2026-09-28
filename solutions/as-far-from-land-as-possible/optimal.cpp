class Solution {
public:
    int maxDistance(vector<vector<int>>& grid) {
        int n = grid.size();
        vector<vector<int>> d(n, vector<int>(n, -1));
        queue<pair<int, int>> q;
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++)
                if (grid[r][c]) { d[r][c] = 0; q.push({r, c}); }   // all land at distance 0
        if (q.empty() || (int)q.size() == n * n) return -1;
        int best = 0, dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (nr < 0 || nc < 0 || nr >= n || nc >= n || d[nr][nc] != -1) continue;
                d[nr][nc] = d[r][c] + 1;
                best = d[nr][nc];                           // last assigned = farthest
                q.push({nr, nc});
            }
        }
        return best;
    }
};
