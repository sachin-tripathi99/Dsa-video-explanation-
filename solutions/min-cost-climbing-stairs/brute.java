class Solution {
    public int minCostClimbingStairs(int[] cost) {
        return best(cost, cost.length);
    }

    private int best(int[] cost, int i) {                   // cheapest way to stand on step i
        if (i <= 1) return 0;
        return Math.min(best(cost, i - 1) + cost[i - 1], best(cost, i - 2) + cost[i - 2]);
    }
}
