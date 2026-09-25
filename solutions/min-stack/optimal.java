class MinStack {
    private final Deque<int[]> st = new ArrayDeque<>();   // {value, min so far}

    public void push(int val) {
        int m = st.isEmpty() ? val : Math.min(val, st.peek()[1]);
        st.push(new int[]{val, m});
    }
    public void pop() { st.pop(); }
    public int top() { return st.peek()[0]; }
    public int getMin() { return st.peek()[1]; }
}
