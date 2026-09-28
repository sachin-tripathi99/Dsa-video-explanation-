class Solution {
    void fill(vector<vector<int>>& g, vector<vector<int>>& label, int r, int c, int k) {
        int n = g.size();
        if (r < 0 || c < 0 || r >= n || c >= n || g[r][c] != 1 || label[r][c]) return;
        label[r][c] = k;
        fill(g, label, r + 1, c, k); fill(g, label, r - 1, c, k); fill(g, label, r, c + 1, k); fill(g, label, r, c - 1, k);
    }
public:
    int shortestBridge(vector<vector<int>>& grid) {
        int n = grid.size(), k = 0;
        vector<vector<int>> label(n, vector<int>(n, 0));
        for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) if (grid[r][c] == 1 && !label[r][c]) fill(grid, label, r, c, ++k);
        vector<pair<int, int>> a, b;
        for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) { if (label[r][c] == 1) a.push_back({r, c}); if (label[r][c] == 2) b.push_back({r, c}); }
        int best = INT_MAX;
        for (auto [r1, c1] : a) for (auto [r2, c2] : b) best = min(best, abs(r1 - r2) + abs(c1 - c2) - 1);   // every pair
        return best;
    }
};
