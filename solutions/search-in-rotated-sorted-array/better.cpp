class Solution {
public:
    int search(vector<int>& nums, int target) {
        int n = nums.size(), lo = 0, hi = n - 1;
        while (lo < hi) {                               // index of the minimum
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid;
        }
        int k = lo;
        auto first = nums.begin(), last = nums.begin() + k;
        if (target >= nums[k] && target <= nums[n - 1]) { first = nums.begin() + k; last = nums.end(); }
        auto it = lower_bound(first, last, target);
        return (it != last && *it == target) ? (int)(it - nums.begin()) : -1;
    }
};
