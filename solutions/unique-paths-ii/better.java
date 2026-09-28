class Solution {
    private int[][] memo;

    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.length, n = obstacleGrid[0].length;
        memo = new int[m][n];
        for (int[] row : memo) Arrays.fill(row, -1);
        return paths(obstacleGrid, m - 1, n - 1);
    }

    private int paths(int[][] g, int r, int c) {
        if (r < 0 || c < 0 || g[r][c] == 1) return 0;
        if (r == 0 && c == 0) return 1;
        if (memo[r][c] >= 0) return memo[r][c];             // solved before
        return memo[r][c] = paths(g, r - 1, c) + paths(g, r, c - 1);
    }
}
