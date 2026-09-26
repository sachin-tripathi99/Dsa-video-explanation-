class Solution {
public:
    int maxSubarraySumCircular(vector<int>& nums) {
        int hi = nums[0], lo = nums[0], bestHi = nums[0], bestLo = nums[0], total = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            int x = nums[i];
            hi = max(x, hi + x);
            bestHi = max(bestHi, hi);
            lo = min(x, lo + x);
            bestLo = min(bestLo, lo);
            total += x;
        }
        if (bestHi < 0) return bestHi;                  // all negative: wrapping would mean empty
        return max(bestHi, total - bestLo);
    }
};
