class Solution {
    int best, n;
    vector<vector<int>>* g;
    vector<vector<bool>> onPath;
    void dfs(int r, int c, int len) {                       // every simple path
        if (len >= best) return;
        if (r == n - 1 && c == n - 1) { best = len; return; }
        onPath[r][c] = true;
        for (int dr = -1; dr <= 1; dr++)
            for (int dc = -1; dc <= 1; dc++) {
                int nr = r + dr, nc = c + dc;
                if (nr < 0 || nc < 0 || nr >= n || nc >= n || (*g)[nr][nc] == 1 || onPath[nr][nc]) continue;
                dfs(nr, nc, len + 1);
            }
        onPath[r][c] = false;
    }
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        g = &grid; n = grid.size();
        if (grid[0][0]) return -1;
        best = INT_MAX;
        onPath.assign(n, vector<bool>(n, false));
        dfs(0, 0, 1);
        return best == INT_MAX ? -1 : best;
    }
};
