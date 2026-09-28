class Solution {
    public int maxProfit(int k, int[] prices) {
        return best(prices, 0, k, false);
    }

    private int best(int[] p, int day, int left, boolean holding) {
        if (day == p.length || left == 0) return 0;
        int wait = best(p, day + 1, left, holding);
        int act = holding ? p[day] + best(p, day + 1, left - 1, false)   // sell ends a trade
                          : -p[day] + best(p, day + 1, left, true);      // buy
        return Math.max(wait, act);
    }
}
