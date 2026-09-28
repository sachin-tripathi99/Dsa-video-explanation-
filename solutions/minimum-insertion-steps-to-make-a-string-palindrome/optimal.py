class Solution:
    def minInsertions(self, s: str) -> int:
        n = len(s)
        dp = [0] * n                            # dp[j] = ins(i, j) for the current i
        for i in range(n - 2, -1, -1):
            diag = 0                            # ins(i+1, j−1)
            for j in range(i + 1, n):
                keep = dp[j]                    # ins(i+1, j)
                dp[j] = diag if s[i] == s[j] else 1 + min(dp[j], dp[j - 1])
                diag = keep
        return dp[n - 1]
