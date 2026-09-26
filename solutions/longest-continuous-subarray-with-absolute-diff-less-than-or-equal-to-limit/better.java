class Solution {
    public int longestSubarray(int[] nums, int limit) {
        PriorityQueue<int[]> mx = new PriorityQueue<>((x, y) -> Integer.compare(y[0], x[0]));   // (value, index)
        PriorityQueue<int[]> mn = new PriorityQueue<>((x, y) -> Integer.compare(x[0], y[0]));
        int l = 0, best = 0;
        for (int r = 0; r < nums.length; r++) {
            mx.offer(new int[]{nums[r], r});
            mn.offer(new int[]{nums[r], r});
            while (true) {
                while (mx.peek()[1] < l) mx.poll();            // lazily drop stale tops
                while (mn.peek()[1] < l) mn.poll();
                if (mx.peek()[0] - mn.peek()[0] <= limit) break;
                l++;
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
