class Solution {
    queue<pair<int, int>> q;
    void mark(vector<vector<int>>& g, int r, int c) {
        int n = g.size();
        if (r < 0 || c < 0 || r >= n || c >= n || g[r][c] != 1) return;
        g[r][c] = 2;
        q.push({r, c});
        mark(g, r + 1, c); mark(g, r - 1, c); mark(g, r, c + 1); mark(g, r, c - 1);
    }
public:
    int shortestBridge(vector<vector<int>>& grid) {
        int n = grid.size();
        bool done = false;
        for (int r = 0; r < n && !done; r++)
            for (int c = 0; c < n && !done; c++)
                if (grid[r][c] == 1) { mark(grid, r, c); done = true; }   // island A → sources
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        for (int flips = 0; !q.empty(); flips++) {
            for (int k = q.size(); k > 0; k--) {
                auto [r, c] = q.front(); q.pop();
                for (int d = 0; d < 4; d++) {
                    int nr = r + dr[d], nc = c + dc[d];
                    if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] == 2) continue;
                    if (grid[nr][nc] == 1) return flips;    // touched island B
                    grid[nr][nc] = 2;
                    q.push({nr, nc});
                }
            }
        }
        return -1;
    }
};
