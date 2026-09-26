class Solution {
    public void moveZeroes(int[] nums) {
        int w = 0;
        for (int r = 0; r < nums.length; r++)
            if (nums[r] != 0) {
                int t = nums[w]; nums[w] = nums[r]; nums[r] = t;
                w++;
            }
    }
}
