class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] out = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();            // indices, values decreasing
        for (int i = 0; i < n; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();          // too old
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast(); // useless
            dq.offerLast(i);
            if (i >= k - 1) out[i - k + 1] = nums[dq.peekFirst()];
        }
        return out;
    }
}
