class Solution {
public:
    int maxCoins(vector<int>& nums) {
        vector<int> p = {1};
        p.insert(p.end(), nums.begin(), nums.end());
        p.push_back(1);
        int m = p.size();
        vector<vector<int>> dp(m, vector<int>(m, 0));
        for (int len = 2; len < m; len++)                   // narrow intervals first
            for (int i = 0; i + len < m; i++) {
                int j = i + len;
                for (int k = i + 1; k < j; k++)             // k bursts last
                    dp[i][j] = max(dp[i][j], dp[i][k] + dp[k][j] + p[i] * p[k] * p[j]);
            }
        return dp[0][m - 1];
    }
};
