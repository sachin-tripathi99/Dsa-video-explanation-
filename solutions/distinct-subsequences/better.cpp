class Solution {
    vector<vector<long long>> memo;
    long long ways(const string& s, const string& t, int i, int j) {
        if (j == (int)t.size()) return 1;
        if (i == (int)s.size()) return 0;
        long long& m = memo[i][j];
        if (m >= 0) return m;                               // solved before
        long long res = ways(s, t, i + 1, j);
        if (s[i] == t[j]) res += ways(s, t, i + 1, j + 1);
        return m = res % (1LL << 32);                       // intermediates may exceed 32 bits
    }
public:
    int numDistinct(string s, string t) {
        memo.assign(s.size(), vector<long long>(t.size(), -1));
        return (int)ways(s, t, 0, 0);
    }
};
