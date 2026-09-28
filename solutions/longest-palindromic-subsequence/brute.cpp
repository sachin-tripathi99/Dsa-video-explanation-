class Solution {
    int lps(const string& s, int i, int j) {
        if (i > j) return 0;
        if (i == j) return 1;
        if (s[i] == s[j]) return 2 + lps(s, i + 1, j - 1);  // both ends join
        return max(lps(s, i + 1, j), lps(s, i, j - 1));     // drop one end
    }
public:
    int longestPalindromeSubseq(string s) {
        return lps(s, 0, s.size() - 1);
    }
};
