class Solution {
public:
    int calculate(string s) {
        long long result = 0, last = 0, num = 0;
        char op = '+';
        for (size_t i = 0; i < s.size(); i++) {
            char c = s[i];
            if (isdigit((unsigned char)c)) num = num * 10 + (c - '0');
            if ((!isdigit((unsigned char)c) && c != ' ') || i == s.size() - 1) {
                if (op == '+' || op == '-') {                   // close the previous term
                    result += last;
                    last = op == '+' ? num : -num;
                } else if (op == '*') last = last * num;        // × ÷ change the open term
                else last = last / num;
                op = c;
                num = 0;
            }
        }
        return (int)(result + last);
    }
};
