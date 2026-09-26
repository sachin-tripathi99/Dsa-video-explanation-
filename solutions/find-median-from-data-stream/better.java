class MedianFinder {
    private final List<Integer> a = new ArrayList<>();   // kept sorted

    public MedianFinder() {}

    public void addNum(int num) {
        int lo = 0, hi = a.size();
        while (lo < hi) {                               // first index with a[i] ≥ num
            int m = (lo + hi) >>> 1;
            if (a.get(m) < num) lo = m + 1; else hi = m;
        }
        a.add(lo, num);                                 // shifts later elements: O(n)
    }

    public double findMedian() {
        int n = a.size();
        return n % 2 == 1 ? a.get(n / 2) : ((long) a.get(n / 2 - 1) + a.get(n / 2)) / 2.0;
    }
}
