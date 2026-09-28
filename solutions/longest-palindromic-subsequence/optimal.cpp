class Solution {
public:
    int longestPalindromeSubseq(string s) {
        int n = s.size();
        vector<int> dp(n, 0);                               // dp[j] = lps(i, j) for the current i
        for (int i = n - 1; i >= 0; i--) {
            dp[i] = 1;
            int diag = 0;                                   // lps(i+1, j−1) from the previous row
            for (int j = i + 1; j < n; j++) {
                int keep = dp[j];                           // lps(i+1, j)
                dp[j] = s[i] == s[j] ? diag + 2 : max(dp[j], dp[j - 1]);
                diag = keep;
            }
        }
        return dp[n - 1];
    }
};
