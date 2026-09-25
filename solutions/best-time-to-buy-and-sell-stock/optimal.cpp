class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX, best = 0;
        for (int p : prices) {
            minPrice = min(minPrice, p);         // cheapest day to have bought
            best = max(best, p - minPrice);      // sell today
        }
        return best;
    }
};
