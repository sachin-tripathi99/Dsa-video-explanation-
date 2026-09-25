class MinStack {
    private final Deque<Integer> st = new ArrayDeque<>();

    public void push(int val) { st.push(val); }
    public void pop() { st.pop(); }
    public int top() { return st.peek(); }
    public int getMin() {
        int m = Integer.MAX_VALUE;
        for (int x : st) m = Math.min(m, x);   // O(n) scan
        return m;
    }
}
