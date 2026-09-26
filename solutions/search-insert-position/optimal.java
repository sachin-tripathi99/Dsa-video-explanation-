class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length;                 // answer may be n
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] >= target) hi = mid;        // mid could be the answer
            else lo = mid + 1;
        }
        return lo;
    }
}
