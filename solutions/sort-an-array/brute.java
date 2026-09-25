class Solution {
    public int[] sortArray(int[] nums) {
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i], j = i - 1;
            while (j >= 0 && nums[j] > x) { nums[j + 1] = nums[j]; j--; }  // shift bigger right
            nums[j + 1] = x;
        }
        return nums;
    }
}
