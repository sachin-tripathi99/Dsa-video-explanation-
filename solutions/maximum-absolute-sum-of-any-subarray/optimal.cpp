class Solution {
public:
    int maxAbsoluteSum(vector<int>& nums) {
        int hi = 0, lo = 0, bestHi = 0, bestLo = 0;
        for (int x : nums) {
            hi = max(x, hi + x);                  // Kadane for the maximum
            lo = min(x, lo + x);                  // Kadane for the minimum
            bestHi = max(bestHi, hi);
            bestLo = min(bestLo, lo);
        }
        return max(bestHi, -bestLo);
    }
};
