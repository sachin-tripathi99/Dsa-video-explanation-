class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        def best(day, holding):
            if day == len(prices):
                return 0
            skip = best(day + 1, holding)
            if holding:
                trade = prices[day] + best(day + 1, False)    # sell
            else:
                trade = -prices[day] + best(day + 1, True)    # buy
            return max(skip, trade)

        return best(0, False)
