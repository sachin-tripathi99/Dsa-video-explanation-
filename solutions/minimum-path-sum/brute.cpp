class Solution {
    int best(vector<vector<int>>& g, int r, int c) {
        if (r < 0 || c < 0) return INT_MAX;                 // off-grid
        if (r == 0 && c == 0) return g[0][0];
        return g[r][c] + min(best(g, r - 1, c), best(g, r, c - 1));
    }
public:
    int minPathSum(vector<vector<int>>& grid) {
        return best(grid, grid.size() - 1, grid[0].size() - 1);
    }
};
