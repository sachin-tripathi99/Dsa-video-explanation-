class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] out = new int[n - k + 1];
        PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> y[0] - x[0]);   // (value, index), max first
        for (int i = 0; i < n; i++) {
            pq.offer(new int[]{nums[i], i});
            if (i >= k - 1) {
                while (pq.peek()[1] <= i - k) pq.poll();          // lazily drop expired tops
                out[i - k + 1] = pq.peek()[0];
            }
        }
        return out;
    }
}
