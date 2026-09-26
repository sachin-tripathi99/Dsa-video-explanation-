class Solution {
    public double[] medianSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        double[] out = new double[n - k + 1];
        for (int i = 0; i + k <= n; i++) {
            int[] w = Arrays.copyOfRange(nums, i, i + k);
            Arrays.sort(w);
            out[i] = k % 2 == 1 ? w[k / 2] : ((double) w[k / 2 - 1] + w[k / 2]) / 2;
        }
        return out;
    }
}
