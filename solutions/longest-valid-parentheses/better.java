class Solution {
    public int longestValidParentheses(String s) {
        Deque<Integer> st = new ArrayDeque<>();
        st.push(-1);                                     // base: index before the current run
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') st.push(i);
            else {
                st.pop();
                if (st.isEmpty()) st.push(i);            // unmatched ")" is the new base
                else best = Math.max(best, i - st.peek());
            }
        }
        return best;
    }
}
