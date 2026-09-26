class Solution {
    public int pivotIndex(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            int left = 0, right = 0;
            for (int k = 0; k < i; k++) left += nums[k];
            for (int k = i + 1; k < nums.length; k++) right += nums[k];
            if (left == right) return i;
        }
        return -1;
    }
}
