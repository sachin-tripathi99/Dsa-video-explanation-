class MyStack {
    private Deque<Integer> q1 = new ArrayDeque<>(), q2 = new ArrayDeque<>();

    public void push(int x) { q1.offer(x); }

    public int pop() {
        while (q1.size() > 1) q2.offer(q1.poll());   // move all but the newest
        int x = q1.poll();
        Deque<Integer> t = q1; q1 = q2; q2 = t;
        return x;
    }

    public int top() { int x = pop(); push(x); return x; }

    public boolean empty() { return q1.isEmpty(); }
}
