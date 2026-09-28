class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        dp = [0] * (len(triangle) + 1)          # cheapest from the row below
        for row in reversed(triangle):
            for c, x in enumerate(row):
                dp[c] = x + min(dp[c], dp[c + 1])
        return dp[0]
