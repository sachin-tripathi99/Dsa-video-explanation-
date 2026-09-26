class MedianFinder {
    private final PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());   // smaller half
    private final PriorityQueue<Integer> hi = new PriorityQueue<>();                            // bigger half

    public MedianFinder() {}

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());                            // largest small → hi
        if (hi.size() > lo.size()) lo.offer(hi.poll()); // lo keeps the extra one
    }

    public double findMedian() {
        return lo.size() > hi.size() ? lo.peek() : ((long) lo.peek() + hi.peek()) / 2.0;
    }
}
