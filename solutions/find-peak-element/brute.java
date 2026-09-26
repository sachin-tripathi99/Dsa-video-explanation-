class Solution {
    public int findPeakElement(int[] nums) {
        for (int i = 0; i + 1 < nums.length; i++) if (nums[i] > nums[i + 1]) return i;
        return nums.length - 1;
    }
}
