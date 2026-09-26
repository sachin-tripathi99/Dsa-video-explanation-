class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size(), best = INT_MAX;
        vector<long long> P(n + 1, 0);
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];
        for (int i = 0; i < n; i++) {
            auto it = lower_bound(P.begin() + i + 1, P.end(), P[i] + target);   // first j with P[j] >= P[i] + target
            if (it != P.end()) best = min(best, (int)(it - P.begin()) - i);
        }
        return best == INT_MAX ? 0 : best;
    }
};
