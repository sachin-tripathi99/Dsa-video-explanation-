class Solution {
    public int reversePairs(int[] nums) {
        int count = 0;
        for (int i = 0; i < nums.length; i++)
            for (int j = i + 1; j < nums.length; j++)
                if (nums[i] > 2L * nums[j]) count++;            // long: 2 · nums[j] can overflow
        return count;
    }
}
