class Solution {
    public int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());   // max-heap
        for (int s : stones) heap.offer(s);
        while (heap.size() > 1) {
            int y = heap.poll(), x = heap.poll();
            if (y != x) heap.offer(y - x);
        }
        return heap.isEmpty() ? 0 : heap.peek();
    }
}
