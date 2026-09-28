class Solution {
public:
    bool repeatedSubstringPattern(string s) {
        int n = s.size();
        vector<int> lps(n);
        for (int i = 1, len = 0; i < n; ) {
            if (s[i] == s[len]) lps[i++] = ++len;
            else if (len) len = lps[len - 1];               // fall back to a shorter border
            else lps[i++] = 0;
        }
        int l = lps[n - 1], p = n - l;                      // p is the period
        return l > 0 && n % p == 0;
    }
};
