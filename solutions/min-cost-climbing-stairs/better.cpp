class Solution {
    vector<int> memo;
    int best(vector<int>& cost, int i) {
        if (i <= 1) return 0;
        if (memo[i] >= 0) return memo[i];                   // solved before
        return memo[i] = min(best(cost, i - 1) + cost[i - 1], best(cost, i - 2) + cost[i - 2]);
    }
public:
    int minCostClimbingStairs(vector<int>& cost) {
        memo.assign(cost.size() + 1, -1);
        return best(cost, cost.size());
    }
};
