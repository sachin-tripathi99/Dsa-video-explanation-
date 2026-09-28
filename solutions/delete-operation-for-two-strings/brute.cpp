class Solution {
    int del(const string& x, const string& y, int i, int j) {
        if (i == 0) return j;
        if (j == 0) return i;
        if (x[i - 1] == y[j - 1]) return del(x, y, i - 1, j - 1);   // keep both
        return 1 + min(del(x, y, i - 1, j), del(x, y, i, j - 1));  // delete one
    }
public:
    int minDistance(string word1, string word2) {
        return del(word1, word2, word1.size(), word2.size());
    }
};
