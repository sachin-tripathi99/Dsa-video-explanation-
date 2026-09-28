class Solution {
public:
    int maxProfit(int k, vector<int>& prices) {
        int n = prices.size();
        if (2 * k >= n) {                                   // limit never binds
            int sum = 0;
            for (int i = 1; i < n; i++) sum += max(0, prices[i] - prices[i - 1]);
            return sum;
        }
        vector<int> buy(k, -prices[0]), sell(k, 0);
        for (int p : prices)
            for (int j = 0; j < k; j++) {
                buy[j] = max(buy[j], (j ? sell[j - 1] : 0) - p);   // buy j from sell j−1
                sell[j] = max(sell[j], buy[j] + p);
            }
        return sell[k - 1];
    }
};
