class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        def best(day, holding):
            if day >= len(prices):
                return 0
            wait = best(day + 1, holding)
            if holding:
                act = prices[day] + best(day + 2, False)   # sell, then skip a day
            else:
                act = -prices[day] + best(day + 1, True)   # buy
            return max(wait, act)
        return best(0, False)
