class Solution {
    public List<String> topKFrequent(String[] words, int k) {
        Map<String, Integer> cnt = new HashMap<>();
        for (String w : words) cnt.merge(w, 1, Integer::sum);
        // top = worst candidate: lower count, or same count and later alphabetically
        PriorityQueue<String> heap = new PriorityQueue<>((a, b) -> !cnt.get(a).equals(cnt.get(b)) ? cnt.get(a) - cnt.get(b) : b.compareTo(a));
        for (String w : cnt.keySet()) {
            heap.offer(w);
            if (heap.size() > k) heap.poll();
        }
        LinkedList<String> out = new LinkedList<>();
        while (!heap.isEmpty()) out.addFirst(heap.poll());   // worst → best, so prepend
        return out;
    }
}
