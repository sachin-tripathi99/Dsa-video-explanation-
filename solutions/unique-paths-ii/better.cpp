class Solution {
    vector<vector<int>> memo;
    int paths(vector<vector<int>>& g, int r, int c) {
        if (r < 0 || c < 0 || g[r][c] == 1) return 0;
        if (r == 0 && c == 0) return 1;
        if (memo[r][c] >= 0) return memo[r][c];             // solved before
        return memo[r][c] = paths(g, r - 1, c) + paths(g, r, c - 1);
    }
public:
    int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
        memo.assign(obstacleGrid.size(), vector<int>(obstacleGrid[0].size(), -1));
        return paths(obstacleGrid, obstacleGrid.size() - 1, obstacleGrid[0].size() - 1);
    }
};
