class Solution {
public:
    bool canPartitionKSubsets(vector<int>& nums, int k) {
        int sum = accumulate(nums.begin(), nums.end(), 0), n = nums.size();
        if (sum % k) return false;
        int target = sum / k;
        vector<int> dp(1 << n, -1);                         // fill of the current group, −1 = impossible
        dp[0] = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask] < 0) continue;
            for (int i = 0; i < n; i++) {
                int nm = mask | (1 << i);
                if (nm == mask || dp[nm] >= 0 || dp[mask] + nums[i] > target) continue;
                dp[nm] = (dp[mask] + nums[i]) % target;     // a full group resets to 0
            }
        }
        return dp[(1 << n) - 1] == 0;
    }
};
