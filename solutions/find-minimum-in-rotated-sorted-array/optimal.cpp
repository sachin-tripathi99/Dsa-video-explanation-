class Solution {
public:
    int findMin(vector<int>& nums) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;   // the drop is right of mid
            else hi = mid;                            // mid..hi sorted: min at mid or left
        }
        return nums[lo];
    }
};
