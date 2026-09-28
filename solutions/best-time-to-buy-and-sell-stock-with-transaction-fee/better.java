class Solution {
    private Integer[][] memo;

    public int maxProfit(int[] prices, int fee) {
        memo = new Integer[prices.length][2];
        return best(prices, fee, 0, 0);
    }

    private int best(int[] p, int fee, int day, int holding) {
        if (day == p.length) return 0;
        if (memo[day][holding] != null) return memo[day][holding];   // solved before
        int wait = best(p, fee, day + 1, holding);
        int act = holding == 1 ? p[day] - fee + best(p, fee, day + 1, 0) : -p[day] + best(p, fee, day + 1, 1);
        return memo[day][holding] = Math.max(wait, act);
    }
}
