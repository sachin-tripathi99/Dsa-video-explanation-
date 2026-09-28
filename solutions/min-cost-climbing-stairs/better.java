class Solution {
    private int[] memo;

    public int minCostClimbingStairs(int[] cost) {
        memo = new int[cost.length + 1];
        Arrays.fill(memo, -1);
        return best(cost, cost.length);
    }

    private int best(int[] cost, int i) {
        if (i <= 1) return 0;
        if (memo[i] >= 0) return memo[i];                   // solved before
        return memo[i] = Math.min(best(cost, i - 1) + cost[i - 1], best(cost, i - 2) + cost[i - 2]);
    }
}
