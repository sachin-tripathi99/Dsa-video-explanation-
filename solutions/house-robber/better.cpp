class Solution {
    vector<int> memo;
    int best(vector<int>& a, int i) {
        if (i < 0) return 0;
        if (memo[i] >= 0) return memo[i];                   // solved before
        return memo[i] = max(best(a, i - 1), best(a, i - 2) + a[i]);
    }
public:
    int rob(vector<int>& nums) {
        memo.assign(nums.size(), -1);
        return best(nums, nums.size() - 1);
    }
};
