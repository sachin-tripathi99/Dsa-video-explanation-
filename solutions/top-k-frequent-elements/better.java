class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) cnt.merge(x, 1, Integer::sum);
        PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> cnt.get(a) - cnt.get(b));   // least frequent on top
        for (int key : cnt.keySet()) {
            heap.offer(key);
            if (heap.size() > k) heap.poll();
        }
        int[] out = new int[k];
        for (int i = 0; i < k; i++) out[i] = heap.poll();
        return out;
    }
}
