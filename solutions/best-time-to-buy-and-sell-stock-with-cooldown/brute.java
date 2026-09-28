class Solution {
    public int maxProfit(int[] prices) {
        return best(prices, 0, false);
    }

    private int best(int[] p, int day, boolean holding) {
        if (day >= p.length) return 0;
        int wait = best(p, day + 1, holding);
        int act = holding ? p[day] + best(p, day + 2, false)     // sell, then skip a day
                          : -p[day] + best(p, day + 1, true);     // buy
        return Math.max(wait, act);
    }
}
