class Solution {
    public int findMin(int[] nums) {
        int m = nums[0];
        for (int x : nums) m = Math.min(m, x);
        return m;
    }
}
