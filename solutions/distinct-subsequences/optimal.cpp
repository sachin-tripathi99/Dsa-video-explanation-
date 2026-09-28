class Solution {
public:
    int numDistinct(string s, string t) {
        int n = t.size();
        vector<unsigned long long> dp(n + 1, 0);            // dp[j]: ways to form t[:j]
        dp[0] = 1;
        for (char a : s)
            for (int j = n; j >= 1; j--)                    // right to left: read the old row
                if (a == t[j - 1]) dp[j] = (dp[j] + dp[j - 1]) % (1ULL << 32);
        return (int)dp[n];
    }
};
