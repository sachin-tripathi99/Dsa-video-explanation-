class Solution {
    int best(vector<int>& a, int l, int r) {
        if (l == r) return a[l];
        int m = (l + r) / 2;
        int leftSuffix = INT_MIN, s = 0;
        for (int i = m; i >= l; i--) { s += a[i]; leftSuffix = max(leftSuffix, s); }
        int rightPrefix = INT_MIN;
        s = 0;
        for (int i = m + 1; i <= r; i++) { s += a[i]; rightPrefix = max(rightPrefix, s); }
        return max(leftSuffix + rightPrefix, max(best(a, l, m), best(a, m + 1, r)));
    }
public:
    int maxSubArray(vector<int>& nums) {
        return best(nums, 0, (int)nums.size() - 1);
    }
};
