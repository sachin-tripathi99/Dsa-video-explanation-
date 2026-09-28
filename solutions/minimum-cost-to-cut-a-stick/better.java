class Solution {
    private int[][] memo;

    public int minCost(int n, int[] cuts) {
        int[] c = new int[cuts.length + 2];
        for (int i = 0; i < cuts.length; i++) c[i + 1] = cuts[i];
        c[c.length - 1] = n;
        Arrays.sort(c);
        memo = new int[c.length][c.length];
        for (int[] row : memo) Arrays.fill(row, -1);
        return best(c, 0, c.length - 1);
    }

    private int best(int[] c, int i, int j) {
        if (j - i < 2) return 0;
        if (memo[i][j] >= 0) return memo[i][j];             // solved before
        int res = Integer.MAX_VALUE;
        for (int k = i + 1; k < j; k++) res = Math.min(res, best(c, i, k) + best(c, k, j));
        return memo[i][j] = res + c[j] - c[i];
    }
}
