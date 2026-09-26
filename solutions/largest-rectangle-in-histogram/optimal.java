class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length, best = 0;
        Deque<Integer> st = new ArrayDeque<>();            // indices, heights increasing
        for (int i = 0; i <= n; i++) {
            int h = i == n ? 0 : heights[i];              // sentinel flushes the stack
            while (!st.isEmpty() && heights[st.peek()] > h) {
                int t = st.pop();
                int left = st.isEmpty() ? -1 : st.peek();
                best = Math.max(best, heights[t] * (i - left - 1));
            }
            st.push(i);
        }
        return best;
    }
}
