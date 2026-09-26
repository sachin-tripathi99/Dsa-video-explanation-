class Solution {
public:
    string decodeString(string s) {
        vector<pair<string, int>> stack;
        string cur;
        int k = 0;
        for (char c : s) {
            if (isdigit((unsigned char)c)) k = k * 10 + (c - '0');
            else if (c == '[') {                            // save the outer context
                stack.push_back({cur, k});
                cur.clear();
                k = 0;
            } else if (c == ']') {                          // combine with the saved context
                auto [prev, n] = stack.back();
                stack.pop_back();
                string rep = prev;
                for (int i = 0; i < n; i++) rep += cur;
                cur = rep;
            } else cur += c;
        }
        return cur;
    }
};
