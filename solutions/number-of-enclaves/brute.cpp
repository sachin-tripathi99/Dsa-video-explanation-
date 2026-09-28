class Solution {
public:
    int numEnclaves(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size(), count = 0;
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        for (int sr = 0; sr < m; sr++)
            for (int sc = 0; sc < n; sc++) {
                if (grid[sr][sc] != 1) continue;
                vector<vector<bool>> seen(m, vector<bool>(n, false));   // fresh search per land cell
                queue<pair<int, int>> q;
                q.push({sr, sc});
                seen[sr][sc] = true;
                bool escapes = false;
                while (!q.empty() && !escapes) {
                    auto [r, c] = q.front(); q.pop();
                    if (r == 0 || c == 0 || r == m - 1 || c == n - 1) escapes = true;
                    for (int k = 0; k < 4; k++) {
                        int nr = r + dr[k], nc = c + dc[k];
                        if (nr < 0 || nc < 0 || nr >= m || nc >= n || seen[nr][nc] || grid[nr][nc] != 1) continue;
                        seen[nr][nc] = true;
                        q.push({nr, nc});
                    }
                }
                if (!escapes) count++;
            }
        return count;
    }
};
