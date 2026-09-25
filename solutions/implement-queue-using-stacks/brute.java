class MyQueue {
    private final Deque<Integer> s1 = new ArrayDeque<>(), s2 = new ArrayDeque<>();   // s1 top = oldest

    public void push(int x) {
        while (!s1.isEmpty()) s2.push(s1.pop());
        s1.push(x);
        while (!s2.isEmpty()) s1.push(s2.pop());
    }
    public int pop() { return s1.pop(); }
    public int peek() { return s1.peek(); }
    public boolean empty() { return s1.isEmpty(); }
}
