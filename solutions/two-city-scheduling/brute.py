class Solution:
    def twoCitySchedCost(self, costs: List[List[int]]) -> int:
        m, n = len(costs), len(costs) // 2
        INF = float("inf")
        dp = [[INF] * (n + 1) for _ in range(m + 1)]   # dp[i][a]: first i people, a sent to A
        dp[0][0] = 0
        for i in range(1, m + 1):
            for a in range(min(i, n) + 1):
                dp[i][a] = dp[i - 1][a] + costs[i - 1][1]
                if a:
                    dp[i][a] = min(dp[i][a], dp[i - 1][a - 1] + costs[i - 1][0])
        return dp[m][n]
