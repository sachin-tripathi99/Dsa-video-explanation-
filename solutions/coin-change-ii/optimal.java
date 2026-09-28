class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;                                          // take nothing
        for (int c : coins)                                 // coins outer → combinations
            for (int a = c; a <= amount; a++) dp[a] += dp[a - c];   // forward: coin reusable
        return dp[amount];
    }
}
