class Solution {
    vector<int> memo;
    int count(vector<int>& nums, int t) {
        if (t == 0) return 1;
        if (memo[t] >= 0) return memo[t];                   // solved before
        unsigned ways = 0;
        for (int x : nums) if (x <= t) ways += count(nums, t - x);
        return memo[t] = ways;
    }
public:
    int combinationSum4(vector<int>& nums, int target) {
        memo.assign(target + 1, -1);
        return count(nums, target);
    }
};
