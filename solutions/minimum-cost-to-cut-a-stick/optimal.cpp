class Solution {
public:
    int minCost(int n, vector<int>& cuts) {
        vector<int> c = cuts;
        c.push_back(0);
        c.push_back(n);
        sort(c.begin(), c.end());                           // 0, sorted cuts, n
        int m = c.size();
        vector<vector<int>> dp(m, vector<int>(m, 0));
        for (int len = 2; len < m; len++)                   // narrow pieces first
            for (int i = 0; i + len < m; i++) {
                int j = i + len;
                dp[i][j] = INT_MAX;
                for (int k = i + 1; k < j; k++) dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]);
                dp[i][j] += c[j] - c[i];                    // the first cut pays the piece length
            }
        return dp[0][m - 1];
    }
};
