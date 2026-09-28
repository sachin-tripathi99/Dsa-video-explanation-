import sys
from functools import cache

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        sys.setrecursionlimit(300000)

        @cache                                  # (day, trades left, holding) once
        def best(day, left, holding):
            if day == len(prices) or left == 0:
                return 0
            wait = best(day + 1, left, holding)
            if holding:
                act = prices[day] + best(day + 1, left - 1, False)   # sell ends a trade
            else:
                act = -prices[day] + best(day + 1, left, True)       # buy
            return max(wait, act)

        return best(0, 2, False)
