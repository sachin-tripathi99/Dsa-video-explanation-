class Solution {
    public int[] smallestRange(List<List<Integer>> nums) {
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));   // (value, list, index)
        int mx = Integer.MIN_VALUE;
        for (int i = 0; i < nums.size(); i++) {
            heap.offer(new int[]{nums.get(i).get(0), i, 0});
            mx = Math.max(mx, nums.get(i).get(0));
        }
        int[] best = null;
        while (true) {
            int[] t = heap.poll();                                // current minimum pick
            if (best == null || (long) mx - t[0] < (long) best[1] - best[0]) best = new int[]{t[0], mx};
            if (t[2] + 1 == nums.get(t[1]).size()) return best;   // that list is exhausted
            int nx = nums.get(t[1]).get(t[2] + 1);
            heap.offer(new int[]{nx, t[1], t[2] + 1});
            mx = Math.max(mx, nx);
        }
    }
}
