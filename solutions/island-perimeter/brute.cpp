class Solution {
public:
    int islandPerimeter(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size(), p = 0;
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (!grid[r][c]) continue;
                for (int k = 0; k < 4; k++) {
                    int nr = r + dr[k], nc = c + dc[k];
                    if (nr < 0 || nc < 0 || nr >= m || nc >= n || !grid[nr][nc]) p++;   // exposed side
                }
            }
        return p;
    }
};
