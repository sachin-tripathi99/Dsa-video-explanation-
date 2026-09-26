class Solution {
    vector<string> out;
    string s;
    void go(int n, int open, int close) {
        if ((int)s.size() == 2 * n) { out.push_back(s); return; }
        if (open < n) { s.push_back('('); go(n, open + 1, close); s.pop_back(); }
        if (close < open) { s.push_back(')'); go(n, open, close + 1); s.pop_back(); }
    }
public:
    vector<string> generateParenthesis(int n) {
        go(n, 0, 0);
        return out;
    }
};
