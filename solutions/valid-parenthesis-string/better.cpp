class Solution {
    vector<vector<int>> memo;                               // -1 unknown, 0 false, 1 true
    bool go(const string& s, int i, int open) {
        if (open < 0 || open > (int)s.size() - i) return false;   // cannot close that many
        if (i == (int)s.size()) return open == 0;
        int& m = memo[i][open];
        if (m != -1) return m;
        bool r;
        if (s[i] == '(') r = go(s, i + 1, open + 1);
        else if (s[i] == ')') r = go(s, i + 1, open - 1);
        else r = go(s, i + 1, open + 1) || go(s, i + 1, open - 1) || go(s, i + 1, open);
        return m = r;
    }
public:
    bool checkValidString(string s) {
        memo.assign(s.size() + 1, vector<int>(s.size() + 2, -1));
        return go(s, 0, 0);
    }
};
