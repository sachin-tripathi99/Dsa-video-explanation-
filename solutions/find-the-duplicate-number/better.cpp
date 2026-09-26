class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int lo = 1, hi = nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int count = 0;
            for (int x : nums) if (x <= mid) count++;
            if (count > mid) hi = mid;            // too many values ≤ mid: duplicate is ≤ mid
            else lo = mid + 1;
        }
        return lo;
    }
};
