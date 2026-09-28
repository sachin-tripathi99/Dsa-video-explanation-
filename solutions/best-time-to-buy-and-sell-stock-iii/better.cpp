class Solution {
    vector<vector<array<int, 2>>> memo;
    int best(vector<int>& p, int day, int left, int holding) {
        if (day == (int)p.size() || left == 0) return 0;
        int& m = memo[day][left][holding];
        if (m != INT_MIN) return m;
        int wait = best(p, day + 1, left, holding);
        int act = holding ? p[day] + best(p, day + 1, left - 1, 0)   // sell ends a trade
                          : -p[day] + best(p, day + 1, left, 1);      // buy
        return m = max(wait, act);
    }
public:
    int maxProfit(vector<int>& prices) {
        memo.assign(prices.size(), vector<array<int, 2>>(3, {INT_MIN, INT_MIN}));
        return best(prices, 0, 2, 0);
    }
};
