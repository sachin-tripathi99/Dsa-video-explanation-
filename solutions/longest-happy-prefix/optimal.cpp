class Solution {
public:
    string longestPrefix(string s) {
        int n = s.size();
        vector<int> lps(n);
        for (int i = 1, len = 0; i < n; ) {
            if (s[i] == s[len]) lps[i++] = ++len;
            else if (len) len = lps[len - 1];               // fall back to a shorter border
            else lps[i++] = 0;
        }
        return s.substr(0, lps[n - 1]);
    }
};
