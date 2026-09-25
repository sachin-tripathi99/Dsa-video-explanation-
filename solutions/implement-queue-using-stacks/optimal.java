class MyQueue {
    private final Deque<Integer> in = new ArrayDeque<>(), out = new ArrayDeque<>();

    public void push(int x) { in.push(x); }

    public int pop() { peek(); return out.pop(); }

    public int peek() {
        if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop());   // pour only when needed
        return out.peek();
    }

    public boolean empty() { return in.isEmpty() && out.isEmpty(); }
}
