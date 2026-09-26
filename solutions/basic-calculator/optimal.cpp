class Solution {
public:
    int calculate(string s) {
        long long result = 0, sign = 1, num = 0;
        vector<pair<long long, long long>> st;
        for (char c : s) {
            if (isdigit((unsigned char)c)) num = num * 10 + (c - '0');
            else if (c == '+' || c == '-') {
                result += sign * num;
                num = 0;
                sign = c == '+' ? 1 : -1;
            } else if (c == '(') {                              // save the outer context
                st.push_back({result, sign});
                result = 0;
                sign = 1;
            } else if (c == ')') {                              // combine with it
                result += sign * num;
                num = 0;
                auto [prev, sg] = st.back();
                st.pop_back();
                result = prev + sg * result;
            }
        }
        return (int)(result + sign * num);
    }
};
