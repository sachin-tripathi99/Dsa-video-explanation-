class Solution {
public:
    int jump(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n, INT_MAX);
        dp[0] = 0;
        for (int i = 0; i < n; i++)
            for (int s = 1; s <= nums[i] && i + s < n; s++)
                dp[i + s] = min(dp[i + s], dp[i] + 1);
        return dp[n - 1];
    }
};
