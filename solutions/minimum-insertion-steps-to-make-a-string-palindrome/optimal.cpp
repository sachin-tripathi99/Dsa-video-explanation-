class Solution {
public:
    int minInsertions(string s) {
        int n = s.size();
        vector<int> dp(n, 0);                               // dp[j] = ins(i, j) for the current i
        for (int i = n - 2; i >= 0; i--) {
            int diag = 0;                                   // ins(i+1, j−1)
            for (int j = i + 1; j < n; j++) {
                int keep = dp[j];                           // ins(i+1, j)
                dp[j] = s[i] == s[j] ? diag : 1 + min(dp[j], dp[j - 1]);
                diag = keep;
            }
        }
        return dp[n - 1];
    }
};
