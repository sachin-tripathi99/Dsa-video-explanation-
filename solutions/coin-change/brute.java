class Solution {
    public int coinChange(int[] coins, int amount) {
        int r = fewest(coins, amount);
        return r == Integer.MAX_VALUE ? -1 : r;
    }

    private int fewest(int[] coins, int a) {
        if (a == 0) return 0;
        int best = Integer.MAX_VALUE;
        for (int c : coins) {                               // try each coin as the last one
            if (c > a) continue;
            int sub = fewest(coins, a - c);
            if (sub != Integer.MAX_VALUE) best = Math.min(best, sub + 1);
        }
        return best;
    }
}
