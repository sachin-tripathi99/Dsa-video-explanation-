class Solution {
public:
    int change(int amount, vector<int>& coins) {
        vector<unsigned long long> dp(amount + 1, 0);
        dp[0] = 1;                                          // take nothing
        for (int c : coins)                                 // coins outer → combinations
            for (int a = c; a <= amount; a++) dp[a] += dp[a - c];   // forward: coin reusable
        return (int)dp[amount];
    }
};
