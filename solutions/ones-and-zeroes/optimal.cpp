class Solution {
public:
    int findMaxForm(vector<string>& strs, int m, int n) {
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));   // dp[z][o]: most strings within budgets
        for (auto& s : strs) {
            int zs = count(s.begin(), s.end(), '0'), os = s.size() - zs;
            for (int z = m; z >= zs; z--)                   // both budgets high → low
                for (int o = n; o >= os; o--) dp[z][o] = max(dp[z][o], dp[z - zs][o - os] + 1);
        }
        return dp[m][n];
    }
};
