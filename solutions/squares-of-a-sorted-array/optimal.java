class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length, l = 0, r = n - 1;
        int[] out = new int[n];
        for (int k = n - 1; k >= 0; k--) {                  // fill from the back
            if (Math.abs(nums[l]) > Math.abs(nums[r])) { out[k] = nums[l] * nums[l]; l++; }
            else { out[k] = nums[r] * nums[r]; r--; }
        }
        return out;
    }
}
