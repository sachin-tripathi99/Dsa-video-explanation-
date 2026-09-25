class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> st = new ArrayDeque<>();
        for (String tok : tokens) {
            if (tok.length() == 1 && "+-*/".contains(tok)) {
                int b = st.pop(), a = st.pop();              // b is the right operand
                switch (tok) {
                    case "+": st.push(a + b); break;
                    case "-": st.push(a - b); break;
                    case "*": st.push(a * b); break;
                    default: st.push(a / b);                 // truncates toward zero
                }
            } else {
                st.push(Integer.parseInt(tok));
            }
        }
        return st.pop();
    }
}
