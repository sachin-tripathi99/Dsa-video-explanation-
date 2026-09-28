class Solution {
    public int maxProfit(int[] prices, int fee) {
        int hold = -prices[0], cash = 0;
        for (int i = 1; i < prices.length; i++) {
            int h = hold;
            hold = Math.max(hold, cash - prices[i]);        // keep, or buy
            cash = Math.max(cash, h + prices[i] - fee);     // keep, or sell and pay the fee
        }
        return cash;
    }
}
