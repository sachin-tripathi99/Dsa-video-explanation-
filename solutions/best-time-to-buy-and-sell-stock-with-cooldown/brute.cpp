class Solution {
    int best(vector<int>& p, int day, bool holding) {
        if (day >= (int)p.size()) return 0;
        int wait = best(p, day + 1, holding);
        int act = holding ? p[day] + best(p, day + 2, false)     // sell, then skip a day
                          : -p[day] + best(p, day + 1, true);     // buy
        return max(wait, act);
    }
public:
    int maxProfit(vector<int>& prices) {
        return best(prices, 0, false);
    }
};
