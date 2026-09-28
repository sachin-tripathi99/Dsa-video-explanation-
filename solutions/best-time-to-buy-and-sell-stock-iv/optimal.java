class Solution {
    public int maxProfit(int k, int[] prices) {
        int n = prices.length;
        if (2 * k >= n) {                                   // limit never binds
            int sum = 0;
            for (int i = 1; i < n; i++) sum += Math.max(0, prices[i] - prices[i - 1]);
            return sum;
        }
        int[] buy = new int[k], sell = new int[k];
        Arrays.fill(buy, -prices[0]);
        for (int p : prices)
            for (int j = 0; j < k; j++) {
                buy[j] = Math.max(buy[j], (j == 0 ? 0 : sell[j - 1]) - p);   // buy j from sell j−1
                sell[j] = Math.max(sell[j], buy[j] + p);
            }
        return sell[k - 1];
    }
}
