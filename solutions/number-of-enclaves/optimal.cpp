class Solution {
    void sink(vector<vector<int>>& g, int r, int c) {
        if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != 1) return;
        g[r][c] = 0;
        sink(g, r + 1, c); sink(g, r - 1, c); sink(g, r, c + 1); sink(g, r, c - 1);
    }
public:
    int numEnclaves(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        for (int r = 0; r < m; r++) { sink(grid, r, 0); sink(grid, r, n - 1); }   // border land
        for (int c = 0; c < n; c++) { sink(grid, 0, c); sink(grid, m - 1, c); }
        int count = 0;
        for (auto& row : grid) for (int x : row) count += x;    // trapped land
        return count;
    }
};
