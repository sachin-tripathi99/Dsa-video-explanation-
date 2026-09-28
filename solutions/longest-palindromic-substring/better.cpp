class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.size(), bi = 0, bj = 0;
        vector<vector<bool>> pal(n, vector<bool>(n, false));
        for (int len = 1; len <= n; len++)                  // short ranges first
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                pal[i][j] = s[i] == s[j] && (len <= 2 || pal[i + 1][j - 1]);
                if (pal[i][j] && len > bj - bi + 1) { bi = i; bj = j; }
            }
        return s.substr(bi, bj - bi + 1);
    }
};
