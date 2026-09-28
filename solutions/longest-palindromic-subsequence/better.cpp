class Solution {
    vector<vector<int>> memo;
    int lps(const string& s, int i, int j) {
        if (i > j) return 0;
        if (i == j) return 1;
        int& m = memo[i][j];
        if (m) return m;                                    // solved before
        if (s[i] == s[j]) return m = 2 + lps(s, i + 1, j - 1);
        return m = max(lps(s, i + 1, j), lps(s, i, j - 1));
    }
public:
    int longestPalindromeSubseq(string s) {
        memo.assign(s.size(), vector<int>(s.size(), 0));
        return lps(s, 0, s.size() - 1);
    }
};
