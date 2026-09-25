class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();    // min-heap of the k largest
        for (int x : nums) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();                   // drop the smallest
        }
        return heap.peek();
    }
}
