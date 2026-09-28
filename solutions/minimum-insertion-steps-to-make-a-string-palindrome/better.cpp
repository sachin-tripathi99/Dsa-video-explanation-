class Solution {
    vector<vector<int>> memo;
    int ins(const string& s, int i, int j) {
        if (i >= j) return 0;
        int& m = memo[i][j];
        if (m >= 0) return m;                               // solved before
        if (s[i] == s[j]) return m = ins(s, i + 1, j - 1);
        return m = 1 + min(ins(s, i + 1, j), ins(s, i, j - 1));
    }
public:
    int minInsertions(string s) {
        memo.assign(s.size(), vector<int>(s.size(), -1));
        return ins(s, 0, s.size() - 1);
    }
};
