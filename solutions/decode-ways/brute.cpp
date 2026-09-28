class Solution {
    int count(const string& s, int i) {                     // ways to decode s[i:]
        if (i == (int)s.size()) return 1;
        if (s[i] == '0') return 0;                          // no letter starts with 0
        int ways = count(s, i + 1);
        if (i + 1 < (int)s.size() && stoi(s.substr(i, 2)) <= 26) ways += count(s, i + 2);
        return ways;
    }
public:
    int numDecodings(string s) {
        return count(s, 0);
    }
};
