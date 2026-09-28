class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        n = len(t)
        dp = [1] + [0] * n                      # dp[j]: ways to form t[:j]
        for a in s:
            for j in range(n, 0, -1):           # right to left: read the old row
                if a == t[j - 1]:
                    dp[j] += dp[j - 1]
        return dp[n]
