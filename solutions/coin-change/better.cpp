class Solution {
    vector<int> memo;
    int fewest(vector<int>& coins, int a) {
        if (a == 0) return 0;
        if (memo[a] != -2) return memo[a];                  // −2 = not computed
        int best = INT_MAX;
        for (int c : coins) {
            if (c > a) continue;
            int sub = fewest(coins, a - c);
            if (sub != INT_MAX) best = min(best, sub + 1);
        }
        return memo[a] = best;
    }
public:
    int coinChange(vector<int>& coins, int amount) {
        memo.assign(amount + 1, -2);
        int r = fewest(coins, amount);
        return r == INT_MAX ? -1 : r;
    }
};
