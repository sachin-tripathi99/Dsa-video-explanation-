class Solution {
    vector<array<int, 2>> memo;
    vector<array<bool, 2>> seen;
    int best(vector<int>& p, int day, int holding) {
        if (day >= (int)p.size()) return 0;
        if (seen[day][holding]) return memo[day][holding];  // solved before
        seen[day][holding] = true;
        int wait = best(p, day + 1, holding);
        int act = holding ? p[day] + best(p, day + 2, 0) : -p[day] + best(p, day + 1, 1);
        return memo[day][holding] = max(wait, act);
    }
public:
    int maxProfit(vector<int>& prices) {
        memo.assign(prices.size(), {0, 0});
        seen.assign(prices.size(), {false, false});
        return best(prices, 0, 0);
    }
};
