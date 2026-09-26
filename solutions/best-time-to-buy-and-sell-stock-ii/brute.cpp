class Solution {
    int best(vector<int>& p, int day, bool holding) {
        if (day == (int)p.size()) return 0;
        int skip = best(p, day + 1, holding);
        int trade = holding ? p[day] + best(p, day + 1, false)     // sell
                            : -p[day] + best(p, day + 1, true);    // buy
        return max(skip, trade);
    }
public:
    int maxProfit(vector<int>& prices) {
        return best(prices, 0, false);
    }
};
