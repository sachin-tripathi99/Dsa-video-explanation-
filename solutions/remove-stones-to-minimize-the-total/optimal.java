class Solution {
    public int minStoneSum(int[] piles, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
        int total = 0;
        for (int p : piles) { heap.offer(p); total += p; }
        while (k-- > 0) {
            int x = heap.poll();
            total -= x / 2;
            heap.offer(x - x / 2);
        }
        return total;
    }
}
