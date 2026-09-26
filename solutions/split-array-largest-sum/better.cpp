class Solution {
public:
    int splitArray(vector<int>& nums, int k) {
        int n = nums.size();
        vector<long long> P(n + 1, 0);
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];
        const long long INF = LLONG_MAX / 4;
        vector<vector<long long>> dp(k + 1, vector<long long>(n + 1, INF));   // dp[j][i]: first i into j parts
        dp[0][0] = 0;
        for (int j = 1; j <= k; j++)
            for (int i = 1; i <= n; i++)
                for (int p = j - 1; p < i; p++)
                    if (dp[j - 1][p] < INF) dp[j][i] = min(dp[j][i], max(dp[j - 1][p], P[i] - P[p]));
        return (int)dp[k][n];
    }
};
