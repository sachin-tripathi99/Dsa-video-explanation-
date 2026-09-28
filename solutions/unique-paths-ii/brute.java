class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        return paths(obstacleGrid, obstacleGrid.length - 1, obstacleGrid[0].length - 1);
    }

    private int paths(int[][] g, int r, int c) {
        if (r < 0 || c < 0 || g[r][c] == 1) return 0;       // off-grid or rock
        if (r == 0 && c == 0) return 1;
        return paths(g, r - 1, c) + paths(g, r, c - 1);
    }
}
