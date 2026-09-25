class Solution {
    static bool isOp(const string& s) { return s.size() == 1 && string("+-*/").find(s) != string::npos; }
public:
    int evalRPN(vector<string>& tokens) {
        vector<string> t = tokens;
        while (t.size() > 1) {
            size_t i = 0;
            while (!isOp(t[i])) i++;                         // first operator
            long long a = stoll(t[i - 2]), b = stoll(t[i - 1]);
            long long r = t[i] == "+" ? a + b : t[i] == "-" ? a - b : t[i] == "*" ? a * b : a / b;
            t.erase(t.begin() + i - 2, t.begin() + i + 1);   // replace a, b, op with the result
            t.insert(t.begin() + i - 2, to_string(r));
        }
        return stoi(t[0]);
    }
};
