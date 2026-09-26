class MedianFinder {
    private final List<Integer> a = new ArrayList<>();

    public MedianFinder() {}

    public void addNum(int num) { a.add(num); }

    public double findMedian() {
        Collections.sort(a);                            // sort on every query
        int n = a.size();
        return n % 2 == 1 ? a.get(n / 2) : ((long) a.get(n / 2 - 1) + a.get(n / 2)) / 2.0;
    }
}
