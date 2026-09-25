class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price, best = float("inf"), 0
        for p in prices:
            min_price = min(min_price, p)        # cheapest day to have bought
            best = max(best, p - min_price)      # sell today
        return best
