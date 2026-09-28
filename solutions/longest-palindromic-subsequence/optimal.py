class Solution:
    def longestPalindromeSubseq(self, s: str) -> int:
        n = len(s)
        dp = [0] * n                            # dp[j] = lps(i, j) for the current i
        for i in range(n - 1, -1, -1):
            dp[i] = 1
            diag = 0                            # lps(i+1, j−1) from the previous row
            for j in range(i + 1, n):
                keep = dp[j]                    # lps(i+1, j)
                dp[j] = diag + 2 if s[i] == s[j] else max(dp[j], dp[j - 1])
                diag = keep
        return dp[n - 1]
