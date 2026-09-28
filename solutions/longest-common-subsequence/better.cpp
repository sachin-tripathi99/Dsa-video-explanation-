class Solution {
    vector<vector<int>> memo;
    int lcs(const string& x, const string& y, int i, int j) {
        if (i == 0 || j == 0) return 0;
        int& m = memo[i][j];
        if (m >= 0) return m;                               // solved before
        if (x[i - 1] == y[j - 1]) return m = 1 + lcs(x, y, i - 1, j - 1);
        return m = max(lcs(x, y, i - 1, j), lcs(x, y, i, j - 1));
    }
public:
    int longestCommonSubsequence(string text1, string text2) {
        memo.assign(text1.size() + 1, vector<int>(text2.size() + 1, -1));
        return lcs(text1, text2, text1.size(), text2.size());
    }
};
