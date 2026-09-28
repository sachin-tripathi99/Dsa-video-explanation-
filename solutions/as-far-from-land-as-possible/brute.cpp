class Solution {
public:
    int maxDistance(vector<vector<int>>& grid) {
        int n = grid.size();
        vector<pair<int, int>> land;
        for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) if (grid[r][c]) land.push_back({r, c});
        if (land.empty() || (int)land.size() == n * n) return -1;
        int best = 0;
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++) {
                if (grid[r][c]) continue;
                int near = INT_MAX;
                for (auto [lr, lc] : land) near = min(near, abs(r - lr) + abs(c - lc));   // every pair
                best = max(best, near);
            }
        return best;
    }
};
