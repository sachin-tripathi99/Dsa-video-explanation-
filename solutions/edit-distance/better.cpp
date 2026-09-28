class Solution {
    vector<vector<int>> memo;
    int ed(const string& x, const string& y, int i, int j) {
        if (i == 0) return j;
        if (j == 0) return i;
        int& m = memo[i][j];
        if (m >= 0) return m;                               // solved before
        if (x[i - 1] == y[j - 1]) return m = ed(x, y, i - 1, j - 1);
        return m = 1 + min({ed(x, y, i - 1, j - 1), ed(x, y, i - 1, j), ed(x, y, i, j - 1)});
    }
public:
    int minDistance(string word1, string word2) {
        memo.assign(word1.size() + 1, vector<int>(word2.size() + 1, -1));
        return ed(word1, word2, word1.size(), word2.size());
    }
};
