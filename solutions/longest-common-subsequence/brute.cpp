class Solution {
    int lcs(const string& x, const string& y, int i, int j) {
        if (i == 0 || j == 0) return 0;
        if (x[i - 1] == y[j - 1]) return 1 + lcs(x, y, i - 1, j - 1);   // use both
        return max(lcs(x, y, i - 1, j), lcs(x, y, i, j - 1));          // drop one
    }
public:
    int longestCommonSubsequence(string text1, string text2) {
        return lcs(text1, text2, text1.size(), text2.size());
    }
};
