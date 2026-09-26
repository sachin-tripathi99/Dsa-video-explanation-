class Solution {
    bool go(const string& s, int i, int open) {
        if (open < 0) return false;
        if (i == (int)s.size()) return open == 0;
        if (s[i] == '(') return go(s, i + 1, open + 1);
        if (s[i] == ')') return go(s, i + 1, open - 1);
        return go(s, i + 1, open + 1) || go(s, i + 1, open - 1) || go(s, i + 1, open);   // * as ( ) or empty
    }
public:
    bool checkValidString(string s) {
        return go(s, 0, 0);
    }
};
