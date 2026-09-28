class Solution {
public:
    string shortestPalindrome(string s) {
        int n = s.size();
        string rev(s.rbegin(), s.rend());
        string c = s + "#" + rev;                           // '#' keeps borders within s
        vector<int> lps(c.size());
        for (int i = 1, len = 0; i < (int)c.size(); ) {
            if (c[i] == c[len]) lps[i++] = ++len;
            else if (len) len = lps[len - 1];
            else lps[i++] = 0;
        }
        int l = lps.back();                                 // longest palindromic prefix
        return rev.substr(0, n - l) + s;
    }
};
