class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(nums1[a[0]] + nums2[a[1]], nums1[b[0]] + nums2[b[1]]));   // (i, j)
        for (int i = 0; i < Math.min(k, nums1.length); i++) heap.offer(new int[]{i, 0});   // first column
        List<List<Integer>> out = new ArrayList<>();
        while (out.size() < k && !heap.isEmpty()) {
            int[] t = heap.poll();
            out.add(List.of(nums1[t[0]], nums2[t[1]]));
            if (t[1] + 1 < nums2.length) heap.offer(new int[]{t[0], t[1] + 1});   // next in row i
        }
        return out;
    }
}
