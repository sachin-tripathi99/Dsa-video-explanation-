class Solution {
    public int maxProfit(int[] prices, int fee) {
        return best(prices, fee, 0, false);
    }

    private int best(int[] p, int fee, int day, boolean holding) {
        if (day == p.length) return 0;
        int wait = best(p, fee, day + 1, holding);
        int act = holding ? p[day] - fee + best(p, fee, day + 1, false)   // sell, pay the fee
                          : -p[day] + best(p, fee, day + 1, true);         // buy
        return Math.max(wait, act);
    }
}
