class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        int[] out = new int[n];
        for (int i = 0; i < n; i++) out[(i + k) % n] = nums[i];   // final position of nums[i]
        System.arraycopy(out, 0, nums, 0, n);
    }
}
