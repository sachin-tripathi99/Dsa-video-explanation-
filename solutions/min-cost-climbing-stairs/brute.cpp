class Solution {
    int best(vector<int>& cost, int i) {                    // cheapest way to stand on step i
        if (i <= 1) return 0;
        return min(best(cost, i - 1) + cost[i - 1], best(cost, i - 2) + cost[i - 2]);
    }
public:
    int minCostClimbingStairs(vector<int>& cost) {
        return best(cost, cost.size());
    }
};
