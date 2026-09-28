class Solution {
    public int maxProfit(int[] prices) {
        int hold = -prices[0], sold = 0, rest = 0;
        for (int i = 1; i < prices.length; i++) {
            int h = hold, s = sold, r = rest, p = prices[i];
            hold = Math.max(h, r - p);                      // keep, or buy from REST
            sold = h + p;                                   // sell today
            rest = Math.max(r, s);                          // stay, or finish the cooldown
        }
        return Math.max(sold, rest);
    }
}
