class Solution {
    public int minPathSum(int[][] grid) {
        int n = grid[0].length;
        int[] row = new int[n];
        Arrays.fill(row, Integer.MAX_VALUE);
        row[0] = 0;
        for (int[] g : grid)
            for (int c = 0; c < n; c++)
                row[c] = g[c] + (c > 0 ? Math.min(row[c], row[c - 1]) : row[c]);   // min(up, left)
        return row[n - 1];
    }
}
