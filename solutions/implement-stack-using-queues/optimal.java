class MyStack {
    private final Deque<Integer> q = new ArrayDeque<>();

    public void push(int x) {
        q.offer(x);
        for (int k = 0; k < q.size() - 1; k++) q.offer(q.poll());   // rotate: newest to the front
    }
    public int pop() { return q.poll(); }
    public int top() { return q.peek(); }
    public boolean empty() { return q.isEmpty(); }
}
