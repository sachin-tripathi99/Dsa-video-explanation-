class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        n, i, profit = len(prices), 0, 0
        while i < n - 1:
            while i < n - 1 and prices[i + 1] <= prices[i]:
                i += 1                          # down to a valley
            valley = prices[i]
            while i < n - 1 and prices[i + 1] > prices[i]:
                i += 1                          # up to a peak
            profit += prices[i] - valley
        return profit
