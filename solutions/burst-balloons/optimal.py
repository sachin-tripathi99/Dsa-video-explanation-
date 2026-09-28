class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        p = [1] + nums + [1]
        m = len(p)
        dp = [[0] * m for _ in range(m)]
        for length in range(2, m):              # narrow intervals first
            for i in range(m - length):
                j = i + length
                dp[i][j] = max(dp[i][k] + dp[k][j] + p[i] * p[k] * p[j] for k in range(i + 1, j))   # k bursts last
        return dp[0][m - 1]
