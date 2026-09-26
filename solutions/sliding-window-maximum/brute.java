class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] out = new int[n - k + 1];
        for (int s = 0; s + k <= n; s++) {
            int m = nums[s];
            for (int j = s + 1; j < s + k; j++) m = Math.max(m, nums[j]);
            out[s] = m;
        }
        return out;
    }
}
