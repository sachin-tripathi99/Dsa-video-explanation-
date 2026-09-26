class Solution {
    private final PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());   // smaller half
    private final PriorityQueue<Integer> hi = new PriorityQueue<>();                            // bigger half
    private final Map<Integer, Integer> delayed = new HashMap<>();                             // lazy deletions
    private int loSize, hiSize;                                                                // live counts

    public double[] medianSlidingWindow(int[] nums, int k) {
        double[] out = new double[nums.length - k + 1];
        for (int i = 0; i < k; i++) insert(nums[i]);
        out[0] = median(k);
        for (int i = k; i < nums.length; i++) {
            insert(nums[i]);
            erase(nums[i - k]);
            out[i - k + 1] = median(k);
        }
        return out;
    }

    private double median(int k) {
        return k % 2 == 1 ? lo.peek() : ((double) lo.peek() + hi.peek()) / 2;
    }

    private void prune(PriorityQueue<Integer> h) {
        while (!h.isEmpty() && delayed.getOrDefault(h.peek(), 0) > 0) {
            delayed.merge(h.peek(), -1, Integer::sum);
            h.poll();
        }
    }

    private void balance() {
        if (loSize > hiSize + 1) { hi.offer(lo.poll()); loSize--; hiSize++; prune(lo); }
        else if (loSize < hiSize) { lo.offer(hi.poll()); hiSize--; loSize++; prune(hi); }
    }

    private void insert(int x) {
        if (lo.isEmpty() || x <= lo.peek()) { lo.offer(x); loSize++; }
        else { hi.offer(x); hiSize++; }
        balance();
    }

    private void erase(int x) {
        delayed.merge(x, 1, Integer::sum);
        if (x <= lo.peek()) { loSize--; if (x == lo.peek()) prune(lo); }
        else { hiSize--; if (x == hi.peek()) prune(hi); }
        balance();
    }
}
