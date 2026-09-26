class Solution {
    public void moveZeroes(int[] nums) {
        int[] tmp = new int[nums.length];
        int k = 0;
        for (int x : nums) if (x != 0) tmp[k++] = x;   // the rest stays 0
        System.arraycopy(tmp, 0, nums, 0, nums.length);
    }
}
