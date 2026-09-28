class Solution {
    private int[][] memo;

    public int uniquePaths(int m, int n) {
        memo = new int[m][n];
        return paths(m - 1, n - 1);
    }

    private int paths(int r, int c) {
        if (r == 0 || c == 0) return 1;
        if (memo[r][c] != 0) return memo[r][c];             // solved before
        return memo[r][c] = paths(r - 1, c) + paths(r, c - 1);
    }
}
