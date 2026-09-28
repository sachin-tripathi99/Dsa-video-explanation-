class Solution {
public:
    int maxProfit(vector<int>& prices, int fee) {
        int hold = -prices[0], cash = 0;
        for (int i = 1; i < (int)prices.size(); i++) {
            int h = hold;
            hold = max(hold, cash - prices[i]);             // keep, or buy
            cash = max(cash, h + prices[i] - fee);          // keep, or sell and pay the fee
        }
        return cash;
    }
};
