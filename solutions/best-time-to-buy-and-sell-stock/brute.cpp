class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int best = 0;
        for (size_t i = 0; i < prices.size(); i++)
            for (size_t j = i + 1; j < prices.size(); j++)
                best = max(best, prices[j] - prices[i]);
        return best;
    }
};
