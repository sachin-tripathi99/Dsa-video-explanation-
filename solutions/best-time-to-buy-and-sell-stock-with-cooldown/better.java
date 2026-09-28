class Solution {
    private Integer[][] memo;

    public int maxProfit(int[] prices) {
        memo = new Integer[prices.length][2];
        return best(prices, 0, 0);
    }

    private int best(int[] p, int day, int holding) {
        if (day >= p.length) return 0;
        if (memo[day][holding] != null) return memo[day][holding];   // solved before
        int wait = best(p, day + 1, holding);
        int act = holding == 1 ? p[day] + best(p, day + 2, 0) : -p[day] + best(p, day + 1, 1);
        return memo[day][holding] = Math.max(wait, act);
    }
}
