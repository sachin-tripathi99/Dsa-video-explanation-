class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        def best(day, left, holding):
            if day == len(prices) or left == 0:
                return 0
            wait = best(day + 1, left, holding)
            if holding:
                act = prices[day] + best(day + 1, left - 1, False)   # sell ends a trade
            else:
                act = -prices[day] + best(day + 1, left, True)       # buy
            return max(wait, act)
        return best(0, k, False)
