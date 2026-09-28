class Solution:
    def numSquares(self, n: int) -> int:
        squares = [s * s for s in range(1, int(n ** 0.5) + 1)]
        dp = [0] + [n] * n                      # n ones is always possible
        for i in range(1, n + 1):
            for q in squares:
                if q > i:
                    break
                if dp[i - q] + 1 < dp[i]:
                    dp[i] = dp[i - q] + 1       # last square q
        return dp[n]
