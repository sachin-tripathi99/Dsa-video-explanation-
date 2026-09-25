class RecentCounter {
    private final Deque<Integer> q = new ArrayDeque<>();

    public int ping(int t) {
        q.offer(t);
        while (q.peek() < t - 3000) q.poll();           // expire from the front
        return q.size();
    }
}
