class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        stack<long long> st;
        for (auto& tok : tokens) {
            if (tok.size() == 1 && string("+-*/").find(tok) != string::npos) {
                long long b = st.top(); st.pop();    // b is the right operand
                long long a = st.top(); st.pop();
                if (tok == "+") st.push(a + b);
                else if (tok == "-") st.push(a - b);
                else if (tok == "*") st.push(a * b);
                else st.push(a / b);                 // truncates toward zero
            } else {
                st.push(stoll(tok));
            }
        }
        return (int) st.top();
    }
};
