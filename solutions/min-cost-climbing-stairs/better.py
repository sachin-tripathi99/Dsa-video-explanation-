from functools import cache

class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        @cache                                  # each step solved once
        def best(i):
            if i <= 1:
                return 0
            return min(best(i - 1) + cost[i - 1], best(i - 2) + cost[i - 2])
        return best(len(cost))
