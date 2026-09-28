class Solution {
    int measure(vector<vector<int>>& g, int r, int c, vector<vector<bool>>& seen) {
        if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != 1 || seen[r][c]) return 0;
        seen[r][c] = true;
        return 1 + measure(g, r + 1, c, seen) + measure(g, r - 1, c, seen) + measure(g, r, c + 1, seen) + measure(g, r, c - 1, seen);
    }
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size(), best = 0;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (grid[r][c] == 1) {
                    vector<vector<bool>> seen(m, vector<bool>(n, false));   // fresh visited each time
                    best = max(best, measure(grid, r, c, seen));
                }
        return best;
    }
};
