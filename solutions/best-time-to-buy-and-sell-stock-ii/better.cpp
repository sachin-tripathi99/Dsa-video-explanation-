class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int n = prices.size(), i = 0, profit = 0;
        while (i < n - 1) {
            while (i < n - 1 && prices[i + 1] <= prices[i]) i++;   // down to a valley
            int valley = prices[i];
            while (i < n - 1 && prices[i + 1] > prices[i]) i++;    // up to a peak
            profit += prices[i] - valley;
        }
        return profit;
    }
};
