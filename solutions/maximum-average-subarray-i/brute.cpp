class Solution {
public:
    double findMaxAverage(vector<int>& nums, int k) {
        long long best = LLONG_MIN;
        for (size_t i = 0; i + k <= nums.size(); i++) {
            long long s = 0;
            for (size_t j = i; j < i + k; j++) s += nums[j];
            best = max(best, s);
        }
        return (double)best / k;
    }
};
