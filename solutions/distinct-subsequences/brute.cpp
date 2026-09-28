class Solution {
    int ways(const string& s, const string& t, int i, int j) {
        if (j == (int)t.size()) return 1;                   // all of t matched
        if (i == (int)s.size()) return 0;
        int res = ways(s, t, i + 1, j);                     // skip s[i]
        if (s[i] == t[j]) res += ways(s, t, i + 1, j + 1);  // use it
        return res;
    }
public:
    int numDistinct(string s, string t) {
        return ways(s, t, 0, 0);
    }
};
