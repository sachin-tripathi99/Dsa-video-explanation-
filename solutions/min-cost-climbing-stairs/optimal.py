class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        prev2 = prev1 = 0                       # dp[i − 2], dp[i − 1]
        for i in range(2, len(cost) + 1):
            prev2, prev1 = prev1, min(prev1 + cost[i - 1], prev2 + cost[i - 2])
        return prev1
