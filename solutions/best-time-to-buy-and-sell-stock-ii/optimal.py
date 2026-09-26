class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        return sum(max(0, b - a) for a, b in zip(prices, prices[1:]))   # every upward move
