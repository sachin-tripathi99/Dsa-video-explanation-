class Solution {
    int fewest(vector<int>& coins, int a) {
        if (a == 0) return 0;
        int best = INT_MAX;
        for (int c : coins) {                               // try each coin as the last one
            if (c > a) continue;
            int sub = fewest(coins, a - c);
            if (sub != INT_MAX) best = min(best, sub + 1);
        }
        return best;
    }
public:
    int coinChange(vector<int>& coins, int amount) {
        int r = fewest(coins, amount);
        return r == INT_MAX ? -1 : r;
    }
};
