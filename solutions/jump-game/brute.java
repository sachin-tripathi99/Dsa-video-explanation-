class Solution {
    public boolean canJump(int[] nums) {
        return reach(nums, 0);
    }

    private boolean reach(int[] nums, int i) {
        if (i >= nums.length - 1) return true;
        for (int step = 1; step <= nums[i]; step++)
            if (reach(nums, i + step)) return true;
        return false;
    }
}
