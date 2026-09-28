class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (abs(target) > total || (total + target) % 2) return 0;
        int p = (total + target) / 2;                       // sum of the plus group
        vector<int> dp(p + 1, 0);
        dp[0] = 1;
        for (int x : nums)
            for (int c = p; c >= x; c--) dp[c] += dp[c - x];   // count subsets, x used once
        return dp[p];
    }
};
