class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int n = obstacleGrid[0].length;
        int[] row = new int[n];
        row[0] = 1;                                         // the start (reset below if blocked)
        for (int[] g : obstacleGrid)
            for (int c = 0; c < n; c++) {
                if (g[c] == 1) row[c] = 0;                  // rock: no paths
                else if (c > 0) row[c] += row[c - 1];       // above (old) + left (new)
            }
        return row[n - 1];
    }
}
