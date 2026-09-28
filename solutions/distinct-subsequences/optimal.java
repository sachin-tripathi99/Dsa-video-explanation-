class Solution {
    public int numDistinct(String s, String t) {
        int n = t.length();
        int[] dp = new int[n + 1];                          // dp[j]: ways to form t[:j]
        dp[0] = 1;
        for (int i = 1; i <= s.length(); i++)
            for (int j = Math.min(i, n); j >= 1; j--)       // right to left: read the old row
                if (s.charAt(i - 1) == t.charAt(j - 1)) dp[j] += dp[j - 1];
        return dp[n];
    }
}
