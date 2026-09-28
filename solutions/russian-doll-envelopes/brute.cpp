class Solution {
public:
    int maxEnvelopes(vector<vector<int>>& envelopes) {
        sort(envelopes.begin(), envelopes.end());
        int n = envelopes.size(), best = 0;
        vector<int> dp(n, 1);                               // most envelopes ending with i outermost
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++)
                if (envelopes[j][0] < envelopes[i][0] && envelopes[j][1] < envelopes[i][1]) dp[i] = max(dp[i], dp[j] + 1);
            best = max(best, dp[i]);
        }
        return best;
    }
};
