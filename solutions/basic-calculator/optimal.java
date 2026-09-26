class Solution {
    public int calculate(String s) {
        int result = 0, sign = 1, num = 0;
        Deque<Integer> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) num = num * 10 + (c - '0');
            else if (c == '+' || c == '-') {
                result += sign * num;
                num = 0;
                sign = c == '+' ? 1 : -1;
            } else if (c == '(') {                              // save the outer context
                st.push(result);
                st.push(sign);
                result = 0;
                sign = 1;
            } else if (c == ')') {                              // combine with it
                result += sign * num;
                num = 0;
                int sg = st.pop(), prev = st.pop();
                result = prev + sg * result;
            }
        }
        return result + sign * num;
    }
}
