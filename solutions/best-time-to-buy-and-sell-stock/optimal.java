class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE, best = 0;
        for (int p : prices) {
            minPrice = Math.min(minPrice, p);    // cheapest day to have bought
            best = Math.max(best, p - minPrice); // sell today
        }
        return best;
    }
}
