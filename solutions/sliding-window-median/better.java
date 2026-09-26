class Solution {
    public double[] medianSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        double[] out = new double[n - k + 1];
        List<Integer> w = new ArrayList<>();
        for (int i = 0; i < k; i++) w.add(nums[i]);
        Collections.sort(w);                                 // window kept sorted
        for (int i = 0; ; i++) {
            out[i] = k % 2 == 1 ? w.get(k / 2) : ((double) w.get(k / 2 - 1) + w.get(k / 2)) / 2;
            if (i + k == n) break;
            w.remove(Collections.binarySearch(w, nums[i]));  // outgoing
            int p = Collections.binarySearch(w, nums[i + k]);
            w.add(p >= 0 ? p : -p - 1, nums[i + k]);          // incoming
        }
        return out;
    }
}
