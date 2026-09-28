class Solution:
    def findMaxForm(self, strs: List[str], m: int, n: int) -> int:
        dp = [[0] * (n + 1) for _ in range(m + 1)]   # dp[z][o]: most strings within budgets
        for s in strs:
            zs, os = s.count("0"), s.count("1")
            for z in range(m, zs - 1, -1):      # both budgets high → low
                for o in range(n, os - 1, -1):
                    dp[z][o] = max(dp[z][o], dp[z - zs][o - os] + 1)
        return dp[m][n]
