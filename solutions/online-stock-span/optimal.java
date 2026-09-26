class StockSpanner {
    private final Deque<int[]> st = new ArrayDeque<>();   // {price, span}, prices decreasing

    public StockSpanner() {}

    public int next(int price) {
        int span = 1;
        while (!st.isEmpty() && st.peek()[0] <= price) span += st.pop()[1];   // absorb its span
        st.push(new int[]{price, span});
        return span;
    }
}
