class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length, best = 0;
        for (int k = 0; k < n; k++)                         // split day
            best = Math.max(best, single(prices, 0, k) + single(prices, k, n - 1));
        return best;
    }

    private int single(int[] p, int lo, int hi) {           // best single trade in p[lo..hi]
        int low = Integer.MAX_VALUE, best = 0;
        for (int i = lo; i <= hi; i++) { low = Math.min(low, p[i]); best = Math.max(best, p[i] - low); }
        return best;
    }
}
