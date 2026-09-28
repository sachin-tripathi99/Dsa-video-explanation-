class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int hold = -prices[0], sold = 0, rest = 0;
        for (int i = 1; i < (int)prices.size(); i++) {
            int h = hold, s = sold, r = rest, p = prices[i];
            hold = max(h, r - p);                           // keep, or buy from REST
            sold = h + p;                                   // sell today
            rest = max(r, s);                               // stay, or finish the cooldown
        }
        return max(sold, rest);
    }
};
