class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        dp = [1] + [0] * amount                 # dp[0]: take nothing
        for c in coins:                         # coins outer → combinations
            for a in range(c, amount + 1):      # forward: coin reusable
                dp[a] += dp[a - c]
        return dp[amount]
