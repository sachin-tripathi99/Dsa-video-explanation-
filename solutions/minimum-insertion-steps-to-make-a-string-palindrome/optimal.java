class Solution {
    public int minInsertions(String s) {
        int n = s.length();
        int[] dp = new int[n];                              // dp[j] = ins(i, j) for the current i
        for (int i = n - 2; i >= 0; i--) {
            int diag = 0;                                   // ins(i+1, j−1)
            for (int j = i + 1; j < n; j++) {
                int keep = dp[j];                           // ins(i+1, j)
                dp[j] = s.charAt(i) == s.charAt(j) ? diag : 1 + Math.min(dp[j], dp[j - 1]);
                diag = keep;
            }
        }
        return dp[n - 1];
    }
}
