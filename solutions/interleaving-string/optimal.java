class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        int m = s1.length(), n = s2.length();
        if (m + n != s3.length()) return false;
        boolean[] dp = new boolean[n + 1];                  // one row
        for (int i = 0; i <= m; i++)
            for (int j = 0; j <= n; j++) {
                if (i == 0 && j == 0) { dp[0] = true; continue; }
                char want = s3.charAt(i + j - 1);
                boolean fromUp = i > 0 && dp[j] && s1.charAt(i - 1) == want;
                boolean fromLeft = j > 0 && dp[j - 1] && s2.charAt(j - 1) == want;
                dp[j] = fromUp || fromLeft;
            }
        return dp[n];
    }
}
