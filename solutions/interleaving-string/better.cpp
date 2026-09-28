class Solution {
    vector<vector<int>> memo;
    bool ok(const string& a, const string& b, const string& c, int i, int j) {
        if (i == (int)a.size() && j == (int)b.size()) return true;
        int& m = memo[i][j];
        if (m != -1) return m;                              // solved before
        char want = c[i + j];
        return m = (i < (int)a.size() && a[i] == want && ok(a, b, c, i + 1, j))
                || (j < (int)b.size() && b[j] == want && ok(a, b, c, i, j + 1));
    }
public:
    bool isInterleave(string s1, string s2, string s3) {
        if (s1.size() + s2.size() != s3.size()) return false;
        memo.assign(s1.size() + 1, vector<int>(s2.size() + 1, -1));
        return ok(s1, s2, s3, 0, 0);
    }
};
