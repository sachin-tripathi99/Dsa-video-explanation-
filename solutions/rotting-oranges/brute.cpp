class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size(), minutes = 0;
        while (true) {
            vector<pair<int, int>> toRot;
            for (int r = 0; r < m; r++)                     // full scan every minute
                for (int c = 0; c < n; c++)
                    if (grid[r][c] == 1 && ((r > 0 && grid[r - 1][c] == 2) || (r + 1 < m && grid[r + 1][c] == 2) || (c > 0 && grid[r][c - 1] == 2) || (c + 1 < n && grid[r][c + 1] == 2)))
                        toRot.push_back({r, c});
            if (toRot.empty()) break;
            for (auto [r, c] : toRot) grid[r][c] = 2;
            minutes++;
        }
        for (auto& row : grid) for (int x : row) if (x == 1) return -1;
        return minutes;
    }
};
