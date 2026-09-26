class Solution {
    public int maxProfit(int[] prices) {
        return best(prices, 0, false);
    }

    private int best(int[] p, int day, boolean holding) {
        if (day == p.length) return 0;
        int skip = best(p, day + 1, holding);
        int trade = holding ? p[day] + best(p, day + 1, false)     // sell
                            : -p[day] + best(p, day + 1, true);    // buy
        return Math.max(skip, trade);
    }
}
