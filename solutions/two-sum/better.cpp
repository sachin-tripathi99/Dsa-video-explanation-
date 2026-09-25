class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int n = nums.size();
        vector<int> idx(n);
        iota(idx.begin(), idx.end(), 0);
        sort(idx.begin(), idx.end(), [&](int a, int b) { return nums[a] < nums[b]; });  // sort indices by value
        int l = 0, r = n - 1;
        while (l < r) {
            long long s = (long long) nums[idx[l]] + nums[idx[r]];
            if (s == target) return {idx[l], idx[r]};
            if (s < target) l++;
            else r--;
        }
        return {};
    }
};
