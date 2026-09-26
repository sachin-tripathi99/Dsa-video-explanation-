class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        n = len(nums)
        P = [0] * (n + 1)
        for i, x in enumerate(nums):
            P[i + 1] = P[i] + x
        INF = float("inf")
        dp = [[INF] * (n + 1) for _ in range(k + 1)]   # dp[j][i]: first i numbers into j parts
        dp[0][0] = 0
        for j in range(1, k + 1):
            for i in range(1, n + 1):
                for p in range(j - 1, i):
                    if dp[j - 1][p] < INF:
                        dp[j][i] = min(dp[j][i], max(dp[j - 1][p], P[i] - P[p]))
        return dp[k][n]
