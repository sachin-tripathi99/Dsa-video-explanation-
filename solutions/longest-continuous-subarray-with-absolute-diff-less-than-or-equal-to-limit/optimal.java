class Solution {
    public int longestSubarray(int[] nums, int limit) {
        Deque<Integer> mx = new ArrayDeque<>(), mn = new ArrayDeque<>();   // indices
        int l = 0, best = 0;
        for (int r = 0; r < nums.length; r++) {
            while (!mx.isEmpty() && nums[mx.peekLast()] <= nums[r]) mx.pollLast();   // decreasing
            mx.offerLast(r);
            while (!mn.isEmpty() && nums[mn.peekLast()] >= nums[r]) mn.pollLast();   // increasing
            mn.offerLast(r);
            while (nums[mx.peekFirst()] - nums[mn.peekFirst()] > limit) {
                l++;
                if (mx.peekFirst() < l) mx.pollFirst();
                if (mn.peekFirst() < l) mn.pollFirst();
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
