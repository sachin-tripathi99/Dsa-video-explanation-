class Solution {
public:
    double findMaxAverage(vector<int>& nums, int k) {
        long long s = 0;
        for (int i = 0; i < k; i++) s += nums[i];
        long long best = s;
        for (size_t r = k; r < nums.size(); r++) {
            s += nums[r] - nums[r - k];          // one in, one out
            best = max(best, s);
        }
        return (double)best / k;
    }
};
