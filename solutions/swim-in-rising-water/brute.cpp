class Solution {
    bool reach(vector<vector<int>>& g, int t) {
        int n = g.size();
        vector<vector<bool>> seen(n, vector<bool>(n, false));
        queue<pair<int, int>> q;
        q.push({0, 0});
        seen[0][0] = true;
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            if (r == n - 1 && c == n - 1) return true;
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (nr < 0 || nc < 0 || nr >= n || nc >= n || seen[nr][nc] || g[nr][nc] > t) continue;
                seen[nr][nc] = true;
                q.push({nr, nc});
            }
        }
        return false;
    }
public:
    int swimInWater(vector<vector<int>>& grid) {
        for (int t = grid[0][0]; ; t++)                     // raise the water step by step
            if (reach(grid, t)) return t;
    }
};
