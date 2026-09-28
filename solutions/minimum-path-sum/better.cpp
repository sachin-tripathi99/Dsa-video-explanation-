class Solution {
    vector<vector<int>> memo;
    int best(vector<vector<int>>& g, int r, int c) {
        if (r < 0 || c < 0) return INT_MAX;
        if (r == 0 && c == 0) return g[0][0];
        if (memo[r][c] >= 0) return memo[r][c];             // solved before
        return memo[r][c] = g[r][c] + min(best(g, r - 1, c), best(g, r, c - 1));
    }
public:
    int minPathSum(vector<vector<int>>& grid) {
        memo.assign(grid.size(), vector<int>(grid[0].size(), -1));
        return best(grid, grid.size() - 1, grid[0].size() - 1);
    }
};
