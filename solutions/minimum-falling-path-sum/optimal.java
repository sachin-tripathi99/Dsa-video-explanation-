class Solution {
    public int minFallingPathSum(int[][] matrix) {
        int n = matrix.length;
        int[] prev = matrix[0].clone();                     // best falls ending in the row above
        for (int r = 1; r < n; r++) {
            int[] cur = new int[n];
            for (int c = 0; c < n; c++) {
                int best = prev[c];
                if (c > 0) best = Math.min(best, prev[c - 1]);
                if (c < n - 1) best = Math.min(best, prev[c + 1]);
                cur[c] = matrix[r][c] + best;
            }
            prev = cur;
        }
        int ans = Integer.MAX_VALUE;
        for (int x : prev) ans = Math.min(ans, x);
        return ans;
    }
}
