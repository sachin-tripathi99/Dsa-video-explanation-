class Solution {
    int line(vector<int>& a, int lo, int hi) {              // House Robber on a[lo..hi]
        int prev2 = 0, prev1 = 0;
        for (int i = lo; i <= hi; i++) {
            int cur = max(prev1, prev2 + a[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        return max(line(nums, 0, n - 2), line(nums, 1, n - 1));   // drop last / drop first
    }
};
