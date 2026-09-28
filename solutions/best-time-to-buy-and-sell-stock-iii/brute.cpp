class Solution {
    int single(vector<int>& p, int lo, int hi) {            // best single trade in p[lo..hi]
        int low = INT_MAX, best = 0;
        for (int i = lo; i <= hi; i++) { low = min(low, p[i]); best = max(best, p[i] - low); }
        return best;
    }
public:
    int maxProfit(vector<int>& prices) {
        int n = prices.size(), best = 0;
        for (int k = 0; k < n; k++) best = max(best, single(prices, 0, k) + single(prices, k, n - 1));   // split day
        return best;
    }
};
