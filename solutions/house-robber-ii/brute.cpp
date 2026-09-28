class Solution {
    int best(vector<int>& a, int lo, int i) {               // most from houses lo..i
        if (i < lo) return 0;
        return max(best(a, lo, i - 1), best(a, lo, i - 2) + a[i]);
    }
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        return max(best(nums, 0, n - 2), best(nums, 1, n - 1));   // drop last / drop first
    }
};
