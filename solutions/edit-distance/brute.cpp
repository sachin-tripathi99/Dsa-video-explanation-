class Solution {
    int ed(const string& x, const string& y, int i, int j) {
        if (i == 0) return j;                               // insert the rest
        if (j == 0) return i;                               // delete the rest
        if (x[i - 1] == y[j - 1]) return ed(x, y, i - 1, j - 1);
        return 1 + min({ed(x, y, i - 1, j - 1), ed(x, y, i - 1, j), ed(x, y, i, j - 1)});
    }
public:
    int minDistance(string word1, string word2) {
        return ed(word1, word2, word1.size(), word2.size());
    }
};
