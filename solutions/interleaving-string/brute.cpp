class Solution {
    bool ok(const string& a, const string& b, const string& c, int i, int j) {
        if (i == (int)a.size() && j == (int)b.size()) return true;
        char want = c[i + j];                               // position in s3 is i + j
        return (i < (int)a.size() && a[i] == want && ok(a, b, c, i + 1, j))
            || (j < (int)b.size() && b[j] == want && ok(a, b, c, i, j + 1));
    }
public:
    bool isInterleave(string s1, string s2, string s3) {
        if (s1.size() + s2.size() != s3.size()) return false;
        return ok(s1, s2, s3, 0, 0);
    }
};
