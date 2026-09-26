class Solution {
    public int removeDuplicates(int[] nums) {
        int w = 1;
        for (int r = 1; r < nums.length; r++)
            if (nums[r] != nums[w - 1]) nums[w++] = nums[r];   // new value: write it
        return w;
    }
}
