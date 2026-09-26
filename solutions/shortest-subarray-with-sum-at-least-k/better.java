class Solution {
    public int shortestSubarray(int[] nums, int k) {
        int n = nums.length, best = Integer.MAX_VALUE;
        PriorityQueue<long[]> pq = new PriorityQueue<>((x, y) -> Long.compare(x[0], y[0]));   // (prefix, index)
        long P = 0;
        pq.offer(new long[]{0, 0});
        for (int j = 1; j <= n; j++) {
            P += nums[j - 1];
            while (!pq.isEmpty() && P - pq.peek()[0] >= k) best = Math.min(best, j - (int) pq.poll()[1]);
            pq.offer(new long[]{P, j});
        }
        return best == Integer.MAX_VALUE ? -1 : best;
    }
}
