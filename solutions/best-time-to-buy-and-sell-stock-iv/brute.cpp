class Solution {
    int best(vector<int>& p, int day, int left, bool holding) {
        if (day == (int)p.size() || left == 0) return 0;
        int wait = best(p, day + 1, left, holding);
        int act = holding ? p[day] + best(p, day + 1, left - 1, false)   // sell ends a trade
                          : -p[day] + best(p, day + 1, left, true);      // buy
        return max(wait, act);
    }
public:
    int maxProfit(int k, vector<int>& prices) {
        return best(prices, 0, k, false);
    }
};
