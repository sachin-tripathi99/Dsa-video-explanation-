class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int m = grid.size(), n = grid[0].size(), count = 0;
        vector<vector<bool>> seen(m, vector<bool>(n, false));
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (grid[r][c] != '1' || seen[r][c]) continue;
                count++;
                queue<pair<int, int>> q;
                q.push({r, c});
                seen[r][c] = true;
                while (!q.empty()) {                        // BFS over this island
                    auto [cr, cc] = q.front(); q.pop();
                    for (int k = 0; k < 4; k++) {
                        int nr = cr + dr[k], nc = cc + dc[k];
                        if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] != '1' || seen[nr][nc]) continue;
                        seen[nr][nc] = true;
                        q.push({nr, nc});
                    }
                }
            }
        return count;
    }
};
