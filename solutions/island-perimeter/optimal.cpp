class Solution {
public:
    int islandPerimeter(vector<vector<int>>& grid) {
        int land = 0, shared = 0, m = grid.size(), n = grid[0].size();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (!grid[r][c]) continue;
                land++;
                if (r + 1 < m && grid[r + 1][c]) shared++;          // down
                if (c + 1 < n && grid[r][c + 1]) shared++;          // right
            }
        return 4 * land - 2 * shared;
    }
};
