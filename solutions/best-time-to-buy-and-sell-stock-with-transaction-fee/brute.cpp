class Solution {
    int best(vector<int>& p, int fee, int day, bool holding) {
        if (day == (int)p.size()) return 0;
        int wait = best(p, fee, day + 1, holding);
        int act = holding ? p[day] - fee + best(p, fee, day + 1, false)   // sell, pay the fee
                          : -p[day] + best(p, fee, day + 1, true);         // buy
        return max(wait, act);
    }
public:
    int maxProfit(vector<int>& prices, int fee) {
        return best(prices, fee, 0, false);
    }
};
