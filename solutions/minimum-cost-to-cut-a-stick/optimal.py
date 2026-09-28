class Solution:
    def minCost(self, n: int, cuts: List[int]) -> int:
        c = [0] + sorted(cuts) + [n]
        m = len(c)
        dp = [[0] * m for _ in range(m)]
        for length in range(2, m):              # narrow pieces first
            for i in range(m - length):
                j = i + length
                dp[i][j] = c[j] - c[i] + min(dp[i][k] + dp[k][j] for k in range(i + 1, j))   # first cut pays the length
        return dp[0][m - 1]
