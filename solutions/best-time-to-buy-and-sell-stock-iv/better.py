import sys
from functools import cache

class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        sys.setrecursionlimit(20000)

        @cache                                  # (day, trades left, holding) once
        def best(day, left, holding):
            if day == len(prices) or left == 0:
                return 0
            wait = best(day + 1, left, holding)
            if holding:
                act = prices[day] + best(day + 1, left - 1, False)
            else:
                act = -prices[day] + best(day + 1, left, True)
            return max(wait, act)

        return best(0, k, False)
