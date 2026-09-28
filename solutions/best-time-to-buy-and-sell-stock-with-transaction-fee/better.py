import sys
from functools import cache

class Solution:
    def maxProfit(self, prices: List[int], fee: int) -> int:
        sys.setrecursionlimit(200000)

        @cache                                  # (day, holding) once
        def best(day, holding):
            if day == len(prices):
                return 0
            wait = best(day + 1, holding)
            act = prices[day] - fee + best(day + 1, False) if holding else -prices[day] + best(day + 1, True)
            return max(wait, act)

        return best(0, False)
