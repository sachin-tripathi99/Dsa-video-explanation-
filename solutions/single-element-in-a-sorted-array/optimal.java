class Solution {
    public int singleNonDuplicate(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (mid % 2 == 1) mid--;                     // mid = first slot of a pair
            if (nums[mid] == nums[mid + 1]) lo = mid + 2; // still aligned: single is right
            else hi = mid;                               // alignment broken: single at mid or left
        }
        return nums[lo];
    }
}
