class Solution {
    private int[] memo;

    public int numSquares(int n) {
        memo = new int[n + 1];
        return fewest(n);
    }

    private int fewest(int n) {
        if (n == 0) return 0;
        if (memo[n] != 0) return memo[n];                   // solved before
        int best = Integer.MAX_VALUE;
        for (int s = 1; s * s <= n; s++) best = Math.min(best, 1 + fewest(n - s * s));
        return memo[n] = best;
    }
}
