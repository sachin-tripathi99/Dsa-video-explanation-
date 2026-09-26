class Solution {
public:
    int twoCitySchedCost(vector<vector<int>>& costs) {
        int m = costs.size(), n = m / 2;
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, INT_MAX / 2));   // dp[i][a]: first i people, a sent to A
        dp[0][0] = 0;
        for (int i = 1; i <= m; i++)
            for (int a = 0; a <= min(i, n); a++) {
                dp[i][a] = dp[i - 1][a] + costs[i - 1][1];
                if (a) dp[i][a] = min(dp[i][a], dp[i - 1][a - 1] + costs[i - 1][0]);
            }
        return dp[m][n];
    }
};
