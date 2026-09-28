class Solution {
    bool isPal(const string& s, int l, int r) {
        while (l < r) if (s[l++] != s[r--]) return false;
        return true;
    }
public:
    string longestPalindrome(string s) {
        int bi = 0, bj = 0;
        for (int i = 0; i < (int)s.size(); i++)
            for (int j = i; j < (int)s.size(); j++)
                if (j - i > bj - bi && isPal(s, i, j)) { bi = i; bj = j; }   // every substring
        return s.substr(bi, bj - bi + 1);
    }
};
