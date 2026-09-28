class Solution {
    private int[] memo;

    public int coinChange(int[] coins, int amount) {
        memo = new int[amount + 1];
        Arrays.fill(memo, -2);                              // −2 = not computed
        int r = fewest(coins, amount);
        return r == Integer.MAX_VALUE ? -1 : r;
    }

    private int fewest(int[] coins, int a) {
        if (a == 0) return 0;
        if (memo[a] != -2) return memo[a];
        int best = Integer.MAX_VALUE;
        for (int c : coins) {
            if (c > a) continue;
            int sub = fewest(coins, a - c);
            if (sub != Integer.MAX_VALUE) best = Math.min(best, sub + 1);
        }
        return memo[a] = best;
    }
}
