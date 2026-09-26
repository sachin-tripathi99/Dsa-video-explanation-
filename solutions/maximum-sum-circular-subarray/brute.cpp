class Solution {
public:
    int maxSubarraySumCircular(vector<int>& nums) {
        int n = nums.size(), best = INT_MIN;
        for (int start = 0; start < n; start++) {
            int s = 0;
            for (int len = 1; len <= n; len++) {
                s += nums[(start + len - 1) % n];
                best = max(best, s);
            }
        }
        return best;
    }
};
