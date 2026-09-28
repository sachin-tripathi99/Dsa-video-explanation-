class Solution {
public:
    int combinationSum4(vector<int>& nums, int target) {
        vector<unsigned> dp(target + 1, 0);                 // unsigned: intermediates may wrap
        dp[0] = 1;                                          // the empty sequence
        for (int s = 1; s <= target; s++)                   // totals outside → orders count
            for (int x : nums) if (x <= s) dp[s] += dp[s - x];
        return dp[target];
    }
};
