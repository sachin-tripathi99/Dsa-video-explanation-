class Solution {
    size_t i = 0;
    long long eval(const string& s) {                    // evaluates until ")" or the end
        long long result = 0, sign = 1;
        while (i < s.size()) {
            char c = s[i];
            if (isdigit((unsigned char)c)) {
                long long num = 0;
                while (i < s.size() && isdigit((unsigned char)s[i])) num = num * 10 + (s[i++] - '0');
                result += sign * num;
                continue;
            }
            i++;
            if (c == '+') sign = 1;
            else if (c == '-') sign = -1;
            else if (c == '(') result += sign * eval(s); // recurse into the bracket
            else if (c == ')') return result;
        }
        return result;
    }
public:
    int calculate(string s) {
        i = 0;
        return (int)eval(s);
    }
};
