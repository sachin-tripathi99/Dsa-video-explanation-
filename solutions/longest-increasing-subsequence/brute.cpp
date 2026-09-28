class Solution {
    int best(vector<int>& a, int i, long long prev) {
        if (i == (int)a.size()) return 0;
        int res = best(a, i + 1, prev);                     // skip a[i]
        if (a[i] > prev) res = max(res, 1 + best(a, i + 1, a[i]));   // take a[i]
        return res;
    }
public:
    int lengthOfLIS(vector<int>& nums) {
        return best(nums, 0, LLONG_MIN);
    }
};
