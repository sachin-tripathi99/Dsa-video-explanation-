class Solution {
public:
    int countSubstrings(string s) {
        int n = s.size(), count = 0;
        vector<vector<bool>> pal(n, vector<bool>(n, false));
        for (int len = 1; len <= n; len++)
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                pal[i][j] = s[i] == s[j] && (len <= 2 || pal[i + 1][j - 1]);
                if (pal[i][j]) count++;
            }
        return count;
    }
};
