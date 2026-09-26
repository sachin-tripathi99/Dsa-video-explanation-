class Solution {
    public int maximalRectangle(char[][] matrix) {
        int n = matrix[0].length, best = 0;
        int[] h = new int[n];
        for (char[] row : matrix) {
            for (int j = 0; j < n; j++) h[j] = row[j] == '1' ? h[j] + 1 : 0;   // histogram for this row
            best = Math.max(best, largest(h));
        }
        return best;
    }

    private int largest(int[] h) {                          // Largest Rectangle in Histogram
        int n = h.length, best = 0;
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i <= n; i++) {
            int x = i == n ? 0 : h[i];
            while (!st.isEmpty() && h[st.peek()] > x) {
                int t = st.pop();
                int left = st.isEmpty() ? -1 : st.peek();
                best = Math.max(best, h[t] * (i - left - 1));
            }
            st.push(i);
        }
        return best;
    }
}
