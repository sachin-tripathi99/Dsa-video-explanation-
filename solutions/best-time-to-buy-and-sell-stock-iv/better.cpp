class Solution {
    vector<vector<array<int, 2>>> memo;
    int best(vector<int>& p, int day, int left, int holding) {
        if (day == (int)p.size() || left == 0) return 0;
        int& m = memo[day][left][holding];
        if (m != INT_MIN) return m;                         // solved before
        int wait = best(p, day + 1, left, holding);
        int act = holding ? p[day] + best(p, day + 1, left - 1, 0) : -p[day] + best(p, day + 1, left, 1);
        return m = max(wait, act);
    }
public:
    int maxProfit(int k, vector<int>& prices) {
        memo.assign(prices.size(), vector<array<int, 2>>(k + 1, {INT_MIN, INT_MIN}));
        return best(prices, 0, k, 0);
    }
};
