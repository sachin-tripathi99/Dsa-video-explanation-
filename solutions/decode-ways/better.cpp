class Solution {
    vector<int> memo;
    int count(const string& s, int i) {
        if (i == (int)s.size()) return 1;
        if (s[i] == '0') return 0;
        if (memo[i] >= 0) return memo[i];                   // this suffix solved before
        int ways = count(s, i + 1);
        if (i + 1 < (int)s.size() && stoi(s.substr(i, 2)) <= 26) ways += count(s, i + 2);
        return memo[i] = ways;
    }
public:
    int numDecodings(string s) {
        memo.assign(s.size(), -1);
        return count(s, 0);
    }
};
