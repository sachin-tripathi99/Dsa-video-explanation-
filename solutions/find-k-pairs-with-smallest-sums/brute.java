class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        List<List<Integer>> all = new ArrayList<>();
        for (int x : nums1) for (int y : nums2) all.add(List.of(x, y));
        all.sort((p, q) -> Integer.compare(p.get(0) + p.get(1), q.get(0) + q.get(1)));
        return new ArrayList<>(all.subList(0, k));
    }
}
