class KthLargest {
    private final int k;
    private final List<Integer> all = new ArrayList<>();

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int x : nums) all.add(x);
    }

    public int add(int val) {
        all.add(val);
        Collections.sort(all);
        return all.get(all.size() - k);
    }
}
