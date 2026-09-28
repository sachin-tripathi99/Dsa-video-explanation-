class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        hold, sold, rest = -prices[0], 0, 0
        for p in prices[1:]:
            hold, sold, rest = max(hold, rest - p), hold + p, max(rest, sold)   # buy only from REST
        return max(sold, rest)
