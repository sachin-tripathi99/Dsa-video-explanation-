class Solution {
    int best(vector<int>& a, int lo, int i, vector<int>& memo) {
        if (i < lo) return 0;
        if (memo[i] >= 0) return memo[i];                   // solved before
        return memo[i] = max(best(a, lo, i - 1, memo), best(a, lo, i - 2, memo) + a[i]);
    }
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        vector<int> m1(n, -1), m2(n, -1);
        return max(best(nums, 0, n - 2, m1), best(nums, 1, n - 1, m2));
    }
};
