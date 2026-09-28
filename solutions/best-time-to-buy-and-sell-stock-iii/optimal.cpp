class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int buy1 = -prices[0], sell1 = 0, buy2 = -prices[0], sell2 = 0;
        for (int p : prices) {
            buy1 = max(buy1, -p);                           // first buy
            sell1 = max(sell1, buy1 + p);                   // first sell
            buy2 = max(buy2, sell1 - p);                    // second buy uses the first profit
            sell2 = max(sell2, buy2 + p);                   // second sell
        }
        return sell2;
    }
};
