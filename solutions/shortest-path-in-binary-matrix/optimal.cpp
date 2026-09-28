class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n = grid.size();
        if (grid[0][0] || grid[n - 1][n - 1]) return -1;
        vector<vector<int>> dist(n, vector<int>(n, 0));
        dist[0][0] = 1;
        queue<pair<int, int>> q;
        q.push({0, 0});
        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            if (r == n - 1 && c == n - 1) return dist[r][c];
            for (int dr = -1; dr <= 1; dr++)
                for (int dc = -1; dc <= 1; dc++) {          // 8 directions
                    int nr = r + dr, nc = c + dc;
                    if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] || dist[nr][nc]) continue;
                    dist[nr][nc] = dist[r][c] + 1;          // mark when pushing
                    q.push({nr, nc});
                }
        }
        return -1;
    }
};
