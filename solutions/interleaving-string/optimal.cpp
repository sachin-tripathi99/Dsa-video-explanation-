class Solution {
public:
    bool isInterleave(string s1, string s2, string s3) {
        int m = s1.size(), n = s2.size();
        if (m + n != (int)s3.size()) return false;
        vector<bool> dp(n + 1, false);                      // one row
        for (int i = 0; i <= m; i++)
            for (int j = 0; j <= n; j++) {
                if (i == 0 && j == 0) { dp[0] = true; continue; }
                char want = s3[i + j - 1];
                bool fromUp = i > 0 && dp[j] && s1[i - 1] == want;
                bool fromLeft = j > 0 && dp[j - 1] && s2[j - 1] == want;
                dp[j] = fromUp || fromLeft;
            }
        return dp[n];
    }
};
