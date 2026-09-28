class Solution {
    private Integer[][][] memo;

    public int maxProfit(int k, int[] prices) {
        memo = new Integer[prices.length][k + 1][2];
        return best(prices, 0, k, 0);
    }

    private int best(int[] p, int day, int left, int holding) {
        if (day == p.length || left == 0) return 0;
        if (memo[day][left][holding] != null) return memo[day][left][holding];   // solved before
        int wait = best(p, day + 1, left, holding);
        int act = holding == 1 ? p[day] + best(p, day + 1, left - 1, 0) : -p[day] + best(p, day + 1, left, 1);
        return memo[day][left][holding] = Math.max(wait, act);
    }
}
